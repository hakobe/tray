function showPanels () {
    var $panels = $('ul#panels');

    $.getJSON('/api/panels.json', function(panels) {
        $panels.empty();
        _.each(panels, function(panel) {
            console.log(panel);
            var $img = $('<img />').attr({ src : '/panelimages/' + panel.imageName });
            $panels.append($('<li />').append($img));
        });
    });
}

Zepto(function() {
    var socket = io.connect('http://localhost:3000');
    socket.on('paneladd', function (status) {
        showPanels();
    });

    showPanels();
});
