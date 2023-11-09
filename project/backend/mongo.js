const mongoose = require("mongoose");

if (process.argv.length < 3) {
   console.log("give password as argument");
   process.exit(1);
}
const password = encodeURIComponent(process.argv[2]);

const url = `mongodb://abdo:${password}@ac-5y7q7ra-shard-00-00.ghyns40.mongodb.net:27017,ac-5y7q7ra-shard-00-01.ghyns40.mongodb.net:27017,ac-5y7q7ra-shard-00-02.ghyns40.mongodb.net:27017/noteApp?ssl=true&replicaSet=atlas-5vqn06-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
   content: String,
   important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
   content: "HTML is Easy",
   important: true,
});

note.save().then((result) => {
   console.log("note saved!");
   mongoose.connection.close();
});
