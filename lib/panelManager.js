var util   = require('util');
var events = require('events');
var fs     = require('fs');
var config = require('./config');
var path   = require('path');
var _ = require('underscore');

var redis = require("redis");
redis.debug_mode = true;

var redisClient = redis.createClient();

redisClient.on('error', function(err) {
    console.error('redis error: ' +  err);
});

function redisKey(key) {
    return ['tray', key].join('-');
}

function PanelManager() {
    events.EventEmitter.call(this);
}
util.inherits(PanelManager, events.EventEmitter);

_.extend( PanelManager.prototype, {
    retrievePanels : function(from, callback) {
        redisClient.zrevrange(
            redisKey('panels'), 0, config.SIZE + 1,
            function(err, replies) {
                if (err) {
                    console.error(err);
                    return;
                }
                callback(_.map( replies, function(reply) { return JSON.parse(reply) } ));
            }
        );
    },
    createId : function(callback) {
        redisClient.incr( redisKey('lastPanelId'), function(err, id) {
            if (err) {
                console.error(err);
                return;
            }
            callback(id);
        });
    },
    addPanel : function(panel) {
        redisClient.zadd( 
            redisKey('panels'), 
            panel.id,
            JSON.stringify(panel),
            _.bind(function(err, replies) {
                if (err) {
                    console.error(err);
                    return;
                }
                this.deleteUnnecessaries();
            }, this)
        );

        this.emit('add', panel);

        return panel;
    },
    deleteUnnecessaries : function() {
        redisClient.zrevrange(
            redisKey('panels'), config.SIZE, -1,
            function(err, replies) {
                replies.forEach(function(reply) {
                    var panel = JSON.parse(reply);
                    fs.unlink(
                        path.normalize(config.UPLOAD_DIR_BASE + panel.imageName),
                        function(err) {
                            if (err) {
                                console.error(err);
                            }
                        }
                    );
                });
                redisClient.zremrangebyrank(
                    redisKey('panels'), 0, -(config.SIZE + 1),
                    function(err) {
                        if (err) {
                            console.error(err, replies);
                        }
                    }
                );
            }
        );
    }
});

module.exports = new PanelManager();
