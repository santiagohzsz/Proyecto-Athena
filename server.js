const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

require('dotenv').config(); // Para manejar la API Key de forma segura desde un archivo .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// API KEY segura desde archivo .env (crear .env y colocar OPENROUTER_API_KEY=tu_clave)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/api/generate', async (req, res) => {
  const { prompt, model } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://tupagina.com', // Cambia esto por tu URL real si tienes
        'X-Title': 'Athena Innovis',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick:free',
        messages: [
          {
            role: 'user',
            content: 'Hola, ¿cómo estás?'
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

