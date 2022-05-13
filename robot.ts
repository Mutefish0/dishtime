import { config } from "https://deno.land/x/dotenv/mod.ts";

const { LARK_ROBOT_HOOK } = config({
  path: new URL(".env", import.meta.url).pathname,
});

export async function sendMessage(title: string, content: string) {
  await fetch(LARK_ROBOT_HOOK, {
    method: "POST",
    body: JSON.stringify({
      msg_type: "post",
      content: {
        post: {
          zh_cn: {
            title: title,
            content: [
              [
                {
                  tag: "text",
                  text: content,
                },
              ],
            ],
          },
        },
      },
    }),
  });
}
