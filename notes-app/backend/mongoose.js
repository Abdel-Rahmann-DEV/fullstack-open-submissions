require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Note = require('./models/note');

mongoose.connect(process.env.MONGODB_URI);

const insertNotesinUsers = async () => {
   await User.deleteMany({});
   await Note.deleteMany({});
};

const send = async () => {
   try {
      await insertNotesinUsers();
      console.log('Data migration completed successfully.');
   } catch (error) {
      console.error('Error during data migration:', error);
   } finally {
      await mongoose.connection.close();
      console.log('Connection to MongoDB closed.');
      process.exit();
   }
};

// Call the function to perform data migration
send();
