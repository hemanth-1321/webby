import { FileItem } from "@/components/builder/file-explorer";

export const fileContents: Record<string, string> = {
  "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <h1>Welcome to My Website</h1>
    <script src="scripts/app.js"></script>
</body>
</html>`,
  "main.css": `body {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}`,
  "app.js": `document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded successfully!');
});`,
};

export function getFileContent(file: FileItem | null): string {
  if (!file || file.type !== "file") return "// Empty file";
  return file.content || "// Empty file";
}

export function getFileLanguage(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "html":
      return "html";
    case "css":
      return "css";
    case "js":
      return "javascript";
    case "json":
      return "json";
    case "ts":
    case "tsx":
      return "typescript";
    default:
      return "plaintext";
  }
}
