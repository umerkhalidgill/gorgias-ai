const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Health check route
app.get("/", (req, res) => {
  res.send("Gorgias AI server is running");
});

// AI rewrite endpoint
app.post("/improve", async (req, res) => {

  try {

    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a customer support assistant. Rewrite the message professionally, fix grammar, and keep it polite."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const improved =
      response.data.choices[0].message.content;

    res.json({
      improved: improved
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "AI rewrite failed"
    });

  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
