import { Hero } from "@/components/landing/hero";
import { Datasets } from "@/components/landing/datasets";
import { Quickstart } from "@/components/landing/quickstart";
import { AgentAccess } from "@/components/landing/agent-access";
import { ResponseDemo } from "@/components/landing/response-demo";
import { Limits } from "@/components/landing/limits";
import { Faq } from "@/components/landing/faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <Datasets />
      <Quickstart />
      <AgentAccess />
      <ResponseDemo />
      <Limits />
      <Faq />
    </main>
  );
}
