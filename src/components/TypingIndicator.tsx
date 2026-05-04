export default function TypingIndicator() {
  return (
    <div className="flex flex-col items-start mb-8">
      <div className="bg-white border-2 border-black px-4 py-2 grainy flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-black animate-[typing_1s_infinite_step-end]"></div>
        <div className="w-1.5 h-1.5 bg-black/60 animate-[typing_1s_infinite_step-end_0.2s]"></div>
        <div className="w-1.5 h-1.5 bg-black/30 animate-[typing_1s_infinite_step-end_0.4s]"></div>
        <span className="ml-2 text-[10px] font-mono uppercase font-bold">Processing_</span>
      </div>
    </div>
  );
}
