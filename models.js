'use strict';

const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  name: {type: String, required: true},
  year: {type: Number, required: true},
  album: {type: String, required: true},
  writers: {type: [String], required: true}
});


songSchema.methods.serialize = function() {

  return {
    id: this._id,
    name: this.name,
    year: this.year,
    album: this.album,
    writers: this.writers
  };
};

const Song = mongoose.model('Song', songSchema);

module.exports = {Song};
