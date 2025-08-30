const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do banco (Render dá essa URL pronta)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

// Endpoint para verificar chave
app.post("/check-key", async (req, res) => {
  const { key } = req.body;
  try {
    const result = await pool.query("SELECT valid FROM product_keys WHERE key = $1", [key]);

    if (result.rows.length > 0 && result.rows[0].valid) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, error: "Erro no servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
