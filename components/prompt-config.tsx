"use client";
import React from "react";
import usePromptStore, { PERSONALITY_OPTIONS, STYLE_OPTIONS, TRAIT_OPTIONS } from "@/stores/usePromptStore";
import useConversationStore from "@/stores/useConversationStore";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, RefreshCw } from "lucide-react";
import { INITIAL_MESSAGE } from "@/config/constants";

export default function PromptConfig() {
  const {
    name,
    setName,
    personality,
    setPersonality,
    style,
    setStyle,
    traits,
    toggleTrait,
    loadingMessages,
    updateLoadingMessage,
    themeColor,
    setThemeColor,
    accentColor,
    setAccentColor,
  } = usePromptStore();
  
  const { setChatMessages, setConversationItems, clearToolUsageLogs } = useConversationStore();

  const handleResetConversation = () => {
    // Reset chat messages to initial state
    setChatMessages([
      {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text: INITIAL_MESSAGE }],
      },
    ]);
    // Clear conversation items
    setConversationItems([]);
    // Clear tool usage logs
    clearToolUsageLogs();
  };

  return (
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="assistant-name" className="text-xs font-medium text-zinc-700 block mb-1">
          Assistant Name
        </label>
        <Input
          id="assistant-name"
          type="text"
          placeholder="Enter assistant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white border text-xs h-8"
        />
      </div>

      {/* Personality Slider */}
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">
          Personality
        </label>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Serious</span>
            <span>Jolly</span>
          </div>
          <Slider
            value={[personality]}
            onValueChange={(value) => setPersonality(value[0])}
            max={3}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-zinc-600 mt-2">
            {PERSONALITY_OPTIONS[personality]}
          </p>
        </div>
      </div>

      {/* Style Slider */}
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">
          Style
        </label>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Sales</span>
            <span>Service</span>
          </div>
          <Slider
            value={[style]}
            onValueChange={(value) => setStyle(value[0])}
            max={2}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-zinc-600 mt-2">
            {STYLE_OPTIONS[style]}
          </p>
        </div>
      </div>

      {/* Traits Multi-select */}
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">
          Traits
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between bg-white border rounded-md px-3 py-2 text-sm">
            <span className="text-zinc-700">
              {traits.length > 0 
                ? `${traits.length} trait${traits.length > 1 ? 's' : ''} selected`
                : "Select traits"
              }
            </span>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {TRAIT_OPTIONS.map((trait) => (
              <DropdownMenuCheckboxItem
                key={trait}
                checked={traits.includes(trait)}
                onCheckedChange={() => toggleTrait(trait)}
              >
                {trait.charAt(0).toUpperCase() + trait.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {traits.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {traits.map((trait) => (
              <span
                key={trait}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-zinc-100 text-zinc-700"
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Loading Messages */}
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">
          Loading Messages
        </label>
        <div className="space-y-2">
          {loadingMessages.map((message, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`Loading message ${index + 1}`}
              value={message}
              onChange={(e) => updateLoadingMessage(index, e.target.value)}
              className="bg-white border text-xs h-8"
            />
          ))}
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          These messages will rotate while waiting for responses
        </p>
      </div>

      {/* Theme Color Picker */}
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">
          Theme Color
        </label>
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg border-2 border-zinc-300"
            style={{ backgroundColor: themeColor }}
          />
          <div className="flex-1">
            <Input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="h-10 cursor-pointer"
            />
          </div>
          <Input
            type="text"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            placeholder="#F5E6E1"
            className="bg-white border text-sm w-28"
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Choose the background color for the chat interface
        </p>
      </div>

      {/* Accent Color Picker */}
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">
          Accent Color
        </label>
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg border-2 border-zinc-300"
            style={{ backgroundColor: accentColor }}
          />
          <div className="flex-1">
            <Input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 cursor-pointer"
            />
          </div>
          <Input
            type="text"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            placeholder="#7A4C4A"
            className="bg-white border text-sm w-28"
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Choose the accent color for text and buttons
        </p>
      </div>

      {/* Reset Conversation Button */}
      <div className="pt-2 border-t border-zinc-200">
        <Button
          onClick={handleResetConversation}
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Conversation
        </Button>
      </div>
    </div>
  );
}