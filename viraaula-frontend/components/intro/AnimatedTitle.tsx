"use client";

import { motion } from "motion/react";
import { useRef } from "react";

interface LetterConfig {
  char: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  overshootRotate: number;
}

const LETTERS: LetterConfig[] = [
  { char: "V", x: -28, y: -18, rotate: 210,  scale: 0.5, overshootRotate: -6 },
  { char: "i", x:  18, y: -22, rotate: -160, scale: 0.6, overshootRotate:  4 },
  { char: "r", x: -22, y:  20, rotate: 195,  scale: 0.45, overshootRotate: -5 },
  { char: "a", x:  30, y:  16, rotate: -230, scale: 0.55, overshootRotate:  7 },
  { char: "A", x: -24, y: -20, rotate: 175,  scale: 0.5,  overshootRotate: -4 },
  { char: "u", x:  26, y:  24, rotate: -185, scale: 0.6,  overshootRotate:  5 },
  { char: "l", x: -20, y:  18, rotate: 220,  scale: 0.45, overshootRotate: -6 },
  { char: "a", x:  14, y:  26, rotate: -200, scale: 0.55, overshootRotate:  4 },
];

const DELAYS = [0, 0.07, 0.14, 0.22, 0.29, 0.36, 0.43, 0.5];

interface AnimatedTitleProps {
  onComplete: () => void;
  reduceMotion: boolean;
}

export default function AnimatedTitle({ onComplete, reduceMotion }: AnimatedTitleProps) {
  const countRef = useRef(0);
  const completedRef = useRef(false);

  const handleLetterComplete = () => {
    if (completedRef.current) return;
    countRef.current += 1;
    if (countRef.current >= LETTERS.length) {
      completedRef.current = true;
      onComplete();
    }
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "var(--font-poppins), sans-serif",
    fontWeight: 600,
    fontSize: "clamp(4rem, min(22vw, 24vh), 14rem)",
    color: "#ff0000",
    whiteSpace: "nowrap",
    lineHeight: 0.95,
    marginBottom: "1.25rem",
    letterSpacing: "-0.03em",
  };

  if (reduceMotion) {
    return (
      <h1 aria-label="ViraAula" style={titleStyle}>
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onAnimationComplete={i === LETTERS.length - 1 ? onComplete : undefined}
            style={{ display: "inline-block" }}
          >
            {letter.char}
          </motion.span>
        ))}
      </h1>
    );
  }

  return (
    <h1 aria-label="ViraAula" style={titleStyle}>
      {LETTERS.map((letter, i) => (
        <LetterSpring
          key={i}
          letter={letter}
          delay={DELAYS[i]}
          onComplete={handleLetterComplete}
        />
      ))}
    </h1>
  );
}

interface LetterSpringProps {
  letter: LetterConfig;
  delay: number;
  onComplete: () => void;
}

function LetterSpring({ letter, delay, onComplete }: LetterSpringProps) {
  const rotateTimes = [0, 0.65, 0.82, 1];
  const rotateValues = [
    letter.rotate,
    letter.overshootRotate,
    -letter.overshootRotate * 0.4,
    0,
  ];

  return (
    <motion.span
      aria-hidden="true"
      initial={{
        x: letter.x,
        y: letter.y,
        rotate: letter.rotate,
        scale: letter.scale,
        opacity: 0,
        filter: "blur(4px)",
      }}
      animate={{
        x: 0,
        y: 0,
        rotate: rotateValues,
        scale: 1,
        opacity: [0, 1],
        filter: ["blur(4px)", "blur(0px)"],
      }}
      transition={{
        delay,
        duration: 0.9,
        x: { type: "spring", stiffness: 110, damping: 20, delay },
        y: { type: "spring", stiffness: 110, damping: 20, delay },
        scale: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
        opacity: { duration: 0.4, ease: "easeOut", delay },
        filter: { duration: 0.4, ease: "easeOut", delay },
        rotate: {
          duration: 0.9,
          ease: "easeOut",
          times: rotateTimes,
          delay,
        },
      }}
      onAnimationComplete={onComplete}
      style={{ display: "inline-block" }}
    >
      {letter.char}
    </motion.span>
  );
}
