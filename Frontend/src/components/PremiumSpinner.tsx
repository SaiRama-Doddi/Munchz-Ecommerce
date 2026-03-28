import React from 'react';
import { Loader2 } from 'lucide-react';

interface PremiumSpinnerProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  backdrop?: boolean;
}

const PremiumSpinner: React.FC<PremiumSpinnerProps> = ({ 
  text = "Loading...", 
  subtext, 
  fullScreen = true,
  backdrop = true 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="relative group">
        {/* EXTERNAL GLOW */}
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-700 animate-pulse"></div>
        
        {/* NESTED RINGS */}
        <div className="relative w-20 h-20">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-[3px] border-emerald-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-[3px] border-t-emerald-500 border-r-emerald-500 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
          
          {/* Middle Ring */}
          <div className="absolute inset-4 border-[2px] border-slate-200/20 rounded-full"></div>
          <div className="absolute inset-4 border-[2px] border-b-emerald-400 border-l-emerald-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
          
          {/* Inner Core */}
          <div className="absolute inset-[30px] bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>
      </div>

      {/* TEXT SECTION */}
      <div className="mt-8 text-center">
        <h3 className="text-base font-black text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
          {text}
        </h3>
        {subtext && (
          <p className="mt-2 text-sm font-medium text-slate-500 max-w-[250px] leading-relaxed">
            {subtext}
          </p>
        )}
      </div>

      {/* LOADING DOTS */}
      <div className="mt-6 flex gap-1.5">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center ${backdrop ? 'bg-white/90 backdrop-blur-md' : ''}`}>
        {content}
      </div>
    );
  }

  return content;
};

export default PremiumSpinner;
