import { useState } from "react";
import { Send, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, mode: "guided" | "autonomous") => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"guided" | "autonomous">("guided");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim(), mode);
      setInput("");
    }
  };

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-sm p-4">
      {/* Mode selector */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode("guided")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-all",
            mode === "guided"
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Sparkles className="w-4 h-4" />
          Guided
        </button>
        <button
          onClick={() => setMode("autonomous")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-all",
            mode === "autonomous"
              ? "bg-accent/20 text-accent border border-accent/30"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Zap className="w-4 h-4" />
          Autonomous
        </button>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "autonomous"
              ? "Describe the test scenario to execute..."
              : "What would you like me to test?"
          }
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 pr-12 rounded-sm",
            "bg-muted/50 border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "w-8 h-8 rounded-sm flex items-center justify-center",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        {mode === "autonomous"
          ? "AI will plan and execute all steps automatically"
          : "AI will show each step as it executes"}
      </p>
    </div>
  );
};

export default ChatInput;
