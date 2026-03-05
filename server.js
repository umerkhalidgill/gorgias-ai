const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/improve", async (req, res) => {

const message = req.body.message;

res.json({
improved: "AI improved message will appear here"
});

});

app.listen(3000, () => {
console.log("Server running on port 3000");
});
