'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
//const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Song} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedSongData() {
  console.info('seeding post data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateSongData());
  }
  // this will return a promise
  return Song.insertMany(seedData);
}

// used to generate data to put in db
function generateName() {
  const names = [
    'Hey Jude', 'Here Comes the Sun', 'Help!', 'Yesterday', 'Penny Lane'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateWriter() {
  const writers = ['Paul McCartney', 'George Harrison', 'Ringo Starr', 'John Lennon'];
  return writers[Math.floor(Math.random() * writers.length)];
}

function generateAlbum() {
  const albums = [
    'Help!', 'Abbey Road', 'The Beatles', 'Yellow Submarine'];
  return albums[Math.floor(Math.random() * albums.length)];
}

function generateYear() {
  const years = [
    1960, 1965, 1966, 1980];
  return years[Math.floor(Math.random() * years.length)];
}

function generateSongData() {
  return {
    name: generateName(),
    album: generateAlbum(),
    year: generateYear(),
    writers: [generateWriter(), generateWriter()]
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Song API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedSongData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });
  
  describe('GET endpoint', function() {
    it("should return all existing songs", function() {
      let res;
      return chai.request(app)
        .get('/songs')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body.songs).to.have.lengthOf.at.least(1);
          return Song.count();
        })
        .then(function(count) {
          expect(res.body.songs).to.have.lengthOf(count);
        });
    });

    it('should return songs with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let resSong;
      return chai.request(app)
        .get('/songs')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.songs).to.be.a('array');
          expect(res.body.songs).to.have.lengthOf.at.least(1);

          res.body.songs.forEach(function(song) {
            expect(song).to.be.a('object');
            expect(song).to.include.keys(
              'id', 'name', 'album', 'year', 'writers');
          });
          resSong = res.body.songs[0];
          return Song.findById(resSong.id);
        })
        .then(function(song) {

          expect(resSong.id).to.equal(song.id);
          expect(resSong.name).to.equal(song.name);
          expect(resSong.album).to.equal(song.album);
          expect(resSong.year).to.equal(song.year);
          expect(resSong.writers).to.deep.equal(song.writers);
        });
    });
  });
  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the restaurant we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new song', function() {

      const newSong = generateSongData();
      console.log(newSong);

      return chai.request(app)
        .post('/songs')
        .send(newSong)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'name', 'album', 'year', 'writers');
          expect(res.body.name).to.equal(newSong.name);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.album).to.equal(newSong.album);
          expect(res.body.year).to.equal(newSong.year);
        //  expect(res.body.writers).to.equal(newSong.writers);
          return Song.findById(res.body.id);
        })
        .then(function(song) {
          expect(song.name).to.equal(newSong.name);
          expect(song.year).to.equal(newSong.year);
          expect(song.album).to.equal(newSong.album);
       //   expect(song.writers).to.equal(newSong.writers);
        });
    });
  });
  

  describe('PUT endpoint', function() {

    // strategy:
    //  1. Get an existing restaurant from db
    //  2. Make a PUT request to update that restaurant
    //  3. Prove restaurant returned by request contains data we sent
    //  4. Prove restaurant in db is correctly updated
    it('should update fields you send over', function() {
      const updateData = {
        name: 'fofofofofofofof',
        year: 2000
      };

      return Song
        .findOne()
        .then(function(song) {
          updateData.id = song.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/songs/${song.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Song.findById(updateData.id);
        })
        .then(function(song) {
          expect(song.name).to.equal(updateData.name);
          expect(song.year).to.equal(updateData.year);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete a song by id', function() {

      let song;

      return Song
        .findOne()
        .then(function(_song) {
          song = _song;
          return chai.request(app).delete(`/songs/${song.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Song.findById(song.id);
        })
        .then(function(_song) {
          expect(_song).to.be.null;
        });
    });
  });
});
