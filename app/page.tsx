import { Suspense } from "react";
import { CinematicPage } from "@/components/CinematicPage";

export default function Home() {
  return (
    <Suspense>
      <CinematicPage />
    </Suspense>
  );
}
