var path         = require('path');
var fs           = require('fs');
var request      = require('request');
var panelManager = require('../lib/panelManager');
var config       = require('../lib/config');
var _            = require('underscore');

function createImagePath(id, ext) {
    return path.normalize(config.UPLOAD_DIR_BASE + id + '.' + ext);
}

function typeToExt(type) {
    if (type === 'image/png') {
        return 'png';
    }
    else if (type === 'image/gif') {
        return 'gif';
    }
    else if (type === 'image/jpeg') {
        return 'jpeg';
    }
    return undefined;
}

exports.upload = function(req, res) {
    var file = req.files;

    if (file && file.imageFile) {
        var ext = typeToExt( file.imageFile.type );
        if (!ext) {
            res.send(400, 'Bad Request');
            return;
        }
        panelManager.createId(function(id) {
            var imagePath = createImagePath(id, ext);
            fs.rename( file.imageFile.path, imagePath, function(err) {
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
    }
    else if (req.body.imageUrl) {
        request.get({
            url : req.body.imageUrl,
            encoding : null,
        }, function(err, response, body) {
            if (err || response.statusCode !== 200) {
                res.send(500, err);
                return;
            }
            var ext = typeToExt( response.headers['content-type'] );
            if (!ext) {
                res.send(400, 'Bad Request');
                return;
            }

            panelManager.createId(function(id) {
                var imagePath = createImagePath(id, ext);
                fs.writeFile(imagePath, body, function (err) {
                    if (err) {
                        res.send(500, err);
                        return;
                    }
                    var panel = {
                        id        : id,
                        imageName : path.basename(imagePath),
                    };
                    panelManager.addPanel( panel );
                    res.redirect('/');
                });
            });
        });
    }
    else {
        res.send(400, 'Bad Request');
    }
};

exports.panels = function(req, res) {
    var from = req.query.from;
    panelManager.retrievePanels(from, function( panels ) {
        res.json(200, panels);
    });
};
