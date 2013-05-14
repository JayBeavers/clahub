var express = require('express')
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http')
var https = require('https')
var path = require('path')
var app = express();
app.configure(function () {
    app.set('port', '25313');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('imAlumberjack'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function () {
    app.use(express.errorHandler());
});
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', function (req, res) {
    res.redirect('https://github.com/login/oauth/authorize?client_id=f2982b46651991f435bd');
});
app.get('/callback', function (req, res) {
    console.log(req.query['code']);
    var accessTokenPath = '/login/oauth/access_token?client_id=f2982b46651991f435bd&client_secret=8cecb18cee3fc8e632e47f5a6fb9238e82dca798&code=' + req.query['code'];
    var request = https.request({
        method: 'POST',
        hostname: 'github.com',
        path: accessTokenPath
    }, function (atRes) {
        var accessToken;
        atRes.on('data', function (data) {
            accessToken = data.toString();
            req.session.accessToken = accessToken;
        });
        atRes.on('end', function () {
            res.redirect('/');
        });
    });
    request.end();
});
http.createServer(app).listen(app.get('port'), function () {
    console.log("Listening on port " + app.get('port'));
});
