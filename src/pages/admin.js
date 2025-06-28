import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Admin() {
  const navigate = useNavigate();
  const [info, setInfo] = useState(() => {
    const saved = localStorage.getItem("admin_knowledge");
    return saved
      ? JSON.parse(saved)
      : {
          general: "Жезқазған — Қазақстандағы тарихи әрі индустриалды маңызды қала...",
          departments: "Кафедралар мен мамандықтар:\n...",
          documents: "Қажетті құжаттар:\n...",
          grants: "Гранттар:\n...",
        };
  });

  const { t, i18n } = useTranslation();

  const handleChange = (field, value) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
  localStorage.setItem("admin_knowledge", JSON.stringify(info));
}, [info]);

  const [isAuthorized, setIsAuthorized] = useState(false);
  
useEffect(() => {
  const token = localStorage.getItem("admin_token");
  if (token !== "secret-token-zhez") {
    navigate("/");
  } else {
    setIsAuthorized(true);
  }
}, []);
if (!isAuthorized) return null;

  return (
    
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Переключатель языка */}
      <div className="flex gap-2 mb-4">
        {["kk", "ru", "en"].map((lng) => (
          <button
            key={lng}
            onClick={() => i18n.changeLanguage(lng)}
            className={`bg-white text-indigo-600 px-4 py-1.5 rounded-xl shadow hover:bg-gray-100 transition ${
              i18n.language === lng ? "font-bold" : ""
            }`}
          >
            {lng === "kk" ? "Қаз" : lng === "ru" ? "Рус" : "Eng"}
          </button>
        ))}
      </div>

      <div
  className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none select-none"
  style={{ backgroundImage: "url('/myimages/zhezz.png')" }}
></div>  
      <h1 className="text-3xl font-bold">{t("admin_editor") || "Редактор контента"}</h1>

      {/* Общая информация */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">{t("general_info")}</h2>
        <textarea
          className="w-full border p-3 rounded min-h-[120px]"
          value={info.general}
          onChange={(e) => handleChange("general", e.target.value)}
        />
      </section>

      {/* Кафедралар */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">{t("departments")}</h2>
        <textarea
          className="w-full border p-3 rounded min-h-[180px] whitespace-pre-wrap"
          value={info.departments}
          onChange={(e) => handleChange("departments", e.target.value)}
        />
      </section>

      {/* Құжаттар */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">{t("documents")}</h2>
        <textarea
          className="w-full border p-3 rounded min-h-[150px]"
          value={info.documents}
          onChange={(e) => handleChange("documents", e.target.value)}
        />
      </section>

      {/* Гранттар */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">{t("grants")}</h2>
        <textarea
          className="w-full border p-3 rounded min-h-[150px]"
          value={info.grants}
          onChange={(e) => handleChange("grants", e.target.value)}
        />
      </section>

      <div className="text-sm text-green-600">
        {t("auto_save") || "Өзгерістер автоматты түрде сақталады."}
      </div>
    </div>
  );
}
