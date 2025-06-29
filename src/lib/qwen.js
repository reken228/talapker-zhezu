export async function sendToQwen(messages) {
  try {
    console.log("📤 Отправка сообщений:", messages);
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,

        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "microsoft/mai-ds-r1:free", // ✅ исправлено
        messages
      }),
    });

    const data = await response.json();
    console.log("📥 Ответ от API:", data);

    if (!response.ok) {
      console.error("❗ API вернул ошибку:", data.error);
      return `Қате жауап: ${data.error?.message || "серверден жауап алынбады."}`;
    }

    const message = data.choices?.[0]?.message?.content;
    console.log("✅ Ответ от модели:", message);

    return message || "Қате жауап: бос жауап.";
  } catch (err) {
  console.error("❌ Ошибка соединения:", err);
  alert("Ошибка соединения: " + err.message);
  return "Қате жауап: қосылу кезінде қате шықты.";
}

}
