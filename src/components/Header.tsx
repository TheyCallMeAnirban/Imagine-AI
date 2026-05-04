interface HeaderProps {
  messageCount: number;
  onClear: () => void;
}

export default function Header({ messageCount, onClear }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-black flex justify-between items-center px-6 h-16 w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-black tracking-tighter uppercase font-display">IMAGINE_AI</h1>
        <div className="px-2 py-0.5 border-2 border-black text-[10px] font-bold font-mono">
          {messageCount} MESSAGES
        </div>
      </div>
      <button
        onClick={onClear}
        className="font-display font-bold tracking-tighter uppercase text-sm border-2 border-black px-4 py-1 hover:bg-black hover:text-white transition-none active:translate-x-[2px] active:translate-y-[2px]"
      >
        CLEAR CHAT
      </button>
    </header>
  );
}
