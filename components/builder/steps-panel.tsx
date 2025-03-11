import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Step } from "@/types/types";
import { Loader2 } from "lucide-react"; // Using Lucide React for the spinner

interface StepsPanelProps {
  steps: Step[];
  isLoading: boolean; // Added loading state prop
}

export const StepsPanel: React.FC<StepsPanelProps> = ({ steps, isLoading }) => {
  console.log("steps received", steps);

  return (
    <div className="h-full border-r">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Build Steps</h2>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div
          className="flex items-center justify-center h-[calc(100vh-57px)]"
          aria-busy="true"
        >
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
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
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    step.completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <h3 className="font-medium">{step.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{step.path}</p>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};
