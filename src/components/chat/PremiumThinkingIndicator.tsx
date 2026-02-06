import { useEffect, useState } from "react";
import { Brain, Sparkles, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= STAGES ================= */

const STAGES = [
  { label: "Understanding your request", icon: Brain },
  { label: "Analyzing screen context", icon: Search },
  { label: "Designing execution plan", icon: Sparkles },
  { label: "Preparing automation steps", icon: Zap },
];

/* ================= COMPONENT ================= */

interface Props {
  onComplete?: () => void;
  durationPerStage?: number;
}

const PremiumThinkingIndicator = ({
  onComplete,
  durationPerStage = 2500,
}: Props) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentStage = STAGES[stageIndex];
  const Icon = currentStage.icon;

  /* ===== Stage progression (logic unchanged) ===== */
  useEffect(() => {
    if (stageIndex >= STAGES.length) {
      setFinished(true);
      onComplete?.();
      return;
    }

    const t = setTimeout(() => {
      setStageIndex((i) => i + 1);
    }, durationPerStage);

    return () => clearTimeout(t);
  }, [stageIndex, durationPerStage, onComplete]);

  if (finished) return null;

  return (
    <div className="relative flex items-center gap-4 px-5 py-4 rounded-2xl
      bg-white/70 backdrop-blur-xl
      border border-[#019D91]/15
      shadow-[0_8px_30px_rgba(1,157,145,0.12)]
      animate-fade-in"
    >
      {/* ===== Energy Core ===== */}
      <div className="relative w-11 h-11 flex-shrink-0">
        {/* soft glow */}
        <div className="absolute inset-0 rounded-full
          bg-gradient-to-br from-[#019D91] to-[#019D91]/40
          blur-md opacity-70 animate-breathe"
        />

        {/* core */}
        <div className="absolute inset-0 rounded-full
          bg-gradient-to-br from-[#019D91] to-[#0ea5a0]
          flex items-center justify-center
          shadow-inner"
        >
          <Icon className="w-5 h-5 text-white animate-fade-in" />
        </div>

        {/* orbit ring */}
        <div className="absolute inset-[-5px] rounded-full
          border border-[#019D91]/30
          animate-orbit-slow"
        />
      </div>

      {/* ===== Text + subtle activity bars ===== */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <span
          key={stageIndex}
          className="text-sm font-medium text-slate-800
            animate-fade-in-up truncate"
        >
          {currentStage.label}
        </span>

        {/* premium pulse bars */}
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[3px] h-4 rounded-full
                bg-gradient-to-t from-[#019D91]/40 to-[#019D91]
                animate-wave-soft"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumThinkingIndicator;
