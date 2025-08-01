"use client";
import React from "react";
import PromptConfig from "./prompt-config";
import { HyperText } from "./ui/hyper-text";

export default function ContextPanel() {
  return (
    <div className="h-full p-4 w-full bg-[#f9f9f9] rounded-t-xl md:rounded-none border-l-1 border-stone-100">
      <div className="flex flex-col h-full">
        <h3 className="text-base font-semibold text-zinc-800 mb-3">Assistant Configuration</h3>
        <div className="overflow-y-auto flex-1">
          <PromptConfig />
        </div>
        {/* Centered HyperText at bottom */}
        <div className="flex justify-center items-center -mt-3 pb-2">
          <HyperText
            className="text-2xl font-bold text-zinc-800"
            text="MYTHRIL SYSTEMS FORGE"
            duration={2000}
          />
        </div>
      </div>
    </div>
  );
}
