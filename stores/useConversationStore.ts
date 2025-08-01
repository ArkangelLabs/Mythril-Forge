import { create } from "zustand";
import { Item } from "@/lib/assistant";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { INITIAL_MESSAGE } from "@/config/constants";

interface ToolUsageLogEntry {
  type: "function_call" | "web_search_call" | "file_search_call" | "mcp_call" | "code_interpreter_call";
  name?: string | null;
  arguments?: any;
  output?: any;
  status: "in_progress" | "completed" | "failed";
  timestamp: number;
}

interface ConversationState {
  // Items displayed in the chat
  chatMessages: Item[];
  // Items sent to the Responses API
  conversationItems: any[];
  // Whether we are waiting for the assistant response
  isAssistantLoading: boolean;
  // Log of tool usage for analytics/debugging
  toolUsageLog: ToolUsageLogEntry[];

  setChatMessages: (items: Item[]) => void;
  setConversationItems: (messages: any[]) => void;
  addChatMessage: (item: Item) => void;
  addConversationItem: (message: ChatCompletionMessageParam) => void;
  setAssistantLoading: (loading: boolean) => void;
  addToolUsageLog: (entry: ToolUsageLogEntry) => void;
  clearToolUsageLogs: () => void;
  rawSet: (state: any) => void;
}

const useConversationStore = create<ConversationState>((set) => ({
  chatMessages: [
    {
      type: "message",
      role: "assistant",
      content: [{ type: "output_text", text: INITIAL_MESSAGE }],
    },
  ],
  conversationItems: [],
  isAssistantLoading: false,
  toolUsageLog: [],
  setChatMessages: (items) => set({ chatMessages: items }),
  setConversationItems: (messages) => set({ conversationItems: messages }),
  addChatMessage: (item) =>
    set((state) => ({ chatMessages: [...state.chatMessages, item] })),
  addConversationItem: (message) =>
    set((state) => ({
      conversationItems: [...state.conversationItems, message],
    })),
  setAssistantLoading: (loading) => set({ isAssistantLoading: loading }),
  addToolUsageLog: (entry) =>
    set((state) => ({ toolUsageLog: [...state.toolUsageLog, entry] })),
  clearToolUsageLogs: () => set({ toolUsageLog: [] }),
  rawSet: set,
}));

export default useConversationStore;
