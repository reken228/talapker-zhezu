const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

const ADMIN_PASSWORD = "Zhez777!";
const SESSION_TOKEN = "secret-token-zhez";

app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: SESSION_TOKEN });
  } else {
    res.status(401).json({ error: "Неверный пароль" });
  }
});

app.get("/api/protected", (req, res) => {
  const auth = req.headers.authorization;
  if (auth === `Bearer ${SESSION_TOKEN}`) {
    res.json({ access: true });
  } else {
    res.status(403).json({ error: "Нет доступа" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер работает: http://localhost:${PORT}`);
});
