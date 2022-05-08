// https://open.feishu.cn/open-apis/bot/v2/hook/55204739-71f1-4cad-ada3-ff327e65b4a1

export async function sendMessage(title: string, content: string) {
  await fetch(
    "https://open.feishu.cn/open-apis/bot/v2/hook/55204739-71f1-4cad-ada3-ff327e65b4a1",
    {
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
    }
  );
}
