import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const statements = [
  { text: "statement_1", aspect: "Слова" },
  { text: "statement_2", aspect: "Искусство" },
  { text: "statement_3", aspect: "Физический труд" },
  { text: "statement_4", aspect: "Искусство" },
  { text: "statement_5", aspect: "Физический труд" },
  { text: "statement_6", aspect: "Экспериментальная деятельность" },
  { text: "statement_7", aspect: "Физический труд" },
  { text: "statement_8", aspect: "Экспериментальная деятельность" },
  { text: "statement_9", aspect: "Бизнес" },
  { text: "statement_10", aspect: "Экспериментальная деятельность" },
  { text: "statement_11", aspect: "Бизнес" },
  { text: "statement_12", aspect: "Бизнес" },
  { text: "statement_13", aspect: "Экспериментальная деятельность" },
  { text: "statement_14", aspect: "Бизнес" },
  { text: "statement_15", aspect: "Социальная работа" },
  { text: "statement_16", aspect: "Слова" },
  { text: "statement_17", aspect: "Физический труд" },
  { text: "statement_18", aspect: "Физический труд" },
  { text: "statement_19", aspect: "Искусство" },
  { text: "statement_20", aspect: "Физический труд" },
  { text: "statement_21", aspect: "Экспериментальная деятельность" },
  { text: "statement_22", aspect: "Физический труд" },
  { text: "statement_23", aspect: "Экспериментальная деятельность" },
  { text: "statement_24", aspect: "Бизнес" },
  { text: "statement_25", aspect: "Экспериментальная деятельность" },
  { text: "statement_26", aspect: "Бизнес" },
  { text: "statement_27", aspect: "Социальная работа" },
  { text: "statement_28", aspect: "Слова" },
  { text: "statement_29", aspect: "Искусство" },
  { text: "statement_30", aspect: "Организационная деятельность" },
  { text: "statement_31", aspect: "Искусство" },
  { text: "statement_32", aspect: "Физический труд" },
  { text: "statement_33", aspect: "Организационная деятельность" },
  { text: "statement_34", aspect: "Организационная деятельность" },
  { text: "statement_35", aspect: "Экспериментальная деятельность" },
  { text: "statement_36", aspect: "Социальная работа" },
  { text: "statement_37", aspect: "Экспериментальная деятельность" },
  { text: "statement_38", aspect: "Организационная деятельность" },
  { text: "statement_39", aspect: "Социальная работа" },
  { text: "statement_40", aspect: "Слова" },
  { text: "statement_41", aspect: "Искусство" },
  { text: "statement_42", aspect: "Бизнес" },
  { text: "statement_43", aspect: "Искусство" },
  { text: "statement_44", aspect: "Физический труд" },
  { text: "statement_45", aspect: "Социальная работа" }
];


const groupedStatements = Array.from({ length: 15 }, (_, i) =>
  statements.slice(i * 3, i * 3 + 3)
);

export default function PriorityTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name || "Аноним";
  const { t, i18n } = useTranslation();

  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selection, setSelection] = useState({});

  const currentBlock = groupedStatements[page];

  const isValid = Object.keys(selection).length === 3 &&
    new Set(Object.values(selection)).size === 3;

  const handleSelect = (questionIdx, priority) => {
    setSelection((prev) => ({ ...prev, [questionIdx]: priority }));
  };

  const handleNext = () => {
    const blockAnswers = currentBlock.map((q, i) => ({
      aspect: q.aspect,
      priority: selection[i],
    }));
    const updatedAnswers = [...answers, ...blockAnswers];
    if (page === 14) {
      const scores = {};
      for (let { aspect, priority } of updatedAnswers) {
        const score = priority === "1" ? 3 : priority === "2" ? 2 : 1;
        scores[aspect] = (scores[aspect] || 0) + score;
      }
      const total = Object.values(scores).reduce((a, b) => a + b, 0);
      const result = Object.fromEntries(
        Object.entries(scores).map(([k, v]) => [k, Math.round((v / total) * 100)])
      );

      navigate("/results", {
        state: {
          result,
          name,
        },
      });
    } else {
      setAnswers(updatedAnswers);
      setSelection({});
      setPage(page + 1);
    }
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-orange-100 px-4 py-6">
      <div className="absolute top-4 left-4 flex items-center gap-6 z-40">
        <img src="/myimages/logo.jpg" alt="Логотип" className="w-12 h-12 object-contain" />
        </div>
      <div className="ml-16 absolute top-4 left-4 space-x-2">
  {["kk", "ru", "en"].map((lng) => (
    <button
      key={lng}
      onClick={() => i18n.changeLanguage(lng)}
      className={`bg-white px-3 py-1 rounded-lg shadow hover:bg-gray-100 transition ${
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

      <h1 className="text-3xl font-bold text-center mb-2 text-indigo-800 drop-shadow">
        {t("career_guidance") || "Профориентация"}
      </h1>


      <div className="mb-6 w-full max-w-md">
        <img
          src="/myimages/soog.jpg"
          alt="Заголовок"
          className="w-full h-auto rounded-lg shadow-md object-cover"
        />
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-3">
          {t("page")} {page + 1} {t("of")} 15
        </h2>
        {currentBlock.map((q, i) => (
          <div key={i} className="mb-4">
            <p className="font-medium mb-2">{t(q.text)}</p>

            <div className="flex justify-center space-x-2">
              {["1", "2", "3"].map((p) => (
                <button
                  key={p}
                  onClick={() => handleSelect(i, p)}
                  className={`px-4 py-1 rounded border text-sm ${selection[i] === p ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
                >
                  {p} {t("place")}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          disabled={!isValid}
          onClick={handleNext}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        >
          {page === 14 ? t("finish") : t("next")}
        </button>
      </div>
    </div>
  );
}
