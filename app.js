var express  = require('express')
    , http   = require('http')
    , path   = require('path');

var routes = {
    index : require('./routes/index.js'),
    api   : require('./routes/api.js'),
};


var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({
        uploadDir: '/tmp'
    }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index.index);
app.get('/api/panels.json', routes.api.panels);
app.post('/api/upload.json', routes.api.upload);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
//socket.on('connection', function(socket) {
//    client.on('message', function(event){
//        console.log(event.message);
//    });
//});

var panelManager = require('./lib/panelManager');
panelManager.on('add', function(panel) {
    io.sockets.emit('paneladd', { latestPanelId : 0 });
})
