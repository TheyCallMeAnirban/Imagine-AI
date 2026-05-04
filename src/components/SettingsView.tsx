import { Terminal, Database, Cpu, Zap, Trash2 } from "lucide-react";

interface SettingsViewProps {
  onClearChat: () => void;
}

export default function SettingsView({ onClearChat }: SettingsViewProps) {
  return (
    <div className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full overflow-y-auto">
      <div className="mb-12 border-b-2 border-black pb-6 relative">
        <h1 className="text-4xl font-black font-display tracking-tighter uppercase mb-2">SYSTEM CONFIGURATION</h1>
        <p className="font-mono text-sm uppercase text-gray-600">
          Terminal Access & Core Diagnostics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {}
        <div className="border-2 border-black bg-white hard-shadow p-6">
          <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-2">
            <Terminal size={24} />
            <h2 className="text-xl font-bold font-mono uppercase">About ImagineAI</h2>
          </div>
          <p className="font-sans text-sm leading-relaxed mb-4">
            <strong>ImagineAI (Analogue Studio V.1)</strong> is a high-performance neural synthesis engine designed for uncompromising speed and raw computational access. Bypassing modern UI bloat, it utilizes a stark brutalist interface to connect directly with the most advanced language models on the planet.
          </p>
          <p className="font-sans text-sm leading-relaxed">
            Built as a technical showcase, it demonstrates full-stack engineering maturity—from synchronous SQLite database management and LRU caching to proxy streaming binary payloads across the network.
          </p>
        </div>

        {}
        <div className="border-2 border-black bg-white hard-shadow p-6">
          <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-2">
            <Cpu size={24} />
            <h2 className="text-xl font-bold font-mono uppercase">Core Hardware</h2>
          </div>
          <ul className="space-y-4 font-mono text-sm">
            <li className="flex justify-between border-b border-gray-200 pb-1">
              <span className="text-gray-500">LLM Engine</span>
              <strong>Groq Llama-3.3-70B</strong>
            </li>
            <li className="flex justify-between border-b border-gray-200 pb-1">
              <span className="text-gray-500">Image Lattice</span>
              <strong>Pollinations.ai</strong>
            </li>
            <li className="flex justify-between border-b border-gray-200 pb-1">
              <span className="text-gray-500">Persistence</span>
              <strong>SQLite (Local)</strong>
            </li>
            <li className="flex justify-between border-b border-gray-200 pb-1">
              <span className="text-gray-500">Architecture</span>
              <strong>FastAPI + React 19</strong>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500">Network Latency</span>
              <strong className="text-green-600 flex items-center gap-1"><Zap size={12} /> &lt; 80ms</strong>
            </li>
          </ul>
        </div>

        {}
        <div className="border-2 border-black bg-white hard-shadow p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-2">
            <Database size={24} />
            <h2 className="text-xl font-bold font-mono uppercase">Memory Management</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="font-sans text-sm max-w-lg">
              The neural cache currently stores active conversation tokens locally in your browser state. You can purge this memory to start a fresh connection. Note: Database gallery items are unaffected.
            </p>
            <button 
              onClick={onClearChat}
              className="border-2 border-black py-3 px-6 font-mono uppercase text-sm hover:bg-black hover:text-white active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-3 transition-colors whitespace-nowrap"
            >
              <Trash2 size={16} />
              Purge Local Cache
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
