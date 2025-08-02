import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CircularText() {
  const circleRef = useRef(null);
  const rotationRef = useRef(0);
  const speedRef = useRef(0.05); // base speed

  useEffect(() => {
    const circle = circleRef.current;

    // Animation loop
    const rotateLoop = () => {
      rotationRef.current += speedRef.current;
      gsap.set(circle, { rotate: rotationRef.current });
      requestAnimationFrame(rotateLoop);
    };
    rotateLoop();

    // Scroll listener to temporarily boost speed
    let scrollTimeout;
    const updateSpeed = () => {
      speedRef.current = 2; // fast on scroll
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        speedRef.current = 0.05; // restore speed
      }, 300);
    };

    window.addEventListener("scroll", updateSpeed);
    return () => window.removeEventListener("scroll", updateSpeed);
  }, []);

  // Text split into characters
  const text = "THIRTYSIXSTUDIO — FOR ALL THINGS DIGITAL PRODUCTION —";
  const chars = text.split("");

  return (
    <div className="relative w-[300px] h-[300px] flex items-center justify-center">
      <div
        ref={circleRef}
        className="absolute w-full h-full"
        style={{ transformOrigin: "center center" }}
      >
        <div className="absolute inset-0">
          {chars.map((char, i) => {
            const angle = (i / chars.length) * 360;
            const radius = 120;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <span
                key={i}
                className="absolute text-[10px] font-medium uppercase tracking-wider"
                style={{
  left: "50%",
  top: "50%",
  transform: `translate(${x}px, ${y}px) rotate(${angle}deg) rotate(${-angle}deg)`,
  transformOrigin: "0 0",
}}

              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
