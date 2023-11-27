const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true,
   },
   name: String,
   password: String,
   notes: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Note',
      },
   ],
});
userSchema.pre('save', async function (next) {
   const user = this; // 'this' refers to the user document

   if (user.isModified('password')) {
      const saltRounds = 12;
      user.password = await bcrypt.hash(user.password, saltRounds);
   }

   next();
});

userSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      const modifiedObject = {
         ...returnedObject,
         id: returnedObject._id.toString(),
      };

      delete modifiedObject._id;
      delete modifiedObject.__v;

      return modifiedObject;
   },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
