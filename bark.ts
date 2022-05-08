export async function sendNotification(
  title: string,
  content: string,
  silence = false
) {
  const sound = silence ? "silence" : "glass";
  await fetch(
    `https://api.day.app/x4niMU4kaSwfSvbmspkEym/${title}/${content}?sound=${sound}`
  );
}
