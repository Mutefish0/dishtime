import "https://deno.land/x/dotenv/load.ts";

const BARK_HOOK = Deno.env.get("BARK_HOOK") || "";

export async function sendNotification(
  title: string,
  content: string,
  silence = false
) {
  const sound = silence ? "silence" : "glass";
  await fetch(`${BARK_HOOK}/${title}/${content}?sound=${sound}`);
}
