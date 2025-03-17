import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is ready");
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
