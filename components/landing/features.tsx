import { Code2, Wand2 } from "lucide-react";

const features = [
  {
    title: "AI-Powered Generation",
    description: "Transform natural language descriptions into functional websites instantly",
    icon: Wand2,
  },
  {
    title: "Live Code Editor",
    description: "Edit your website code in real-time with our advanced Monaco editor",
    icon: Code2,
  },
  {
    title: "Instant Preview",
    description: "See your changes come to life immediately with our live preview feature",
    icon: Code2,
  },
];

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl w-full">
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <feature.icon className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}