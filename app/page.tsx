"use client";
import Assistant from "@/components/assistant";
import ToolsPanel from "@/components/tools-panel";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Main() {
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen relative">
      {/* Top left Logo */}
      <Image
        src="https://e1by4nur2ksda2hf.public.blob.vercel-storage.com/MythrilLogos-2.svg"
        alt="Mythril Logo"
        width={32}
        height={32}
        className="absolute top-4 left-4 h-8 w-auto z-10"
        priority
      />
      
      {/* Menu controls */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
        {/* Hamburger menu for small screens */}
        <button 
          className="md:hidden"
          onClick={() => setIsToolsPanelOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-[70%]">
          <Assistant />
        </div>
        <div className="hidden md:block w-[30%] border-l border-gray-200">
          <ToolsPanel />
        </div>
      </div>
      {/* Overlay panel for ToolsPanel on small screens */}
      {isToolsPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
          <div className="w-full bg-white h-full p-4">
            <button className="mb-4" onClick={() => setIsToolsPanelOpen(false)}>
              <X size={24} />
            </button>
            <ToolsPanel />
          </div>
        </div>
      )}
    </div>
  );
}
