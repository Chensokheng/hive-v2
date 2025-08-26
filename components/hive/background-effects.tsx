import React from "react";

export const BackgroundEffects: React.FC = () => (
  <>
    {/* Pink blur effect */}
    <div
      className="absolute z-50 left-[-218.15%] right-[253.99%] top-0 bottom-[-67.91%] 
       bg-[#FF66CC] opacity-20 blur-[200px] 
       [transform:matrix(0,-1,-1,0,0,0)]"
    />

    {/* Orange blur effect */}
    <div
      className="absolute 
      z-40
       w-[612.69px] h-[612px] 
       left-[calc(50%-612.69px/2+729.34px)] 
       top-[calc(50%-612px/2-619px)] 
       bg-[#FF8300] opacity-10 
       blur-[200px] 
       [transform:matrix(0,-1,-1,0,0,0)] rounded-full"
    />
  </>
);
