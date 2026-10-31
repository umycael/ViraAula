"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import UrlForm from "./UrlForm";
import ProcessingState from "./ProcessingState";
import ResultCards from "./ResultCards";
import CircleExpansion from "../transition/CircleExpansion";
import { analisarVideo, AnaliseError } from "@/lib/api/analises";

type AnalysisState = "idle" | "loading" | "success";

export default function AnalysisView() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<{ resumo: string; aula: string } | null>(
    null
  );

  const [isBackExpanding, setIsBackExpanding] = useState(false);
  const [backOrigin, setBackOrigin] = useState({ x: 0, y: 0 });

  const isSubmittingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSubmitUrl = useCallback(
    async (submittedUrl: string) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      setErrorMessage(null);
      setState("loading");

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const data = await analisarVideo(submittedUrl, controller.signal);
        setResults(data);
        setState("success");
      } catch (err: unknown) {
        if (err instanceof AnaliseError && err.message === "Operação cancelada.") {
          return;
        }

        const message =
          err instanceof AnaliseError
            ? err.message
            : "Não foi possível processar este vídeo. Tente novamente.";

        setErrorMessage(message);
        setState("idle");
      } finally {
        isSubmittingRef.current = false;
        abortControllerRef.current = null;
      }
    },
    []
  );

  const handleReset = useCallback(() => {
    setResults(null);
    setErrorMessage(null);
    setUrl("");
    setState("idle");
  }, []);

  const handleBackToHome = useCallback(
    (
      e:
        | React.MouseEvent<HTMLAnchorElement>
        | React.KeyboardEvent<HTMLAnchorElement>
    ) => {
      e.preventDefault();
      if (isBackExpanding) return;

      const target = e.currentTarget as HTMLElement;
      if (target && typeof target.getBoundingClientRect === "function") {
        const rect = target.getBoundingClientRect();
        setBackOrigin({
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
        });
      } else {
        setBackOrigin({
          x: typeof window !== "undefined" ? Math.round(window.innerWidth / 2) : 0,
          y: typeof window !== "undefined" ? Math.round(window.innerHeight / 2) : 0,
        });
      }

      setIsBackExpanding(true);
    },
    [isBackExpanding]
  );

  return (
    <main className="analysis-page">
      <header className="analysis-header">
        <span className="brand analysis-brand" aria-label="ViraAula">ViraAula</span>
        <span aria-hidden="true" className="analysis-kicker">Do YouTube para o seu aprendizado.</span>
      </header>
      <div className="analysis-wrap">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              <UrlForm
                url={url}
                setUrl={setUrl}
                onSubmit={handleSubmitUrl}
                isLoading={false}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                onBackToHome={handleBackToHome}
                reduceMotion={reduceMotion}
              />
            </motion.div>
          )}

          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              <ProcessingState url={url} reduceMotion={reduceMotion} />
            </motion.div>
          )}

          {state === "success" && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.35, ease: "easeOut" }}
              className="w-full"
            >
              <ResultCards
                resumo={results.resumo}
                aula={results.aula}
                onReset={handleReset}
                reduceMotion={reduceMotion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isBackExpanding && (
        <CircleExpansion
          origin={backOrigin}
          active={isBackExpanding}
          reduceMotion={reduceMotion}
          color="#FFFFFF"
          targetRoute="/"
        />
      )}
    </main>
  );
}
