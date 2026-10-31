"use client";

import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export interface CircleExpansionProps {
  /** Posição do centro da expansão (coordenadas da viewport) */
  origin: { x: number; y: number };
  /** Ativa a expansão */
  active: boolean;
  /** Preferência de movimento reduzido */
  reduceMotion: boolean;
  /** Cor do círculo de expansão (padrão: #ff0000) */
  color?: string;
  /** Rota de destino para navegação automática ao cobrir a tela (padrão: /analise) */
  targetRoute?: string;
  /** Callback disparado assim que a tela estiver 100% coberta */
  onCovered?: () => void;
}

export default function CircleExpansion({
  origin,
  active,
  reduceMotion,
  color = "#ff0000",
  targetRoute = "/analise",
  onCovered,
}: CircleExpansionProps) {
  const controls = useAnimation();
  const router = useRouter();

  useEffect(() => {
    if (!active) return;

    const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
    const vh = typeof window !== "undefined" ? window.innerHeight : 1080;
    const { x, y } = origin;

    // Distância exata da origem até o canto mais distante da tela
    const maxRadius = Math.hypot(
      Math.max(x, vw - x),
      Math.max(y, vh - y)
    );
    // Adicionamos margem de segurança de 5% para cobrir completamente os cantos
    const finalRadius = Math.ceil(maxRadius * 1.05);

    if (reduceMotion) {
      // Movimento reduzido: fade curto (~200ms) sem círculo
      controls
        .start({
          opacity: [0, 1],
          clipPath: `circle(${finalRadius}px at ${x}px ${y}px)`,
          transition: { duration: 0.2, ease: "easeInOut" },
        })
        .then(() => {
          onCovered?.();
          if (targetRoute) {
            router.push(targetRoute);
          }
        });
      return;
    }

    // Expansão circular fluida
    controls
      .start({
        clipPath: `circle(${finalRadius}px at ${x}px ${y}px)`,
        transition: {
          duration: 0.72,
          ease: [0.4, 0, 0.2, 1], // Material standard easing
        },
      })
      .then(() => {
        onCovered?.();
        if (targetRoute) {
          router.push(targetRoute);
        }
      });
  }, [active, origin, reduceMotion, color, targetRoute, onCovered, controls, router]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{
        clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
        opacity: 1,
      }}
      animate={controls}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: color,
        zIndex: 9999,
        willChange: "clip-path, opacity",
        pointerEvents: active ? "all" : "none",
      }}
    />
  );
}

