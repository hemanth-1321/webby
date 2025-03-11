"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { StepsPanel } from "@/components/builder/steps-panel";
import { FileExplorer } from "@/components/builder/file-explorer";
import { CodePreview } from "@/components/builder/code-preview";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import axios from "axios";

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const [currentFile, setCurrentFile] = useState("index.html");
  const prompt = searchParams.get("prompt");
  console.log(prompt);
  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20}>
          <StepsPanel />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={25} minSize={20}>
          <FileExplorer onFileSelect={setCurrentFile} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <CodePreview currentFile={currentFile} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
