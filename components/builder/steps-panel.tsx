import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
  completed: boolean;
}

const steps: Step[] = [
  {
    title: "Project Setup",
    description: "Initialize project structure and dependencies",
    completed: true,
  },
  {
    title: "Layout Creation",
    description: "Generate basic HTML structure and styling",
    completed: true,
  },
  {
    title: "Content Population",
    description: "Add content based on the provided description",
    completed: false,
  },
  {
    title: "Styling & Theming",
    description: "Apply visual styles and ensure consistency",
    completed: false,
  },
  {
    title: "Functionality",
    description: "Implement interactive features and behaviors",
    completed: false,
  },
];

export function StepsPanel() {
  return (
    <div className="h-full border-r">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Build Steps</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-57px)] p-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "mb-4 p-4 rounded-lg border",
              step.completed ? "bg-accent" : "bg-card"
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              <h3 className="font-medium">{step.title}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}