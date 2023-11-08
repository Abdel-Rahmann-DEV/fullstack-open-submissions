const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));
// moragan configuration
morgan.token("req-body", (req, res) => {
   return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));
let persons = [
   {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456",
   },
   {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523",
   },
   {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345",
   },
   {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122",
   },
];

app.get("/api/persons", (req, res) => {
   res.status(200).json(persons);
});
app.get("/api/persons/:id", (req, res) => {
   const id = +req.params.id;
   const person = persons.find((p) => p.id === id);
   if (!person) res.status(404).end();
   else res.status(200).json(person);
});
app.delete("/api/persons/:id", (req, res) => {
   const id = +req.params.id;
   persons = persons.filter((p) => p.id !== id);
   res.json({ status: "success" });
});
app.post("/api/persons", (req, res) => {
   const body = req.body;
   if (!body.name || !body.number) return res.status(301).json({ status: "error", message: "The name or number is missing" });
   const checkName = persons.find((p) => p.name === body.name);
   if (checkName) return res.status(301).json({ status: "error", message: "The name already exists in the phonebook" });
   const payload = { name: body.name, number: body.number, id: genId() };
   persons.push(payload);
   res.status(200).json(payload);
});
app.get("/info", (req, res) => {
   const length = persons.length;
   const currTime = getCurrTime();
   res.status(200).send(`<p>Phonebook has info for ${length} people</p> <br /> <p>${currTime}</p>`);
   ("sat jan 22 2022 22:27:20 GMT+0200 (Eastern European Standard Time)");
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
