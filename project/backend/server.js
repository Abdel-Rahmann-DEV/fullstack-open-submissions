const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Note = require("./models/note");
const app = express();

//============================
// Middleware
//============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("dist"));

// moragan configuration
morgan.token("req-body", (req, res, next) => {
   return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));
//============================
// Api
//============================

// get notes
app.get("/api/notes", (req, res, next) => {
   Note.find({}).then((notes) => res.status(200).json(notes));
});
app.get("/api/notes/:id", (req, res, next) => {
   const id = +req.params.id;
   Note.findById(id)
      .then((note) => res.status(200).json(note))
      .catch((error) => next(error));
});
// delete note
app.delete("/api/notes/:id", (req, res, next) => {
   const id = +req.params.id;
   Note.findByIdAndDelete(id)
      .then(() => res.status(204).end())
      .catch((error) => next(error));
});
// add new note
app.post("/api/notes", (req, res, next) => {
   const body = req.body;
   if (!body.content) return res.status(301).json({ status: "error", message: "The note content is missing" });
   const payload = { content: req.body.content, important: body.important || false };
   const newNote = new Note(payload);
   newNote
      .save()
      .then((note) => res.status(200).json(note))
      .catch((err) => next(err));
});
app.get("/info", (req, res, next) => {
   const length = notes.length;
   const currTime = getCurrTime();
   res.status(200).send(`<p>Phonebook has info for ${length} people</p> <br /> <p>${currTime}</p>`);
   ("sat jan 22 2022 22:27:20 GMT+0200 (Eastern European Standard Time)");
});
// update note
app.patch("/api/notes/:id", (req, res, next) => {
   const id = req.params.id;
   const payload = {
      important: req.body.important,
   };

   Note.findByIdAndUpdate(id, payload, { new: true })
      .then((newNote) => {
         if (!newNote) {
            return res.status(404).json({ status: "error", message: "Note not found" });
         }
         return res.status(200).json(newNote);
      })
      .catch((error) => {
         console.error(error);
         return res.status(500).json({ status: "error" });
      });
});

//============================
// Unknown Endpoint
//============================
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

//============================
// Error Handle
//============================
const errorHandler = (err, req, res, next) => {
   console.log(err.name);
   if (err.name === "CastError") {
      return response.status(400).send({ error: "malformatted id" });
   } else if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
   }

   next(err);
};
app.use(errorHandler);

//============================
// Start server
//============================
const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log("server run in port " + PORT);
});

//============================
// Utilts Functions
//============================

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
      timeZoneName: "long",
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
