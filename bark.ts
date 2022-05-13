import { config } from "https://deno.land/x/dotenv/mod.ts";

const { BARK_HOOK } = config({
  path: new URL(".env", import.meta.url).pathname,
});

export async function sendNotification(
  title: string,
  content: string,
  silence = false
) {
  const sound = silence ? "silence" : "glass";
  await fetch(`${BARK_HOOK}/${title}/${content}?sound=${sound}`);
}
