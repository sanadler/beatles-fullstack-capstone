'use strict';

const mongoose = require('mongoose');

// this is our schema to represent a restaurant
const songSchema = mongoose.Schema({
  name: {type: String, required: true},
  year: {type: Number, required: true},
  album: {type: String, required: true},
  writers: [ String ]
});

// songSchema.virtual('addressString').get(function() {
//   return `${this.address.building} ${this.address.street}`.trim();});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
songSchema.methods.serialize = function() {

  return {
    id: this._id,
    name: this.name,
    year: this.year,
    album: this.album,
    writers: this.writers
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Song = mongoose.model('Song', songSchema);

module.exports = {Song};
