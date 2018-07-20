var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var StateParkSchema = new Schema({
  name: { type: String, required: true /*, unique: true*/ }, // Many parks share names
  location: { type: String, /*required: true*/ }, // country/parish/island
  state: { type: String, required: true },
  country: { type: String, default: "USA" },
  /*yearEstablished: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },*/
  latitude: Number,
  longitude: Number,
  imageURL: {
    type: String,
    /* http://urlregex.com */
    match: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
  },
  // `body` is of type String
  remarks: String
});

// This creates our model from the above schema, using mongoose's model method
var StatePark = mongoose.model("StatePark", StateParkSchema);

// Export the StatePark model
module.exports = StatePark;
