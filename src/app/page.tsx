import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { PersonaPicker } from "@/components/home/PersonaPicker";
import { ProblemBasedArticles } from "@/components/home/ProblemBasedArticles";
import { EvaluationPolicySection } from "@/components/home/EvaluationPolicySection";

// title/descriptionはlayout.tsxのサイト共通メタデータをそのまま使う。canonicalのみ明示する。
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <div className="-mx-6 -my-10 space-y-16 bg-canvas-bg px-6 py-10">
      <HomeHero />
      <PersonaPicker />
      <ProblemBasedArticles />
      <EvaluationPolicySection />
    </div>
  );
}
