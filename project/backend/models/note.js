const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
   content: {
      type: String,
      required: true,
      minlength: 5,
   },
   important: Boolean,
});

noteSchema.set('toJSON', {
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

module.exports = mongoose.model('Note', noteSchema);
