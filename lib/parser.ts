import { Step, StepType } from "@/types/types";

export function parseXml(response: string): Step[] {
  const steps: Step[] = [];
  let stepId = 1;

  // Extract all <boltArtifact> tags
  const artifactRegex = /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/g;
  let artifactMatch;

  while ((artifactMatch = artifactRegex.exec(response)) !== null) {
    const xmlContent = artifactMatch[1];

    // Extract artifact title
    const titleMatch = artifactMatch[0].match(/title="([^"]*)"/);
    const artifactTitle = titleMatch ? titleMatch[1] : "Project Files";

    // Add initial artifact step
    steps.push({
      id: stepId++,
      title: artifactTitle,
      description: "",
      type: StepType.CreateFolder,
      status: "pending",
    });

    // Regular expression to find boltAction elements
    const actionRegex =
      /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

    let match;
    while ((match = actionRegex.exec(xmlContent)) !== null) {
      const [, type, filePath, content] = match;

      if (type === "file") {
        steps.push({
          id: stepId++,
          title: `Create ${filePath || "file"}`,
          description: "",
          type: StepType.CreateFile,
          status: "pending",
          code: content.trim(),
          path: filePath || "",
        });
      } else if (type === "shell") {
        steps.push({
          id: stepId++,
          title: "Run command",
          description: "",
          type: StepType.RunScript,
          status: "pending",
          code: content.trim(),
        });
      }
    }
  }

  if (!steps.length) {
    console.warn("No valid <boltArtifact> content found in the response.");
  }

  return steps;
}
