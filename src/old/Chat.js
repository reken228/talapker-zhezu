import { useState } from "react";
import { sendToQwen } from "../lib/qwen";

export default function Chat() {
  const [chat, setChat] = useState([
  { role: "system", content: "Сен TalapkerBot. Абитуриенттерге бағыт-бағдар бер." },
]);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Сәлем! Сұрағың болса, жаз..." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Добавляем сообщение от пользователя
    const userMsg = { role: "user", content: input };
    setChat((prev) => [...prev, userMsg]);
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    // Отправляем на Qwen API
    const reply = await sendToQwen([...chat, userMsg]);

    // Добавляем ответ бота
    setChat((prev) => [...prev, { role: "assistant", content: reply }]);
    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl flex flex-col p-4 h-[80vh]">
        {/* Окно истории сообщений */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl w-fit max-w-[80%] ${
                msg.sender === "user"
                  ? "ml-auto bg-indigo-500 text-white"
                  : "mr-auto bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        {/* Поле ввода */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
            placeholder="Сұрағыңызды жазыңыз..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Жіберу
          </button>
        </div>
      </div>
    </div>
  );
}
