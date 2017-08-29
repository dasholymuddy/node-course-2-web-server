const express = require ('express');
const hbs = require ('hbs');
const fs = require ('fs');

var app = express();
var logFile = __dirname + '/log/server.log';

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// middleware for logging
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url} `;
  console.log(log);
  console.log('logging to ' + logFile);
  fs.appendFile(logFile, log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

// middlware for maintenance
app.use((req, res, next) => {
  res.render('maintenance.hbs', {
    pageTitle: 'Server out for a toke.',
    pageMessage: 'Back real soon, dude.'
  });
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs',{
    pageTitle: 'Welcome, yo',
    pageMessage: "Jesse in the ABQ welcomes you."
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About, yo',
    pageMessage: "Here's about Jesse, yo."
  });
});

// create /bad route; send json data with error message property

app.get('/bad', (req, res) => {
  res.send({
    error: {
      code: 'bogus',
      dialect: 'spiccoli',
      message: 'dude! that\'s totally bogus!',
      'WTF to do': [
          'cry',
          'eat pizza',
          'surf',
          'toke'
      ]
    }
  })
})

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
