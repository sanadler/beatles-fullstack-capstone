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

app.get("/add-song", (req, res) => {
    res.sendFile(__dirname + "/public/add-song.html");
});

app.get("/update-song", (req, res) => {
    res.sendFile(__dirname + "/public/update-song.html");
});

app.use(morgan("common"));

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
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

app.get('/songs/:id', (req, res) => {
  Song
    .findById(req.params.id)
    .then(song => res.json(song.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

app.post('/songs', (req, res) => {
  const requiredFields = ['name', 'album', 'year'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Song
    .create({
      name: req.body.name,
      album: req.body.album,
      year: req.body.year,
      writers: req.body.writers
    })
    .then(song => res.status(201).json(song.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});

app.put('/songs/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'album', 'year', 'writers'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Song
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedSong => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

app.delete('/songs/:id', (req, res) => {
  Song
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
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