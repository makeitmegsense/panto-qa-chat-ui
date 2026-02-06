interface ModeSelectorProps {
  onSelect: (mode: "guided" | "autonomous") => void;
}

const ModeSelectorCard = ({ onSelect }: ModeSelectorProps) => {
  return (
    <div className="bg-white rounded-sm p-5 border border-[#E6F4F2]">
      <h3 className="text-sm font-medium text-[#0F172A] mb-4">
        How do you want to run this?
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onSelect("guided")}
          className="rounded-sm border border-[#E6F4F2] p-4 text-left hover:bg-[#F3FBFA]"
        >
          <div className="text-[#019D91] font-medium">Guided</div>
          <p className="text-sm text-[#64748B] mt-1">
            Review each step before execution
          </p>
        </button>

        <button
          onClick={() => onSelect("autonomous")}
          className="rounded-sm border border-[#E6F4F2] p-4 text-left hover:bg-[#F3FBFA]"
        >
          <div className="text-[#019D91] font-medium">Autonomous</div>
          <p className="text-sm text-[#64748B] mt-1">
            Plan and execute end-to-end
          </p>
        </button>
      </div>
    </div>
  );
};

export default ModeSelectorCard;
