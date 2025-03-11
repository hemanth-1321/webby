'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Eye } from "lucide-react";
import Editor from "@monaco-editor/react";
import { getFileContent, getFileLanguage } from "@/lib/files";

interface CodePreviewProps {
  currentFile: string;
}

export function CodePreview({ currentFile }: CodePreviewProps) {
  const [code, setCode] = useState(getFileContent(currentFile));

  // Update code when currentFile changes
  useEffect(() => {
    setCode(getFileContent(currentFile));
  }, [currentFile]);

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
            <span className="text-sm text-muted-foreground">{currentFile}</span>
            <Button variant="ghost" size="sm">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <TabsContent value="code" className="h-[calc(100vh-97px)]">
        <Editor
          height="100%"
          language={getFileLanguage(currentFile)}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </TabsContent>
      <TabsContent value="preview" className="h-[calc(100vh-97px)]">
        <iframe
          title="Preview"
          className="w-full h-full"
          srcDoc={currentFile === 'index.html' ? code : ''}
        />
      </TabsContent>
    </Tabs>
  );
}