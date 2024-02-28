import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>Yard Search</h1>
    </>
  );
});

export const head: DocumentHead = {
  title: "yard-search",
  meta: [
    {
      name: "description",
      content: "search transcripts of the yard",
    },
  ],
};
