'use strict';

const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const morgan = require("morgan");
const app = express();
app.use(express.static('public'));
app.use(express.json());

const { PORT, DATABASE_URL } = require('./config');
const { Song } = require('./models');

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.use(morgan("common"));

//get endpoint, gets all the songs in the database
app.get('/songs', (req, res) => {
  Song
    .find()
    .then(songs => {
      res.json({
        songs: songs.map(
          (song) => song.serialize())
      });
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

//get by id endpoint
app.get('/songs/:id', (req, res) => {
  Song
    .findById(req.params.id)
    .then(song => res.json(song.serialize()))
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' });
    });
});

//get by name endpoint
app.get('/songs/name/:name', (req, res) => {
  Song
    .find({ "name": req.params.name })
    .then(songs => {
      res.json({
        songs: songs.map(
          (song) => song.serialize())
      });
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' });
    });
});

//post endpoint .. extra check for writers since its an array
app.post('/songs', (req, res) => {
  const requiredFields = ['name', 'album', 'year', 'writers'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      return res.status(400).send(message);
    }
    if (req.body.writers.length == 0 || req.body.writers.length == null){
      const message = `Missing \`${field}\` in request body`;
      return res.status(400).send(message);
    }
  }
//create the song in the database and post
  Song
    .create({
      name: req.body.name,
      album: req.body.album,
      year: req.body.year,
      writers: req.body.writers
    })
    .then(song => res.status(201).json(song.serialize()))
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' });
    });

});

//update song endpoint
app.put('/songs/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  // if (req.body.writers.length == 0 || req.body.writers.length == null){
  //   const message = `Missing \`${field}\` in request body`;
  //   return res.status(400).send(message);
  // }

  const updated = {};
  const updateableFields = ['name', 'album', 'year', 'writers'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
//find song by id and update the fields
  Song
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

//delete song endpoint
app.delete('/songs/:id', (req, res) => {
  Song
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    });
});

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };