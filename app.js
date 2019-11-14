var express = require("express");
var handlebars = require('express-handlebars').create();
var bodyParser = require('body-parser');
var fileupload = require('express-fileupload');
var fs = require('fs');

var app = express();

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(fileupload());

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
        if (err) {
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
        if (err) {
            return console.log(err);
        }
    });
    res.json(jsonData);
});

app.delete('/edit/contacts/:index', function(req, res) {
    var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    jsonData.contacts.splice(req.params.index, 1);
    var jsonStr = JSON.stringify(jsonData);
    fs.writeFile('data.json', jsonStr, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    res.json({
        index: req.params.index
    });
});

app.post('/edit', function(req, res) {
    console.log('i am working');
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let photoFile = req.files.photoFile;

    photoFile.mv('public/img/' + photoFile.name, function(err) {
        if (err)
            return res.status(500).send(err);

        var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
        jsonData.photos.push('img/' + photoFile.name);
        var jsonStr = JSON.stringify(jsonData);
        fs.writeFile('data.json', jsonStr, function(err) {
            if (err) {
                return console.log(err);
            }
        });
        res.render('edit', jsonData);
    });
});

app.delete('/edit/photos/:index', function(req, res) {
    console.log('hey');
    var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    jsonData.photos.splice(jsonData.photos.indexOf('img/' + req.params.index), 1);
    var jsonStr = JSON.stringify(jsonData);
    fs.writeFile('data.json', jsonStr, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    fs.unlink('public/img/' + req.params.index, function(err) {
        if (err) {
            console.log(err);
        }
    });
    res.json({
        index: req.params.index
    });
});

app.post('/edit/mainphoto', urlencodedParser, function(req, res) {
    var jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    jsonData.about.mainphoto = 'img/' + req.body.index;
    var jsonStr = JSON.stringify(jsonData);
    fs.writeFile('data.json', jsonStr, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    res.json({
        index: req.body.index
    });
});

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
