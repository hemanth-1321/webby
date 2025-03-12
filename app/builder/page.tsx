"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StepsPanel } from "@/components/builder/steps-panel";
import { FileExplorer, FileItem } from "@/components/builder/file-explorer";
import { CodePreview } from "@/components/builder/code-preview";
import { Step, StepType } from "@/types/types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { parseXml } from "@/lib/parser";

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [code, setCode] = useState<string>();
  const [currentFile, setCurrentFile] = useState<any | null>(null);

  const prompt = searchParams.get("prompt");

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
            completed: true,
          };
        })
      );
    }

    setCurrentFile(() => files.map((file) => file));
  }, [steps, files]);

  async function init() {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/template`, { prompt });
      const { prompts, uiPrompts } = response.data;
      console.log("UI Prompts Response:", uiPrompts);

      setSteps(
        parseXml(uiPrompts?.[0]).map((x: Step) => ({
          ...x,
          status: "pending",
        }))
      );

      const stepresponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map((content) => ({
          role: "user",
          content,
        })),
      });

      setSteps((s) => [
        ...s,
        ...parseXml(stepresponse.data.response).map((x) => ({
          ...x,
          status: "pending" as "pending",
        })),
      ]);

      console.log("Chat Response:", stepresponse.data.response);
    } catch (error) {
      console.error("Error initializing steps:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (prompt) {
      init();
    }
  }, [prompt]);
  console.log(currentFile?.content);
  return (
    <div className="mt-20 h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20}>
          <StepsPanel steps={steps} isLoading={isLoading} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={25} minSize={20}>
          <FileExplorer
            onFileSelect={setCurrentFile}
            files={files.map((file) => file)}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <CodePreview currentFile={currentFile} files={files} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
