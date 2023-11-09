require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person"); // Person Module

const app = express();

//====================================
// Middleware Config
//====================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));

morgan.token("req-body", (req, res) => {
   return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));

//====================================
// Routes
//====================================
app.get("/api/persons", (req, res) => {
   Person.find({}).then((persons) => res.json(persons));
});
app.get("/api/persons/:id", (req, res, next) => {
   const id = req.params.id;
   Person.findById(id)
      .then((person) => res.status(200).json(person))
      .catch((err) => next(err));
});
app.delete("/api/persons/:id", (req, res) => {
   const id = req.params.id;
   console.log(id);
   Person.findOneAndDelete(id)
      .then(() => res.status(200).json({ status: "success" }))
      .catch(() => res.status(404).end());
});
app.post("/api/persons", async (req, res) => {
   try {
      const { name, number } = req.body;

      if (!name || !number) {
         return res.status(400).json({ status: "error", message: "The name or number is missing" });
      }

      const existingPerson = await Person.findOne({ name });

      if (existingPerson) {
         return res.status(409).json({ status: "error", message: "The name already exists in the phonebook" });
      }

      const newPerson = new Person({ name, number });
      const savedPerson = await newPerson.save();
      res.status(201).json(savedPerson);
   } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Internal Server Error" });
   }
});
app.patch("/api/persons/:id", (req, res) => {
   const id = req.params.id;
   const { number } = req.body;
   if (!number) return res.status(404).json({ status: "error" }).end();
   Person.findByIdAndUpdate(id, { number })
      .then((newPerson) => res.status(200).json(newPerson))
      .catch(() => res.status(404).json({ status: "error" }).end());
});
app.get("/info", (req, res) => {
   Person.countDocuments({})
      .then((count) => {
         const currTime = getCurrTime();
         res.status(200).send(`<p>Phonebook has info for ${count} people</p> <br /> <p>${currTime}</p>`);
         ("sat jan 22 2022 22:27:20 GMT+0200 (Eastern European Standard Time)");
      })
      .catch(() => res.status(404).end());
});

//====================================
// Error Handleing Middleware
//====================================
const errorHandler = (err, req, res, next) => {
   console.error(err.message);

   const statusCode = err.statusCode || 500;

   res.status(statusCode).json({
      status: "error",
      message: err.message || "Internal Server Error",
   });
};
app.use(errorHandler);

//====================================
// Start Server
//====================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log("server run in port " + PORT);
});

//====================================
// Utilts Functions
//====================================
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
