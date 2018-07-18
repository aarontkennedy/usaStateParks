const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });

const chai = require('chai');
const expect = chai.expect;

describe('Test front page', () => {
  it('should go to google if you are a minor', function (done) {
    this.timeout('10s')

    nightmare
      .goto("http://localhost:3000/")
      .click("#noButton")
      .wait(2000)
      .url()
      .then(function (url) {
        expect(url).to.equal('https://www.google.com/');
        done();
      });
  });

  it('should go to google login in if you are old enough', function (done) {
    this.timeout('15s')

    nightmare
      .goto("http://localhost:3000/")
      .click("#yesButton")
      .wait(2000)
      .url()
      .end()
      .then(function (url) {
        let expectedHost = "https://accounts.google.com/";
        url = url.substring(0,expectedHost.length);
        console.log(url);
        expect(url).to.equal(expectedHost);
        done();
      });
  });
});

