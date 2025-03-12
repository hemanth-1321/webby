"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Wand2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../ThemeToggle";

export function Hero() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/builder?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <div className="max-w-3xl w-full space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Website Builder Platform
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          Transform your ideas into stunning websites with AI-powered assistance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <Input
              placeholder="Describe your dream website..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-14 px-4 text-lg"
            />
            <Code2 className="absolute right-4 top-4 text-muted-foreground" />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full md:w-auto">
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Website
        </Button>
      </form>
    </div>
  );
}
