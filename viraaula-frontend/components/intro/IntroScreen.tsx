"use client";
import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import CircleExpansion from "./CircleExpansion";

export default function IntroScreen() {
  const [expanding, setExpanding] = useState(false); const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null); const reduceMotion = Boolean(useReducedMotion());
  const start = useCallback(() => { const rect = buttonRef.current?.getBoundingClientRect(); setOrigin(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 }); setExpanding(true); }, []);
  return <main className="site-shell"><section className="home-hero">
    <motion.div className="home-copy" initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: "easeOut" }}>
      <span className="eyebrow">Aprender ficou mais simples</span><h1 className="brand home-title">ViraAula</h1><p className="home-slogan">Do YouTube para o seu aprendizado.</p>
      <p className="home-description">Transforme qualquer vídeo em um resumo claro e uma aula completa, organizados pela inteligência artificial para você estudar no seu ritmo.</p>
      <button ref={buttonRef} type="button" onClick={start} className="primary-button">Começar agora <span className="button-arrow" aria-hidden="true">→</span></button><p className="home-note"><span aria-hidden="true">✦</span> Cole um link. Nós cuidamos do material.</p>
    </motion.div>
    <motion.div className="home-visual" initial={{ opacity: 0, scale: reduceMotion ? 1 : .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .15, ease: "easeOut" }} aria-hidden="true"><div className="visual-orb"/><div className="video-card"><div className="video-frame"><div className="play-mark"><svg width="24" height="22" viewBox="0 0 24 22" fill="none"><path d="M19.5 9.27a2 2 0 010 3.46l-10 5.77A2 2 0 016.5 16.77V5.23A2 2 0 019.5 3.5l10 5.77z" fill="currentColor"/></svg></div></div><div className="card-caption"><span>Vídeo do YouTube</span><span style={{color:"#ff0000"}}>→ material de estudo</span></div></div><div className="study-card"><strong>Seu resumo está pronto</strong><i/><i/><i/></div></motion.div>
  </section>{expanding && <CircleExpansion origin={origin} active={expanding} reduceMotion={reduceMotion}/>}</main>;
}
