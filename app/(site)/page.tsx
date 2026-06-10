import { Hero } from "@/components/landing/hero";
import { Datasets } from "@/components/landing/datasets";
import { Quickstart } from "@/components/landing/quickstart";
import { ResponseDemo } from "@/components/landing/response-demo";
import { Limits } from "@/components/landing/limits";
import { Faq } from "@/components/landing/faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <Datasets />
      <Quickstart />
      <ResponseDemo />
      <Limits />
      <Faq />
    </main>
  );
}
