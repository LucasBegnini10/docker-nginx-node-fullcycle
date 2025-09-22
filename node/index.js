const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || "db_fullcycle",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "db_fullcycle",
};

let connection;

async function initDb() {
  connection = await mysql.createConnection(dbConfig);

  await connection.execute(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
  )`);

  await connection.execute("INSERT INTO users (nome) VALUES (?)", [
    `Usuário ${Date.now()}`,
  ]);
}

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const [rows] = await connection.execute("SELECT nome FROM users");
    const nomes = rows.map((row) => row.nome);
    res.send(
      `<h1>Full Cycle Rocks!</h1>\n<ul>\n${nomes
        .map((nome) => `<li>${nome}</li>`)
        .join("\n")}\n</ul>`
    );
  } catch (err) {
    res.status(500).send("Erro ao buscar usuários");
  }
});

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao inicializar o banco de dados:", err);
    process.exit(1);
  });
