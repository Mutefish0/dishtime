import "https://deno.land/x/dotenv/load.ts";

const LARK_ROBOT_HOOK = Deno.env.get("LARK_ROBOT_HOOK") || "";

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
