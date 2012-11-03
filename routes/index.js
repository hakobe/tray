var path         = require('path');
var fs           = require('fs');
var panelManager = require('../lib/panelManager');

exports.index = function(req, res){
    res.render('index', {
        title: 'tray',
    });
};

var UPLOAD_DIR_BASE = __dirname + '/../public/panels/';
function createImagePath(file, ext) {
    var epoch = new Date().getTime() / 1000;
    return path.normalize(UPLOAD_DIR_BASE + epoch + '.' + ext);
}

exports.upload = function(req, res) {
    var file = req.files;

    console.dir(file);
    if (file.image.type === 'image/png') {
        var imagePath = createImagePath(file, 'png');
        fs.rename( file.image.path, imagePath, function(err) {
            if (err) {
                res.send(500, err);
                return;
            }
            panelManager.addPanel( {
                name : path.basename(imagePath),
            });
            res.redirect('/');
        });
    }
};
