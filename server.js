const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GORGIAS_API_KEY = process.env.GORGIAS_API_KEY;
const GORGIAS_DOMAIN = process.env.GORGIAS_DOMAIN;

app.post("/improve", async (req, res) => {

  try {

    const message = req.body.message;
    const ticketId = req.body.ticket_id;

    const ai = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Rewrite this customer support message professionally and fix grammar."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const improved = ai.data.choices[0].message.content;

    // add internal note in Gorgias ticket
    await axios.post(
      `https://${GORGIAS_DOMAIN}.gorgias.com/api/tickets/${ticketId}/messages`,
      {
        body_text: `🤖 AI Rewrite:\n\n${improved}`,
        sender: {
          type: "agent"
        },
        channel: "internal-note"
      },
      {
        auth: {
          username: process.env.GORGIAS_EMAIL,
          password: GORGIAS_API_KEY
        }
      }
    );

    res.json({ success: true });

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json({ error: "AI rewrite failed" });

  }

});

app.listen(3000, () => {
  console.log("Server running");
});
