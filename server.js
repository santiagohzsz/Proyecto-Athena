const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config(); // Para manejar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Ruta base para verificar que el servidor responde
app.get('/', (req, res) => {
  res.send('🔵 API de Athena Innovis funcionando correctamente');
});

// API KEY desde .env
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/api/generate', async (req, res) => {
  const { prompt, model } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://proyecto-athena.onrender.com',
        'X-Title': 'Athena Innovis',
      },
      body: JSON.stringify({
        model: model || 'meta-llama/llama-4-maverick:free',
        messages: [
          {
            role: 'user',
            content: prompt || 'Hola, ¿cómo estás?'
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('🛑 OpenRouter Error:', data.error);
      return res.status(500).json({ error: data.error.message || 'Error del modelo' });
    }

    res.json({ response: data.choices[0]?.message?.content || 'Sin respuesta del modelo.' });

  } catch (error) {
    console.error('❌ Error al conectar con OpenRouter:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
