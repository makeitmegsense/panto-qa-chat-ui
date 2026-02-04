import { useState, useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { Bot } from "lucide-react";

const QAChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Tell me what you want to test. I can guide you step by step, or run it autonomously and show you the execution.",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      /* ===================== INTENT DETECTION ===================== */
      const isFailureScenario = content
        .toLowerCase()
        .includes("orange");

      /* ===================== STEP DEFINITIONS ===================== */
      const successSteps = [
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

      const failureSteps = [
        {
          step: "Locate product",
          description:
            "Product ‘Orange’ found on category page",
          icon: "search",
        },
        {
          step: "Find CTA",
          description:
            "Add to Cart button is disabled",
          icon: "view",
          shouldFail: true, // 🔴 critical
        },
      ];

      const steps = isFailureScenario
        ? failureSteps
        : successSteps;

      /* ===================== EXECUTION PAYLOAD ===================== */
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
                      steps: steps.slice(1), // fails here
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

      /* ===================== ASSISTANT MESSAGE ===================== */
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
    }, 900);
  };

  return (
    <div className="relative min-h-screen flex justify-center px-4 bg-gradient-to-b from-[#EAF7F5] via-[#E6F4F2] to-[#DFF1EE]">
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(1,157,145,0.15),_transparent_60%)]" />

      <div className="w-full max-w-3xl my-10 bg-white/95 backdrop-blur rounded-3xl shadow-[0_20px_60px_rgba(1,157,145,0.15)] flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3FBFA] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#019D91]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Panto QA Assistant
              </p>
              <p className="text-xs text-slate-500">
                AI-driven test planning & execution
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-10 space-y-10 bg-gradient-to-b from-transparent via-[#F3FBFA] to-transparent">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div className="flex gap-3 items-end">
              <div className="w-8 h-8 rounded-lg bg-[#F3FBFA] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#019D91]" />
              </div>

              <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default QAChatbot;
