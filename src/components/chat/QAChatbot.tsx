import { useState, useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";
import ChatInput from "./ChatInput";
import PremiumThinkingIndicator from "./PremiumThinkingIndicator";
import { Bot } from "lucide-react";
import type { Step, ExecutionWorkflow } from "./types";

const QAChatbot = () => {
  /* ================= MESSAGES ================= */
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Tell me what you want to test. I can guide you step by step, or run it autonomously and show you the execution.",
    },
  ]);

  /* ================= THINKING STATE ================= */
  const [isThinking, setIsThinking] = useState(false);

  /**
   * Holds the user request temporarily
   * until thinking animation finishes.
   */
  const [pendingResponse, setPendingResponse] = useState<{
    content: string;
    mode: "guided" | "autonomous";
  } | null>(null);

  /* ================= SCROLL ================= */
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    setAutoScroll(isNearBottom);
  };

  useEffect(() => {
    if (!autoScroll) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, autoScroll]);

  /* ================= SEND HANDLER ================= */
  const handleSend = (
    content: string,
    mode: "guided" | "autonomous"
  ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);

    /** 🔑 Start thinking ONCE */
    setIsThinking(true);
    setPendingResponse({ content, mode });
  };

  /* ================= WHEN THINKING FINISHES ================= */
  const handleThinkingComplete = () => {
    if (!pendingResponse) return;

    const { content, mode } = pendingResponse;

    const isFailureScenario = content
      .toLowerCase()
      .includes("orange");

    /* ===== STEP DEFINITIONS (UNCHANGED) ===== */

  const successSteps: Step[] = [
  {
    step: "Locate product",
    description: "Finding the product on the page",
    icon: "search",
  },
  {
    step: "Find CTA",
    description: "Locating the Add to Cart button",
    icon: "view",
  },
  {
    step: "Click button",
    description: "Adding item to cart",
    icon: "click",
  },
  {
    step: "Verify cart",
    description: "Ensuring item appears in cart",
    icon: "action",
  },
];


    const failureSteps: Step[] = [
      {
        step: "Locate product",
        description: "Product ‘Orange’ found on category page",
        icon: "search",
      },
      {
        step: "Find CTA",
        description: "Add to Cart button is disabled",
        icon: "view",
        shouldFail: true,
      },
    ];

    const steps = isFailureScenario ? failureSteps : successSteps;

    /* ===== EXECUTION PAYLOAD (UNCHANGED) ===== */

    const execution =
      mode === "autonomous"
        ? {
            mode: "autonomous" as const,
            workflows: isFailureScenario
              ? [
                  {
                    id: "prep",
                    title: "Preparation",
                    steps: steps.slice(0, 1),
                  },
                  {
                    id: "action",
                    title: "Action",
                    steps: steps.slice(1),
                  },
                ]
              : [
                  {
                    id: "prep",
                    title: "Preparation",
                    steps: steps.slice(0, 2),
                  },
                  {
                    id: "action",
                    title: "Action",
                    steps: steps.slice(2, 3),
                  },
                  {
                    id: "validation",
                    title: "Validation",
                    steps: steps.slice(3),
                  },
                ],
          }
        : {
            mode: "guided" as const,
            title: isFailureScenario
              ? "Add orange to cart"
              : "Add item to cart",
            steps,
          };

    /* ===== ASSISTANT MESSAGE ===== */

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: isFailureScenario
        ? mode === "autonomous"
          ? "I’ll attempt this autonomously. I’ll stop if any validation fails and explain why."
          : "Let’s try this together. I’ll stop if something doesn’t look right."
        : mode === "autonomous"
        ? "Here’s the execution plan. I’ll run this and surface results at each stage."
        : "We’ll go step by step and validate as we go.",
      execution,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    /** 🔑 Reset thinking state */
    setPendingResponse(null);
    setIsThinking(false);
  };

  /* ================= UI ================= */

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-[#EAF7F5] via-[#E6F4F2] to-[#DFF1EE]">
      {/* ===== Scrollable Messages ===== */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-8"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* ===== SINGLE THINKING INDICATOR ===== */}
        {isThinking && (
          <div className="flex gap-3 items-end">
            <div className="w-8 h-8 rounded-sm bg-[#F3FBFA] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#019D91]" />
            </div>

            <PremiumThinkingIndicator
              onComplete={handleThinkingComplete}
              durationPerStage={1400} // slower, visible
            />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ===== Input ===== */}
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <ChatInput
          onSend={handleSend}
          disabled={isThinking}
        />
      </div>
    </div>
  );
};

export default QAChatbot;
