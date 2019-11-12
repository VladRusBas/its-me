var express = require("express");
var handlebars = require('express-handlebars').create();
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    res.render('index', jsonData);
});

app.get('/edit', function(req, res) {
    var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    res.render('edit', jsonData);
});

app.post('/edit/about', urlencodedParser, function(req, res) {
    var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    jsonData.about.name = req.body.name;
    jsonData.about.additional = req.body.additional;
    jsonData.about.description = req.body.description;
    var jsonStr = JSON.stringify(jsonData);
    fs.writeFile('data.json', jsonStr, function(err) {
        if(err) {
            return console.log(err);
        }
    });
    res.json(jsonData);
});

app.post('/edit/contacts', urlencodedParser, function(req, res) {
    var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    jsonData.contacts.push(req.body.contact);
    var jsonStr = JSON.stringify(jsonData);
    fs.writeFile('data.json', jsonStr, function(err) {
        if(err) {
            return console.log(err);
        }
    });
    res.json(jsonData);
});

app.delete('/edit/contacts/:index', function(req, res) {
    var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    jsonData.contacts.splice(req.params.index, 1);
    console.log(req.params.index);
    var jsonStr = JSON.stringify(jsonData);
    fs.writeFile('data.json', jsonStr, function(err) {
        if(err) {
            return console.log(err);
        }
    });
    res.json({index: req.params.index});
})

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express is running on http://localhost:' +
        app.get('port') + '; press Ctrl+C to terminate.');
});
