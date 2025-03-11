"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, FileIcon, FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileItem {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileItem[];
  content?: string;
}

interface FileTreeItemProps {
  item: FileItem;
  level: number;
  activeFile: string;
  expandedFolders: string[];
  onFileClick: (path: string) => void;
  onFolderClick: (path: string) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  item,
  level,
  activeFile,
  expandedFolders,
  onFileClick,
  onFolderClick,
}) => {
  const isExpanded = expandedFolders.includes(item.path);
  const isActive = activeFile === item.path;

  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 h-8 px-2",
          isActive && "bg-accent",
          level > 0 && `ml-${level * 4}`
        )}
        onClick={() =>
          item.type === "folder"
            ? onFolderClick(item.path)
            : onFileClick(item.path)
        }
      >
        {item.type === "folder" && (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        )}
        {item.type === "folder" ? (
          <FolderIcon className="h-4 w-4 text-muted-foreground" />
        ) : (
          <FileIcon className="h-4 w-4 text-muted-foreground" />
        )}
        {item.name}
      </Button>
      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              level={level + 1}
              activeFile={activeFile}
              expandedFolders={expandedFolders}
              onFileClick={onFileClick}
              onFolderClick={onFolderClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function FileExplorer({
  onFileSelect,
  files,
}: {
  onFileSelect: (path: string) => void;
  files: any;
}) {
  console.log("files recived", files);
  const [activeFile, setActiveFile] = useState<string>("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["/"]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleFileClick = (path: string) => {
    setActiveFile(path);
    onFileSelect(path);
  };

  return (
    <div className="h-full border-r">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Files</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-57px)] p-4">
        {files.map((item: any) => (
          <FileTreeItem
            key={item.path}
            item={item}
            level={0}
            activeFile={activeFile}
            expandedFolders={expandedFolders}
            onFileClick={handleFileClick}
            onFolderClick={toggleFolder}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
