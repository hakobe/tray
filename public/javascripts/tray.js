(function() {
    var lastPanelId = 0;

    function showPanels () {
        var $panels = $('#panels');
        var $filedropPanel = $('#filedrop-panel');
        var $firstPanel = $panels.children()[0];

        $.getJSON('/api/panels.json?' + $.param({ from : lastPanelId }), function(panels) {
            _.each(panels.reverse(), function(panel) {
                var $img = $('<img />').attr({ src : '/panelimages/' + panel.imageName });
                $('<li />').attr({ class: "panel image" }).append($img).insertAfter( $firstPanel );
                if (panel.id > lastPanelId) {
                    lastPanelId = panel.id;
                }
            });
            if ( $panels.children().length > panels.length + 1) {
                while ( $panels.children().length > panels.length + 1) {
                    $(_.last($panels.children())).remove();
                }
            };
            $filedropPanel.removeClass('dragenter');
        });
    }

    Zepto(function() {
        var socket = io.connect(location.href);
        socket.on('paneladd', function (status) {
            showPanels();
        });

        showPanels();

        var $filedrop = $('#filedrop');

        $filedrop.on('dragenter', function(evt) {
            $filedrop.addClass('dragenter');
        });
        $filedrop.on('dragleave', function(evt) {
            $filedrop.removeClass('dragenter');
        });

        var $filedropPanel = $('#filedrop-panel');
        var $panels = $('#panels');
        var dragEndTimeout;
        var isDragging = false;
        $panels.on('dragenter', function(evt) {
            $filedropPanel.addClass('dragenter');
            isDragging = true;
            return false;
        })
        $panels.on('dragover', function(evt) {
            isDragging = true;
            return false;
        })
        $panels.on('dragleave', function(evt) {
            isDragging = false;
            clearTimeout(dragEndTimeout);
            dragEndTimeout = setTimeout( function() {
                if (!isDragging) {
                    $filedropPanel.removeClass('dragenter');
                }
            }, 100);
            return false;
        })
        $panels.on('drop', function(evt) {
            isDragging = false;

            var formData = new FormData($('#upload').get(0));

            var files = evt.dataTransfer.files;

            if (files && files.length > 0) {
                var file = files[0];
                formData.append('imageFile', file);
            }
            else {
                var imageUrl = evt.dataTransfer.getData('text/plain');
                if (!imageUrl) {
                    var node = $(evt.dataTransfer.getData('text/html'));
                    // ひとつくるんでやるとfindできるようになる
                    imageUrl = $('<div></div>').append(node).find('img').prop('src');
                }
                formData.append('imageUrl', imageUrl);
            }

            // FormData を使いたいので xhr を直接たたく
            var xhr = new XMLHttpRequest();
            var abortTimeout;
            xhr.open('POST', '/api/upload.json', true);
            xhr.send(formData);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    clearTimeout(abortTimeout);
                    if (xhr.status != 200) {
                        alert('upload failed');
                    }
                }
            };
            abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = function () {};
                xhr.abort();
                $filedropPanel.removeClass('dragenter');
                alert('upload failed');
            }, 30 * 1000);

            return false;
        });
    });
})();
