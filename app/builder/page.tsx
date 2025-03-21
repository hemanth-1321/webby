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
import { useWebContainer } from "@/hooks/useWebContainer";
import { FileNode } from "@webcontainer/api";

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [code, setCode] = useState<string>();
  const [currentFile, setCurrentFile] = useState<any | null>(null);
  const webcontainer = useWebContainer();
  const prompt = searchParams.get("prompt");

  console.log("builder", webcontainer);
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? [];
          let currentFileStructure = [...originalFiles];
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
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
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
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

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean): any => {
        if (file.type === "folder") {
          return {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processFile(child, false),
                  ])
                )
              : {},
          };
        } else if (file.type === "file") {
          return {
            file: {
              contents: file.content || "",
            },
          };
        }
      };

      files.forEach((file) => {
        mountStructure[file.name] = processFile(file, true);
      });

      return mountStructure;
    };

    if (files.length > 0 && webcontainer) {
      const mountStructure = createMountStructure(files);
      webcontainer.mount(mountStructure);
    }
  }, [files, webcontainer]);

  async function init() {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/template`, { prompt });
      const { prompts, uiPrompts } = response.data;

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
    } catch (error) {}
    setIsLoading(false);
  }

  useEffect(() => {
    if (prompt) {
      init();
    }
  }, [prompt]);

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
          <CodePreview
            currentFile={currentFile}
            files={files}
            webContainer={webcontainer}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
