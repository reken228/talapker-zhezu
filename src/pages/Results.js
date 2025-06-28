import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { sendToQwen } from "../lib/qwen";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiMessageCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function Results() {
  const location = useLocation();
  const result = location.state?.result || {};
  const userName = location.state?.name || "Аноним";
  const sortedAspects = Object.entries(result).sort((a, b) => b[1] - a[1]);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [messages, setMessages] = useState([
    { sender: "bot", text: t("bot_greeting") },
  ]);
  const [input, setInput] = useState("");
  const [botSummary, setBotSummary] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_knowledge");
    if (!saved) return;
    const { general, departments, documents, grants } = JSON.parse(saved);
    

    const systemPrompt = `
Ты — TalapkerBot, цифровой консультант ЖезУ (Жезказганского университета), про другие вузы вообще не говори если они не сотрудничают или както не связаны с ЖезУ.
Не помогай юзеру, если он спрашивает о чем-то кроме ЖезУ или говорит что хочет поступать куда то еще
На основе имеющихся данных помоги абитуриенту выбрать подходящую специальность.
В ответах используй только HTML, вместо ** используй тег <strong>.
Не отвечай на язке кроме русского, казахского и английского и говори что не умеешь
Жалпы: ${general}
Кафедралар: ${departments}
Құжаттар: ${documents}
Гранттар: ${grants}
`;

    setChat([{ role: "system", content: systemPrompt }]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setChat((prev) => [...prev, userMsg]);
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    const reply = await sendToQwen([...chat, userMsg]);
    setChat((prev) => [...prev, { role: "assistant", content: reply }]);
    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const sendTestResults = async () => {
  // Переводим названия аспектов
  const formatted = sortedAspects
    .map(([aspect, p]) => `${t(`aspect_${aspect.toLowerCase()}`)}: ${p}%`)
    .join("; ");

  const intro = t("result_intro", { result: formatted }); // локализованная обёртка
  const userMsg = { role: "user", content: intro };

  setChat((prev) => [...prev, userMsg]);
  setMessages((prev) => [...prev, { sender: "user", text: intro }]);
  setIsLoading(true);

  const reply = await sendToQwen([...chat, userMsg]);
  setChat((prev) => [...prev, { role: "assistant", content: reply }]);
  setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
  setIsLoading(false);
};


  const summarizeChat = async () => {
    const userMsg = { role: "user", content: "Соңғы диалогты қорытындылап, қысқаша есеп жаса." };
    setIsLoading(true);
    const reply = await sendToQwen([...chat, userMsg]);
    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    setBotSummary(reply);
    setIsLoading(false);
  };

  const downloadPdf = async () => {
  const element = resultRef.current;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Первая страница
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Остальные страницы
  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`Отчет_${userName}.pdf`);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-100 flex flex-col items-center justify-center px-4 py-6">
      <div className="absolute top-4 left-4 flex items-center gap-6 z-40">
        <img src="/myimages/logo.jpg" alt="Логотип" className="w-12 h-12 object-contain" />
        <div className="flex gap-2">
          {["kk", "ru", "en"].map((lng) => (
            <button
              key={lng}
              onClick={() => i18n.changeLanguage(lng)}
              className={`bg-white text-indigo-600 px-3 py-1 rounded-lg shadow hover:bg-gray-100 transition ${i18n.language === lng ? "font-bold" : ""}`}
            >
              {lng === "kk" ? "Қаз" : lng === "ru" ? "Рус" : "Eng"}
            </button>
          ))}
        </div>
      </div>

      <div ref={resultRef} className="max-w-xl w-full bg-white p-6 rounded-xl shadow-lg text-center">
        <img src="/myimages/logo.jpg" alt="Логотип" className="w-16 h-16 object-contain" />
        <h2 className="text-2xl font-bold mb-2">{t("your_strengths")}</h2>
        <p className="text-sm mb-4 text-gray-600">{t("name")}: <strong>{userName}</strong></p>
        {sortedAspects.map(([aspect, percent]) => (
  <div key={aspect} className="mb-4 text-left">
    <p className="font-semibold">
      {t(`aspect_${aspect.toLowerCase()}`)} — {percent}%
    </p>
    <div className="w-full h-3 bg-gray-200 rounded-full mt-1">
      <div className="h-3 bg-indigo-500 rounded-full" style={{ width: `${percent}%` }}></div>
    </div>
  </div>
))}

        <div className="mt-6 text-sm text-gray-700 text-left">
          {t("strengths_description")}
        </div>
        {botSummary && (
          <div className="mt-6 text-sm text-gray-800 text-left border-t pt-4">
            <h4 className="font-bold mb-2">{t("bot_summary")}</h4>
            <div dangerouslySetInnerHTML={{ __html: botSummary }} />
          </div>
        )}
      </div>

      <button onClick={downloadPdf} className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition">
        {t("download_pdf")}
      </button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-full max-w-md bg-white shadow-xl rounded-xl flex flex-col p-4 h-[70vh] z-50 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-center">{t("recommendations_from_bot")}</h3>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button
              onClick={sendTestResults}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t("ask_recommendation")}
            </button>
            <button
              onClick={summarizeChat}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {t("generate_summary")}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl w-fit max-w-[80%] ${msg.sender === "user" ? "ml-auto bg-indigo-500 text-white" : "mr-auto bg-gray-200 text-gray-800"}`}
                dangerouslySetInnerHTML={msg.sender === "bot" ? { __html: msg.text } : undefined}
              >
                {msg.sender === "user" ? msg.text : null}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-xl bg-gray-100 text-gray-500 w-fit max-w-[80%] mr-auto animate-pulse">
                {t("bot_thinking")}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
              placeholder={t("ask_placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              {t("send")}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
        title={t("open_chat")}
      >
        <FiMessageCircle size={24} />
      </button>
    </div>
  );
}
