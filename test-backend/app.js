const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3001;
let notes = [
   {
      id: 1,
      content: "HTML is easy",
      important: true,
   },
   {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false,
   },
   {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true,
   },
];
app.get("/", (req, res) => {
   console.log("request");
   res.statusCode = 200;
   res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
   // select all notes
   res.json(notes);
});
app.get("/api/notes/:id", (req, res) => {
   const id = +req.params.id;
   const note = notes.find((note) => note.id === id);
   if (!note) (res.statusCode = 500), res.json({ status: "error", message: "not found a note" });
   else (res.statusCode = 200), res.json(note);
});
app.delete("/api/notes/:id", (request, response) => {
   const id = Number(request.params.id);
   notes = notes.filter((note) => note.id !== id);

   response.status(204).end();
});
app.get("/api/img", (req, res) => {
   const imagePath = "./img/pexels-nature-1.jpg";
   fs.readFile(imagePath, (err, data) => {
      if (err) {
         console.error(err);
         res.status(500).send("Error reading the image file.");
      } else {
         res.setHeader("Content-Type", "image/jpeg");
         res.send(data);
      }
   });
});
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
