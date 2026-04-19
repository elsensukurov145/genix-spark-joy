import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { DashboardReveal } from "@/components/DashboardReveal";
import { Programs } from "@/components/Programs";
import { Timeline } from "@/components/Timeline";
import { Audience } from "@/components/Audience";
import { Apply } from "@/components/Apply";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CursorFollower } from "@/components/CursorFollower";
import { PageLoader } from "@/components/PageLoader";
import { SmoothScroll } from "@/components/SmoothScroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GeniX — Gələcəyin liderləri buradan başlayır" },
      {
        name: "description",
        content:
          "GeniX — gənclər üçün maliyyə, biznes və şəhərsalma üzrə inkişaf platforması. Müraciət et və gələcəyini qur.",
      },
      { property: "og:title", content: "GeniX — Gələcəyin liderləri buradan başlayır" },
      {
        property: "og:description",
        content: "Maliyyə, biznes və şəhərsalma üzrə intensiv proqram.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [, setLoaded] = useState(false);
  return (
    <>
      <SmoothScroll />
      <PageLoader onDone={() => setLoaded(true)} />
      <CursorFollower />
      <main className="relative bg-background min-h-screen overflow-x-hidden">
        <Navbar />
        <Hero />
        <Stats />
        <DashboardReveal />
        <Programs />
        <Timeline />
        <Audience />
        <Apply />
        <Footer />
      </main>
    </>
  );
}
