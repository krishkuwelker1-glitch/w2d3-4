import { Suspense } from "react";
import TodosClient from "./todos-client";

export default function HomePage() {
  // Server Component: can fetch data or render static HTML.
  // We delegate interactivity to a client component.
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Todos</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <TodosClient />
      </Suspense>
    </main>
  );
}
