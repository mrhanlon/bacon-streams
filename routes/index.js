var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title:
        'Bacon Streams',
        extraScripts: ['/javascripts/index.js']
    });
});

router.get('/dual-stream', function(req, res, next) {
    var sources = [
        {
            id: 'source-a',
            name: 'Source A'
        }, {
            id: 'source-b',
            name: 'Source B'
        }
    ];

    res.render('dual_stream', {
        title: 'Dual Streams',
        sources: sources,
        extraScripts: ['/javascripts/dual-stream.js']
    });
});

router.get('/split-stream', function(req, res, next) {
    res.render('split_stream', {
        title: 'Split Streams',
        extraScripts: ['/javascripts/split-stream.js']
    });
});

var counter = 0;

router.post('/log', function(req, res, next) {
    counter++;
    if (counter % 40 === 0) {
        res.writeHead(429, {'Content-Type': 'application/json'});
        res.end('so many logs');
    } else {
        res.send('log ok: ' + req.body.message);
    }
});

module.exports = router;
