var path         = require('path');
var fs           = require('fs');
var panelManager = require('../lib/panelManager');
var _            = require('underscore');

var UPLOAD_DIR_BASE = __dirname + '/../public/panelimages/';
function createImagePath(id, ext) {
    return path.normalize(UPLOAD_DIR_BASE + id + '.' + ext);
}

function typeToExt(type) {
    if (type === 'image/png') {
        return 'png';
    }
    else if (type === 'image/gif') {
        return 'gif';
    }
    return undefined;
}

exports.upload = function(req, res) {
    var file = req.files;

    console.dir(file);
    var ext = typeToExt( file.image.type );
    if (!ext) {
        res.send(400, 'Bad Request');
        return;
    }

    panelManager.createId(function(id) {
        var imagePath = createImagePath(id, ext);
        fs.rename( file.image.path, imagePath, function(err) {
            if (err) {
                res.send(500, err);
                return;
            }
            // ちゃんとしたモデルクラスを用意する
            var panel = {
                id        : id,
                imageName : path.basename(imagePath),
            };
            panelManager.addPanel( panel );
            res.redirect('/');
        });
    });
};

exports.panels = function(req, res) {
    var from = req.query.from;
    panelManager.retrievePanels(from, function( panels ) {
        res.json(200, panels);
    });
};
