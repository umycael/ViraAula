"use client";

import { motion } from "motion/react";
import { useState } from "react";

interface StartButtonProps {
  isVisible: boolean;
  onComplete: () => void;
  onClick?: () => void;
  reduceMotion: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * CTA "Começar agora".
 * Preto, toque de 44px, com barra de progresso vermelha que varre a base
 * do botão no hover — o vernáculo do vídeo vivendo no ponto de ação.
 */
export default function StartButton({
  isVisible,
  onComplete,
  onClick,
  reduceMotion,
  buttonRef,
}: StartButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "64px",
        minWidth: "220px",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <motion.button
        ref={buttonRef}
        type="button"
        aria-label="Começar agora"
        initial={{
          opacity: 0,
          y: reduceMotion ? 0 : 10,
          scale: reduceMotion ? 1 : 0.96,
        }}
        animate={
          isVisible
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.96 }
        }
        transition={
          reduceMotion
            ? { duration: 0.3, ease: "easeOut" }
            : {
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.45, ease: "easeOut" },
              }
        }
        onAnimationComplete={() => {
          if (isVisible) onComplete();
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "var(--font-poppins), sans-serif",
          fontWeight: 600,
          fontSize: "1.0625rem",
          letterSpacing: "0.01em",
          padding: "1rem 2.5rem",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          minHeight: "44px",
          outline: "none",
        }}
        className="focus-visible:ring-[3px] focus-visible:ring-[#ff0000] focus-visible:ring-offset-4"
      >
        Começar agora

        <motion.span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "3px",
            backgroundColor: "#ff0000",
            transformOrigin: "left center",
          }}
          initial={false}
          animate={{
            scaleX: isHovered ? 1 : 0.14,
            opacity: isHovered ? 1 : 0,
          }}
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </motion.button>
    </div>
  );
}
