"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export function AppBar() {
  return (
    <div className="bg-black">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full p-2"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 backdrop-blur-xl rounded-2xl bg-background/50 border border-neutral-200 dark:border-neutral-700 shadow-lg"
        >
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="flex items-center space-x-2 transition-opacity hover:opacity-90"
              >
                <span className=" font-bold font-mono text-xl ">Webby</span>
              </Link>
            </motion.div>
            <div>
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      </motion.header>
    </div>
  );
}
