"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Eye } from "lucide-react";
import Editor from "@monaco-editor/react";
import { FileItem } from "./file-explorer";
import { WebContainer } from "@webcontainer/api";
import { PreviewFrame } from "./PreviewFrame";

interface CodePreviewProps {
  currentFile: string; // currentFile is just the path string
  files: FileItem[];
  webContainer?: any;
}

export function CodePreview({
  currentFile,
  files,
  webContainer,
}: CodePreviewProps) {
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");

  // useEffect(() => {
  //   console.log("page mounted", webContainer?.spawn("npm", ["install"]));
  // }, []);
  // async function main() {
  //   const installProcess = await webContainer?.spawn("npm", ["install"]);
  //   installProcess?.output.pipeTo(
  //     new WritableStream({
  //       write(data) {
  //         console.log("installing", data);
  //       },
  //     })
  //   );
  // }

  // useEffect(() => {
  //   main();
  // }, []);

  useEffect(() => {
    if (currentFile) {
      // console.log("current file", currentFile);
      // Find the file recursively using the path
      const selectedFile = findFileByPath(files, currentFile);
      // console.log("selectedFile", selectedFile);

      if (selectedFile) {
        setCode(selectedFile.content || "");
        setFileName(selectedFile.name);
      } else {
        setCode("");
        setFileName("");
      }
    }
  }, [currentFile, files]);

  // Recursive function to find a file by path in the files array and its children
  const findFileByPath = (
    fileArray: FileItem[],
    path: string
  ): FileItem | undefined => {
    // First check in the current level
    for (const file of fileArray) {
      if (file.path === path) {
        return file;
      }

      // If this is a folder with children, search there
      if (file.children) {
        const found = findFileByPath(file.children, path);
        if (found) return found;
      }
    }

    return undefined;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <Tabs defaultValue="code" className="h-full">
      <div className="border-b">
        <div className="flex items-center justify-between px-4">
          <TabsList>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {fileName || "No file selected"}
            </span>
            <Button variant="ghost" size="sm">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <TabsContent value="code" className="h-[calc(100vh-97px)]">
        <Editor
          height="100%"
          defaultLanguage={getLanguageFromFilename(fileName)}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </TabsContent>
      <TabsContent value="preview" className="h-[calc(100vh-97px)]">
        <PreviewFrame files={files} webContainer={webContainer} />
      </TabsContent>
    </Tabs>
  );
}

// Helper function to determine the language based on file extension
function getLanguageFromFilename(filename: string): string {
  if (filename.endsWith(".ts") || filename.endsWith(".tsx"))
    return "typescript";
  if (filename.endsWith(".js") || filename.endsWith(".jsx"))
    return "javascript";
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".json")) return "json";
  return "plaintext";
}
