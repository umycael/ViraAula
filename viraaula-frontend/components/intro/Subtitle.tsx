"use client";

import { motion } from "motion/react";

const WORDS = [
  { text: "Resumos",    xFrom: -16, yFrom:  6, scale: 0.95, rotate: -1.5, delay: 0    },
  { text: "e",          xFrom: -10, yFrom:  4, scale: 0.98, rotate: -1,   delay: 0.08 },
  { text: "Aulas",      xFrom: -14, yFrom:  5, scale: 0.96, rotate: -1.2, delay: 0.16 },
  { text: "Completas.", xFrom: -10, yFrom:  4, scale: 0.97, rotate: -0.8, delay: 0.24 },
];

interface SubtitleProps {
  isVisible: boolean;
  onComplete: () => void;
  reduceMotion: boolean;
}

export default function Subtitle({ isVisible, onComplete, reduceMotion }: SubtitleProps) {
  const lastIdx = WORDS.length - 1;

  if (reduceMotion) {
    return (
      <div style={{ marginBottom: "2rem", minHeight: "1.5rem" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          onAnimationComplete={() => { if (isVisible) onComplete(); }}
          style={textStyle}
        >
          Resumos e Aulas Completas.
        </motion.p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: "2rem",
        minHeight: "1.5rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        gap: "0 0.4em",
      }}
    >
      {WORDS.map((word, i) => (
        <motion.span
          key={i}
          initial={{
            opacity: 0,
            x: word.xFrom,
            y: word.yFrom,
            scale: word.scale,
            rotate: word.rotate,
          }}
          animate={
            isVisible
              ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
              : { opacity: 0, x: word.xFrom, y: word.yFrom, scale: word.scale, rotate: word.rotate }
          }
          transition={{
            delay: word.delay,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={() => {
            if (isVisible && i === lastIdx) onComplete();
          }}
          style={{ ...textStyle, display: "inline-block" }}
        >
          {word.text}
        </motion.span>
      ))}
    </div>
  );
}

const textStyle: React.CSSProperties = {
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 500,
  fontSize: "clamp(0.9rem, 1.9vw, 1.125rem)",
  color: "#6e6e73",
  maxWidth: "90vw",
  textAlign: "center",
  lineHeight: 1.4,
};
