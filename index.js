const express = require('express'),
    bodyParser = require('body-parser'),
    forge = require('node-forge');
const { stringify } = require('querystring');
    app = express(),
    port = 3000,
    fs = require('fs');

app.use(express.static('public'));

var letters = {};
let peers = {Ex1:"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSYTkZi9scozgURRFjkayY/MgG\nyVNe3WxFQBDKmdKqrF1QUP96di+hWSBifDeLeyDDZthJkf5WW17fiu0bd1UR7xoU\nUpd2AaO2XGKUaXWsWy/RkxrT+GD+dhlnw+C1qsZg9whTMMpjeBbuKj8kdX+vycpx\nTNW917acWB8VQtwWIQIDAQAB\n-----END PUBLIC KEY-----",
Ex2:"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAQc8tFOHSrxAbTxheOLKTOFH9\nXhh6js6fuXbK+6jALVdscQblBfvEveYrfxyrIQXitEiZ8yMAQxwdQFrHB546NphK\nY+3pb6Ro19TIpC/RvtHCL66FgpM8H3zUxEQnXzOv3jw9GBJltsWtdZQAEcTjB0Ds\nquWsLkKzT9b0y2lX+QIDAQAB\n-----END PUBLIC KEY-----"};

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
    res.json(Object.values(letters));
});

app.get("/peers", (req, res) => {
    res.json(peers);
});


app.post("/addLetter", bodyParser.text(), (req,res) => {
  letters[req.body] = req.body;
  res.end();
  fs.writeFileSync('letters.json', JSON.stringify(letters));
} );

/*
app.post("/addLetter", bodyParser.json(), (req, res) => {
    let msg = req.body.msg;
    letters[msg] = msg;
    res.json({req: "/addLetter", msg: req.body});
    fs.writeFileSync('letters.json', JSON.stringify(letters));
    res.end();
});*/

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

//app.set('view engine', 'jade');
//app.use(express.static(__dirname));