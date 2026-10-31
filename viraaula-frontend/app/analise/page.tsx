import type { Metadata } from "next";
import AnalysisView from "@/components/analysis/AnalysisView";

export const metadata: Metadata = {
  title: "Analisar vídeo | ViraAula",
  description:
    "Transforme vídeos do YouTube em resumos e aulas completas gerados por IA.",
};

export default function AnalisePage() {
  return <AnalysisView />;
}
