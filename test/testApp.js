const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });

const chai = require('chai');
const expect = chai.expect;

describe('Test App', () => {
  it('should be able to login and search for Budweiser and update it', function (done) {
    this.timeout('30s');

    const uniqueDate = new Date().toLocaleDateString("en-US");
    const descriptionID = "#description";
    const chosenBeerDescriptionID ="#chosenBeerDescription";
    nightmare
      .goto("http://localhost:3000/")
      .click("#yesButton")
      .wait(2000)
      //.click("#identifierLink")
      //.wait(2000)
      .click("#identifierId")
      .type("#identifierId", "aaronKennedyTesting@gmail.com")
      .click("#identifierNext")
      .wait(2000)
      .click('input[name="password"]')
      .type('input[name="password"]', "BootCamp2018!")
      .click("#passwordNext")
      .wait(2000)
      .click("#beerAutocomplete")
      .type("#beerAutocomplete", "Budweiser")
      .click('div[data-index="0"]')
      .wait(2000)
      .click("#updateBeer")
      .wait(1000)
      .evaluate(descriptionID => {
        // now we're executing inside the browser scope.
        document.querySelector(descriptionID).value = "";
      }, descriptionID) 
      .type("#description", uniqueDate)
      .click("#beerSubmit")
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