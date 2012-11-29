var request = require('request');
var fs = require('fs');
var path = require('path');

var oe = Math.floor(( Math.random() * 10 ) ) % 2;
for ( var i = 0; i < 12; i++ ) (function(i) {
    if ( i % 2 == oe ) { return; }
    setTimeout(function() {
        var r = request.post('http://tray.douzemille.net:8080/api/upload.json');
        var form = r.form();
        var fname = path.join(__dirname, 'imgs', i + '.jpg');
        form.append('imageFile', fs.createReadStream(fname));
    }, 10 * 1000 * i);
})(i);
