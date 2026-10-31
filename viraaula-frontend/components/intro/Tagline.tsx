"use client";

import { motion } from "motion/react";

const WORD_GROUPS = [
  { text: "Do",           delay: 0,    yOffset: 16, scale: 0.92 },
  { text: "YouTube",      delay: 0.07, yOffset: 20, scale: 0.88 },
  { text: "para",         delay: 0.13, yOffset: 14, scale: 0.94 },
  { text: "o",            delay: 0.18, yOffset: 16, scale: 0.93 },
  { text: "seu",          delay: 0.23, yOffset: 18, scale: 0.91 },
  { text: "aprendizado!", delay: 0.3,  yOffset: 18, scale: 0.89 },
];

interface TaglineProps {
  isVisible: boolean;
  onComplete: () => void;
  reduceMotion: boolean;
}

export default function Tagline({ isVisible, onComplete, reduceMotion }: TaglineProps) {
  const lastIdx = WORD_GROUPS.length - 1;

  if (reduceMotion) {
    return (
      <div style={{ marginBottom: "0.5rem", minHeight: "2.2rem" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          onAnimationComplete={() => { if (isVisible) onComplete(); }}
          style={textStyle}
        >
          Do YouTube para o seu aprendizado!
        </motion.p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: "0.5rem",
        minHeight: "2.2rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        gap: "0 0.32em",
      }}
    >
      {WORD_GROUPS.map((group, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: group.yOffset, scale: group.scale }}
          animate={
            isVisible
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: group.yOffset, scale: group.scale }
          }
          transition={{
            delay: group.delay,
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          onAnimationComplete={() => {
            if (isVisible && i === lastIdx) onComplete();
          }}
          style={{ ...textStyle, display: "inline-block" }}
        >
          {group.text}
        </motion.span>
      ))}
    </div>
  );
}

const textStyle: React.CSSProperties = {
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 600,
  fontSize: "clamp(1rem, 2.4vw, 1.5rem)",
  color: "#000000",
  letterSpacing: "-0.01em",
  maxWidth: "90vw",
  textAlign: "center",
  lineHeight: 1.35,
};
