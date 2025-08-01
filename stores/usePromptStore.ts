import { create } from "zustand";
import { persist } from "zustand/middleware";

export const PERSONALITY_OPTIONS = [
  "You are a very serious assistant",
  "You are a serious but engaging assistant", 
  "You are less serious of an assistant and more warm",
  "You are a very jolly assistant"
];

export const STYLE_OPTIONS = [
  "You are a sales oriented agent trying to sell products",
  "You are a balanced sales and service agent",
  "You are a warm customer service assistant"
];

export const TRAIT_OPTIONS = [
  "helpful",
  "knowledgeable",
  "patient",
  "friendly",
  "professional",
  "enthusiastic",
  "detail-oriented",
  "empathetic"
];

interface PromptStore {
  name: string;
  setName: (name: string) => void;
  personality: number; // 0-3 index
  setPersonality: (level: number) => void;
  style: number; // 0-2 index
  setStyle: (level: number) => void;
  traits: string[];
  setTraits: (traits: string[]) => void;
  toggleTrait: (trait: string) => void;
  loadingMessages: string[];
  setLoadingMessages: (messages: string[]) => void;
  updateLoadingMessage: (index: number, message: string) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const usePromptStore = create<PromptStore>()(
  persist(
    (set) => ({
      name: "Emma",
      setName: (name) => set({ name }),
      personality: 2, // Default to "less serious and more warm"
      setPersonality: (level) => set({ personality: level }),
      style: 2, // Default to "warm customer service assistant"
      setStyle: (level) => set({ style: level }),
      traits: ["helpful", "knowledgeable", "friendly"],
      setTraits: (traits) => set({ traits }),
      toggleTrait: (trait) => set((state) => ({
        traits: state.traits.includes(trait)
          ? state.traits.filter(t => t !== trait)
          : [...state.traits, trait]
      })),
      loadingMessages: [
        "Bra Fitting...",
        "Browsing...",
        "Definitely not on social media..."
      ],
      setLoadingMessages: (messages) => set({ loadingMessages: messages }),
      updateLoadingMessage: (index, message) => set((state) => ({
        loadingMessages: state.loadingMessages.map((msg, i) => 
          i === index ? message : msg
        )
      })),
      themeColor: "#F5E6E1",
      setThemeColor: (color) => set({ themeColor: color }),
      accentColor: "#7A4C4A",
      setAccentColor: (color) => set({ accentColor: color }),
    }),
    {
      name: "prompt-store",
    }
  )
);

export default usePromptStore;