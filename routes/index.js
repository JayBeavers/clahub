exports.index = function (req, res) {
    
    var https = require('https');

    var username = 'Unknown';

    if (req.session && req.session.accessToken) {
        username = req.session.accessToken;
    }

    // res.render('index', { title: 'Express', user: username });

    https.get({ host: 'api.github.com', path: '/user?' + req.session.accessToken, headers: { 'User-Agent': 'CLAHub-0.1' } }, function (userResponse) {
        
        userResponse.on('data', function(data) {
            var userProfile = JSON.parse(data.toString());
            username = userProfile.login;
        });

        userResponse.on('end', function() {
            res.render('index', { title: 'Express', user: username });
        });
    });
};