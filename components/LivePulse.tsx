import React from 'react';

interface LivePulseProps {
  volume: number;
  active: boolean;
}

const LivePulse: React.FC<LivePulseProps> = ({ volume, active }) => {
  // Volume is 0-255 approx. We scale it to 1-2
  const scale = active ? 1 + (volume / 255) * 1.5 : 1;

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
       {active && (
         <>
          <div className="absolute w-full h-full rounded-full bg-amber-500 opacity-20 animate-pulse-ring" />
          <div className="absolute w-full h-full rounded-full bg-amber-500 opacity-20 animate-pulse-ring delay-75" />
         </>
       )}
       
       {/* Inner Core */}
       <div 
         className={`relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 shadow-lg transition-transform duration-75 ease-out flex items-center justify-center`}
         style={{ transform: `scale(${scale})` }}
       >
         {active && (
            <div className="w-full h-full rounded-full bg-white opacity-20 animate-pulse" />
         )}
       </div>
    </div>
  );
};

export default LivePulse;