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
    res.render('split_stream', {
        title: 'Dual Streams',
        extraScripts: ['/javascripts/dual-streams.js']
    });
});

router.get('/split-stream', function(req, res, next) {
    res.render('split_stream', {
        title: 'Split Streams',
        extraScripts: ['/javascripts/split-streams.js']
    });
});

module.exports = router;
