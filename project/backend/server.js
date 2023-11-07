const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// moragan configuration
morgan.token("req-body", (req, res) => {
   return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));
let notes = [
   {
      id: 1,
      content: "Arto Hellas",
      important: false,
   },
   {
      id: 2,
      content: "Ada Lovelace",
      important: false,
   },
   {
      id: 3,
      content: "Dan Abramov",
      important: true,
   },
   {
      id: 4,
      content: "Mary Poppendieck",
      important: true,
   },
];

app.get("/api/notes", (req, res) => {
   res.status(200).json(notes);
});
app.get("/api/notes/:id", (req, res) => {
   const id = +req.params.id;
   const person = notes.find((p) => p.id === id);
   if (!person) res.status(404).end();
   else res.status(200).json(person);
});
app.delete("/api/notes/:id", (req, res) => {
   const id = +req.params.id;
   notes = notes.filter((p) => p.id !== id);
   res.json({ status: "success" });
});
app.post("/api/notes", (req, res) => {
   const body = req.body;
   if (!body.content) return res.status(301).json({ status: "error", message: "The note content is missing" });
   const payload = { content: req.body.content, important: false, id: genId() };
   notes.push(payload);
   res.status(200).json(payload);
});
app.get("/info", (req, res) => {
   const length = notes.length;
   const currTime = getCurrTime();
   res.status(200).send(`<p>Phonebook has info for ${length} people</p> <br /> <p>${currTime}</p>`);
   ("sat jan 22 2022 22:27:20 GMT+0200 (Eastern European Standard Time)");
});
app.patch("/api/notes/:id", (req, res) => {
   const id = +req.params.id;
   const paylaod = {
      important: req.body.important,
   };
   let currNote;
   notes = notes.map((e) => {
      if (e.id === id) {
         currNote = { ...e, paylaod };
         return currNote;
      } else return e;
   });
   res.status(200).json(currNote);
});

const genId = () => {
   return Math.floor(Math.random() * 1000000 + 1);
};
const getCurrTime = () => {
   const currentDate = new Date();
   const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "long", // Use 'short' for abbreviated time zone name.
   };

   const formatter = new Intl.DateTimeFormat("en-US", options);
   const formattedCurrentDate = formatter
      .formatToParts(currentDate)
      .map((part) => {
         if (part.type === "timeZoneName") {
            return part.value;
         }
         return part.value;
      })
      .join(" ");
   return formattedCurrentDate;
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
   console.log("server run in port " + PORT);
});
