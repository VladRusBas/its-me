var express = require("express");
var handlebars = require('express-handlebars').create();
var fs = require('fs');

var app = express();

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
