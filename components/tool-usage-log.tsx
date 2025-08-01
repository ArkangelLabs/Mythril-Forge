"use client";
import React from "react";
import useConversationStore from "@/stores/useConversationStore";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";

export default function ToolUsageLog() {
  const { toolUsageLogs, clearToolUsageLogs } = useConversationStore();
  const [expandedLogs, setExpandedLogs] = React.useState<Set<number>>(new Set());

  const toggleLog = (index: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLogs(newExpanded);
  };

  return (
    <div className="mt-6 border-t border-zinc-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-700">Tool Usage Log</h3>
        {toolUsageLogs.length > 0 && (
          <button
            onClick={clearToolUsageLogs}
            className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {toolUsageLogs.length === 0 ? (
          <p className="text-xs text-zinc-500">No tool calls yet</p>
        ) : (
          toolUsageLogs.map((log, index) => (
            <div key={index} className="bg-zinc-50 rounded-md p-2 text-xs">
              <div
                className="flex items-start gap-2 cursor-pointer"
                onClick={() => toggleLog(index)}
              >
                {expandedLogs.has(index) ? (
                  <ChevronDown size={12} className="mt-0.5 text-zinc-500" />
                ) : (
                  <ChevronRight size={12} className="mt-0.5 text-zinc-500" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-zinc-700">
                      {log.name || log.type || "Unknown Tool"}
                    </span>
                    <span className="text-zinc-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {log.status && (
                    <span className={`text-xs ${
                      log.status === 'completed' ? 'text-green-600' : 
                      log.status === 'failed' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      {log.status}
                    </span>
                  )}
                </div>
              </div>
              
              {expandedLogs.has(index) && (
                <div className="mt-2 ml-4 space-y-1">
                  {log.arguments && (
                    <div>
                      <span className="text-zinc-600">Arguments:</span>
                      <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.arguments, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.output && (
                    <div>
                      <span className="text-zinc-600">Output:</span>
                      <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
                        {typeof log.output === 'string' ? log.output : JSON.stringify(log.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}