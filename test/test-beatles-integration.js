'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

//const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
//const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe("Beatles Log", function() {
    before(function() {
      return runServer();
    });
  
    after(function() {
      return closeServer();
    });
  
    it("homepage should return 200 status code and be html", function() {
      return chai
        .request(app)
        .get("/")
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });

    it("add pages hould return 200 status code and be html", function() {
        return chai
          .request(app)
          .get("/add-song")
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
          });
      });

      it("deleted page should return 200 status code and be html", function() {
        return chai
          .request(app)
          .get("/song-deleted")
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
          });
      });
  });