import React, { useEffect, useRef } from 'react';

const TextMarquee: React.FC = () => {

  return (
    <div className="w-full h-16 bg-[#e90089] overflow-hidden flex justify-start items-center text-white">
      <div
        className="whitespace-nowrap text-lg font-bold px-5 inline-block marquee w-full"
      >
        در حال طراحی سایت هستیم !!
      </div>
    </div>
  );
};

export default TextMarquee;
