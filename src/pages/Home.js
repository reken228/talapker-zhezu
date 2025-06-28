// Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleStart = () => {
  const isValidName = /^[A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқӨөЁёӘә\s-]{5,}$/.test(name.trim()) && name.trim().split(" ").length >= 2;

  if (!isValidName) {
    setError(true);
    return;
  }

  navigate("/test", { state: { name } });
};


  const handleAdminLogin = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminPass }),
    });

    if (!res.ok) {
      setAdminError(true);
      return;
    }
    

    const data = await res.json();
    localStorage.setItem("admin_token", data.token); // сохраняем токен
    navigate("/admin");
  } catch (error) {
    console.error("Ошибка входа:", error);
    setAdminError(true);
  }
};


  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center from-indigo-600 to-purple-700 overflow-hidden">
      {/* Переключатель языка */}
      {/* Задний фон — четкий и на весь экран */}
<div
  className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none select-none"
  style={{ backgroundImage: "url('/myimages/zhezz.png')" }}
></div>

      <div className="absolute top-4 left-4 space-x-2">
  {["kk", "ru", "en"].map((lng) => (
    <button
      key={lng}
      onClick={() => i18n.changeLanguage(lng)}
      className={`bg-white text-indigo-600 px-3 py-1 rounded-lg shadow hover:bg-gray-100 transition ${
        i18n.language === lng ? "font-bold" : ""
      }`}
    >
      {lng === "kk" ? "Қаз" : lng === "ru" ? "Рус" : "Eng"}
    </button>
  ))}
</div>


      {/* Кнопка "Админ" */}
      <button
        onClick={() => setShowAdminLogin(true)}
        className="absolute top-4 right-4 bg-white text-indigo-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
      >
        {t("admin") || "Админ"}
      </button>

      {/* Всплывающее окно для пароля */}
      {showAdminLogin && (
        <div className="absolute top-16 right-4 bg-white p-4 rounded-xl shadow-xl z-50 w-64">
          <input
            type="password"
            placeholder={t("enter_password") || "Введите пароль"}
            className="w-full px-3 py-2 border rounded mb-2"
            value={adminPass}
            onChange={(e) => {
              setAdminPass(e.target.value);
              setAdminError(false);
            }}
          />
          {adminError && (
            <p className="text-red-600 text-sm mb-2">{t("wrong_password") || "Неверный пароль"}</p>
          )}
          <button
            onClick={handleAdminLogin}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700"
          >
            {t("login") || "Войти"}
          </button>
        </div>
      )}

      {/* Основной экран */}
     
      {/* Логотип по центру над контентом */}
<img
  src="/myimages/logo.jpg"
  alt="Логотип"
  className=" rounded-lg w-28 h-28 object-contain mb-4 z-10"
/>


      <div className="absolute top-40 right-1/4 transform rotate-6 bg-white/30 text-black text-xl font-bold px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
        {t("top_university") || "№1 университет в Жезказгане"}
      </div>

      <div className="absolute top-30 left-[-20%]  group relative z-30">
  {/* Основной блок */}
  <div className="transform -rotate-6 bg-white/40 text-black text-xl font-bold px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm">
    {t("admissions") || "Приемная комиссия"}
  </div>

  {/* Подсказка — поверх, не влияет на layout */}
  <div className="absolute left-20 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-60 bg-white/90 text-black text-sm p-4 rounded-xl shadow-xl z-50 transform -rotate-6">
  <p><strong>{t("address_title")}</strong></p>
  <p>{t("address_line1")}</p>
  <p>{t("address_line2")}</p>
  <p className="mt-2"><strong>{t("admissions_committee")}</strong></p>
  <p>+7 (710 2) 410-461</p>
  <p>+7 777 218 93 25</p>
  <p className="mt-2">
    <strong>{t("secretary")}</strong><br />
    {t("secretary_name")}
  </p>
</div>
</div>



      <h1 className="text-4xl font-bold mb-6 text-white drop-shadow">
        {t("welcome") || "TALAPKER ZHEZU"}
      </h1>

      <div className="relative text-lg text-white drop-shadow text-center mb-4">
        <span className="inline">{t("description_prefix") || "Интеллектуальный помощник для абитуриентов. Пройдите"} </span>
        <span className="relative group inline-block bg-white/40 text-black font-bold px-2 py-1 rounded shadow backdrop-blur-sm cursor-pointer">
          {t("test") || "тест"}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-white text-black text-sm p-3 rounded-xl shadow-xl z-50">
            {t("test_hint") || "Тест Джима Баррета в модификации Гусловой И.В., он подскажет наиболее близкие профессии по вашему типу личности."}
          </div>
        </span>
        <span className="inline"> {t("description_suffix") || "и получите рекомендации!"}</span>
      </div>

      <div className="mb-4 w-full max-w-sm">
        <input
  type="text"
  placeholder={t("enter_name") || "Введите ФИО"}
  className="z-0 w-full px-4 py-2 rounded-lg border border-white bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white shadow-md backdrop-blur-sm"
  value={name}
  onChange={(e) => {
    setName(e.target.value);
    setError(false);
  }}
/>

        {error && (
          <p className="text-red-600 text-sm mt-1">
            {t("error_name") || "Пожалуйста, введите ФИО, чтобы продолжить"}
          </p>
        )}
      </div>

      <button
  onClick={handleStart}
  className="bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white hover:bg-white/30 hover:text-white shadow-md backdrop-blur-sm transition"
>
  {t("start") || "Начать тест"}
</button>

    </div>
  );
}
