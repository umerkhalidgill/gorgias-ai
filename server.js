const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/improve", async (req, res) => {

const message = req.body.message;

try {

const response = await axios.post(
"https://api.openai.com/v1/chat/completions",
{
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: "Improve grammar and rewrite this as a professional customer support reply."
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

const improved = response.data.choices[0].message.content;

res.json({ improved });

} catch (error) {

res.json({ improved: "Error improving message" });

}

});

app.listen(3000, () => {
console.log("Server running");
});
