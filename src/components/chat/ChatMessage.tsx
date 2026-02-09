import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ExecutionBlock from "./ExecutionBlock";
import AutonomousWorkflow from "./AutonomousWorkflow";

export interface Step {
  step: string;
  description: string;
  icon: "search" | "click" | "view" | "action";
}

export interface ExecutionWorkflow {
  id: string;
  title: string;
  steps: Step[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  execution?: {
    mode: "guided" | "autonomous";
    title?: string;
    steps?: Step[];
    workflows?: ExecutionWorkflow[];
  };
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const execution = message.execution;

  return (
    <div
      className={cn(
        "flex gap-3 items-start",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1",
          isUser
            ? "bg-[#019D91] text-white"
            : "bg-[#019D91]/10 text-[#019D91]"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message column */}
      <div
        className={cn(
          "space-y-4 transition-all duration-500 ease-out",
          isUser
            ? "max-w-[75%]"
            : execution
            ? "w-full"
            : "max-w-[75%]"
        )}
      >
        {/* ================= TEXT BUBBLE ================= */}
        <div
          className={cn(
            "px-4 py-2.5 text-sm rounded-sm leading-relaxed",
            isUser
              ? "bg-[#019D91] text-white rounded-tr-sm"
              : "bg-white text-slate-900 border border-slate-200 rounded-tl-sm shadow-sm"
          )}
        >
          {message.content}
        </div>

        {/* ================= EXECUTION WORKSPACE ================= */}
        {execution && !isUser && (
          <div className="pl-2 pr-1">
            {/* ===== Glass wrapper (Panto homepage style) ===== */}
   <div className="w-full rounded-sm border border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(2,132,199,0.08)] p-6 transition-all">

  {/* ===== Header ===== */}
  <div className="mb-5 flex items-start justify-between gap-4">

    {/* Title */}
    <div>
      <h2 className="text-base font-semibold text-slate-900 leading-tight">
        {execution.mode === "autonomous"
          ? "Autonomous execution plan"
          : execution.title}
      </h2>

      <p className="text-xs text-slate-500 mt-1">
        {execution.mode === "autonomous"
          ? "AI will execute each phase and validate results automatically"
          : "Step-by-step guided validation of the scenario"}
      </p>
    </div>

    {/* Mode label */}
    <div
      className={`
        shrink-0 inline-flex items-center gap-2
        px-3 py-1 rounded-full text-xs font-medium border
        ${
          execution.mode === "autonomous"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-blue-50 text-blue-700 border-blue-200"
        }
      `}
    >
      <span
        className={`
          w-1.5 h-1.5 rounded-full
          ${
            execution.mode === "autonomous"
              ? "bg-emerald-500"
              : "bg-blue-500"
          }
        `}
      />
      {execution.mode === "autonomous" ? "Autonomous" : "Guided"}
    </div>
  </div>

  {/* ===== Mint execution surface ===== */}
    {execution.mode === "autonomous" && execution.workflows ? (
      <AutonomousWorkflow workflows={execution.workflows} />
    ) : (
      execution.steps &&
      execution.title && (
        <ExecutionBlock
          title={execution.title}
          steps={execution.steps}
          mode="guided"
        />
      )
    )}

</div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
