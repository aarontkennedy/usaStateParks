const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });

const chai = require('chai');
const expect = chai.expect;

describe('Test App', () => {
  it('should be able to login and search for Budweiser and update it', function (done) {
    this.timeout('30s');

    nightmare
      .goto("http://localhost:3000/")
      .wait(3000)
      .evaluate(chosenBeerDescriptionID => {
        // now we're executing inside the browser scope.
        return document.querySelector(chosenBeerDescriptionID).innerText;
      }, chosenBeerDescriptionID) 
      .then(function (data) {
        expect(data).to.equal(uniqueDate);
        done();
      });

      nightmare.end();
  });

});