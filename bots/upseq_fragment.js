var request = require('request');
var fs = require('fs');
var path = require('path');

for ( var i = 0; i < 12; i++ ) (function(i) {
    setTimeout(function() {
        var r = request.post('http://tray.douzemille.net:8080/api/upload.json');
        var form = r.form();
        var fname = path.join(__dirname, 'fragment_imgs', (11 - i) + '.jpg');
        form.append('imageFile', fs.createReadStream(fname));
    }, 500 * i);
})(i);
