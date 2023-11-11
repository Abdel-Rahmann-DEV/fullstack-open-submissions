const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
   .connect(url)

   .then(() => {
      console.log('connected to MongoDB');
   })
   .catch((error) => {
      console.log('error connecting to MongoDB:', error.message);
   });

const personSchema = new mongoose.Schema({
   name: {
      type: String,
      minlength: [3, 'The name must be at lest have 3 char'],
   },
   number: {
      type: String,
      validate: {
         validator(v) {
            return /^(?:\d{2,3}-\d{7,}|\d{8,})$/.test(v);
         },
         message: () => 'Invalid phone number.',
      },
   },
});

personSchema.set('toJSON', {
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

module.exports = mongoose.model('Persons', personSchema);
