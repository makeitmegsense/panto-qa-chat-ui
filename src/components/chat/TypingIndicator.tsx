const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot" />
      <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot delay-200" />
      <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot delay-400" />
    </div>
  );
};

export default TypingIndicator;
