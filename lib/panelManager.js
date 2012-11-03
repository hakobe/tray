var util = require('util');
var events = require('events');
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
        redisClient.zrevrangebyscore( 
            redisKey('panels'), 
            '+inf', '('+(from || 0), 
            'limit', 0, 20,
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
            redis.print
        );

        this.emit('add', panel);

        return panel;
    }
});

module.exports = new PanelManager();
