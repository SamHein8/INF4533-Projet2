const express = require('express'),
    bodyParser = require('body-parser'),
    forge = require('node-forge');
    app = express(),
    port = 3000,
    fs = require('fs');

app.use(express.static('public'));

var letters = {};
let peers = {};

fs.readFile('letters.json', (err, data) => {
  if (err) {
    fs.writeFileSync('letters.json', JSON.stringify(letters));
  } else {
    letters = JSON.parse(data);
  }
})

//still needed?
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get("/getLetters", (req, res) => {
    //res.json({req: "/getLetters"});
    res.json(Object.values(letters));
});

app.get("/peers", (req, res) => {
    //res.json({req: "/peers"});
    res.json(Object.values(peers));
});

/*
app.post("/addLetter", bodyParser.text(), (req,res) => {
  letters[req.body] = req.body;
  res.end();
  fs.writeFileSync('letters.json', JSON.stringify(letters));
} );
*/

app.post("/addLetter", bodyParser.json(), (req, res) => {
    let msg = req.body.msg;
    letters[msg] = msg;
    res.json({req: "/addLetter", msg: req.body});
    fs.writeFileSync('letters.json', JSON.stringify(letters));
    res.end();
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

//app.set('view engine', 'jade');
//app.use(express.static(__dirname));