import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

// Keep the static instance outside the hook and outside of any component
let webcontainerInstance: WebContainer | null = null;
// Add a promise to track the boot process
let bootPromise: Promise<WebContainer> | null = null;

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    async function bootWebContainer() {
      try {
        // If we already have an instance, use it
        if (webcontainerInstance) {
          setWebcontainer(webcontainerInstance);
          return;
        }

        // If we're already in the process of booting, wait for that promise
        if (bootPromise) {
          const instance = await bootPromise;
          setWebcontainer(instance);
          return;
        }

        // Otherwise, start the boot process
        bootPromise = WebContainer.boot();
        webcontainerInstance = await bootPromise;
        setWebcontainer(webcontainerInstance);
      } catch (error) {
        console.error("Failed to boot WebContainer:", error);
        // Reset the promise if failed
        bootPromise = null;
      }
    }

    bootWebContainer();

    // Cleanup function
    return () => {
      // Don't terminate on unmount, as we want to keep the singleton
      // If you need to terminate when the entire app unmounts,
      // you'd need a more complex tracking mechanism
    };
  }, []);

  return webcontainer;
}
