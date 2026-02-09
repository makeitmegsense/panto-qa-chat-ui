"use client";

import { useState } from "react";
import { Send, Sparkles, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, mode: "guided" | "autonomous") => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"guided" | "autonomous">("guided");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim(), mode);
      setInput("");
      setOpen(false);
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white px-3 py-2 overflow-visible">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 max-w-4xl mx-auto overflow-visible"
      >
        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={
            mode === "autonomous"
              ? "Describe scenario…"
              : "What would you like me to test?"
          }
          className={cn(
            "flex-1 h-10 rounded-md px-3 text-sm",
            "bg-white border border-slate-200",
            "placeholder:text-slate-400 text-slate-800",
            "focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/40",
            "transition",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />

        {/* Mode dropdown */}
        <div className="relative shrink-0 overflow-visible">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="
              h-10 rounded-md border border-slate-200 bg-white px-2.5
              text-xs font-medium text-slate-700
              flex items-center gap-1.5
              hover:bg-slate-50
            "
          >
            {mode === "guided" ? (
              <Sparkles className="w-3.5 h-3.5" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            {mode === "guided" ? "Guided" : "Autonomous"}
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {open && (
            <div
              className="
                absolute right-0 bottom-full mb-2
                z-50 w-40
                rounded-md border border-slate-200
                bg-white shadow-md
              "
            >
              <button
                type="button"
                onClick={() => {
                  setMode("guided");
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-2 text-xs text-left",
                  "hover:bg-slate-50",
                  mode === "guided" && "font-medium text-emerald-600"
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Guided
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("autonomous");
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-2 text-xs text-left",
                  "hover:bg-slate-50",
                  mode === "autonomous" && "font-medium text-emerald-600"
                )}
              >
                <Zap className="w-3.5 h-3.5" />
                Autonomous
              </button>
            </div>
          )}
        </div>

        {/* Send */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            "h-10 w-10 rounded-full bg-emerald-600 text-white",
            "flex items-center justify-center",
            "hover:bg-emerald-700 transition",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;