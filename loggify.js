$(function(window, originalConsole, document, $, undefined) {
    'use strict';

    var $window = $(window),
        templates = {},
        css = '#loggify-navicon{display:inline-block;width:40px;height:30px;background-color:#437FAD;text-align:center;position:fixed;top:0;left:0;font-size:20px;lineheight:30px;color:#fff;z-index:99999999999}#loggify-navicon::-moz-focus-inner{border:0}#loggify-navicon:focus,#loggify-navicon:hover{text-decoration:none;outline:0}#loggify-navicon.expanded{background-color:#225176}#loggify-navicon.collapsed{background-color:#437FAD}#loggify-container{position:fixed;width:25%;height:100%;z-index:9999;color:#fff;font-size:16px;top:0;left:-25%;overflow-y:hidden;overflow-x:auto;resize:horizontal;background:#000;background:rgba(0,0,0,.6)}#loggify-container :focus{outline:0}#loggify-container ::-moz-focus-inner{border:0}#loggify-container a{text-decoration:none}#loggify-container a:focus,#loggify-container a:hover{text-decoration:none;outline:0}#loggify-container #loggify-info{height:30px;background-color:#437FAD;text-align:right;line-height:30px;padding-right:10px}#loggify-container #loggify-dimensions-container{height:30px;line-height:30px;background-color:#225176}#loggify-container #loggify-dimensions-container #loggify-dimensions{text-align:right;padding-right:10px}#loggify-container #loggify-log-container{border-top:1px solid #ccc;overflow-y:scroll;width:100%;height:100%}#loggify-container #loggify-log-container #loggify-log-clear{padding-right:10px;display:block;float:right;color:#fff;height:30px;line-height:30px}#loggify-container #loggify-log-container table{color:#fff;font-size:16px;width:100%}#loggify-container #loggify-log-container table thead th{vertical-align:top}#loggify-container #loggify-log-container table thead th.loggify-time{width:20%}#loggify-container #loggify-log-container table thead th.loggify-message{width:60%}#loggify-container #loggify-log-container table thead th.loggify-info{width:20%}#loggify-container #loggify-log-container table tbody tr.warn{color:orange}#loggify-container #loggify-log-container table tbody tr.error{color:red}#loggify-container #loggify-log-container table tbody tr:nth-child(even){background-color:#4C4C4C}#loggify-container #loggify-log-container table tbody td{vertical-align:top;padding:3px 5px}';

        templates.logContainer =
                '<a id="loggify-navicon" class="collapsed no-ajaxy" href="#">L</a>' +
                '<div id="loggify-container">' +
                '<div id="loggify-info">Logging like a boss | v 0.0.1</div>' +
                '<div id="loggify-dimensions-container"><div id="loggify-dimensions">{0}</div></div>' +
                '<div id="loggify-log-container"><a id="loggify-log-clear" href="#">Clear Log</a>' +
                '<table><thead><tr><th class="loggify-time"></th><th class="loggify-message"></th><th class="loggify-info"></th></tr></thead><tbody></tbody></table>' +
                '</div>' +
                '</div>';

        templates.logEntry = '<tr class="{0}"><td>{1}</td><td>{2}</td><td></td></tr>';

    // Functions
    //_________________________________________________________________________________________________
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        };
    }

    function updateDimensions () {
        var width = $window.width(),
            height = $window.height(),
            breakpoint = '';

        if (width >= 1200) {
            breakpoint = 'Desktops (≥1200px)';
        } else if (width >= 992 && width < 1200) {
            breakpoint = 'Desktops (≥1200px)';
        } else if (width < 992 && width >= 768) {
            breakpoint = 'Tablets (≥768px)';
        } else {
            breakpoint = 'Phones (<768px)';
        }
        $('#loggify-dimensions').html(width + ' x ' + height + ' | ' + breakpoint);
    }

    window.console = {};

    function log (message, type) {
        type = type || '';
        if ($.isPlainObject(message)) {
            message = JSON.stringify(message);
        }
        $('#loggify-log-container tbody').append(templates.logEntry.format(type, new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"), message, ''));
        $('#loggify-log-container').stop(true).animate({ scrollTop: $('#loggify-log-container').prop('scrollHeight') }, 100);
    };

    window.console.log = function(message) {
        log(message, 'info');
        if (originalConsole && originalConsole.log) {
            originalConsole.log.apply(originalConsole, arguments);
        }
    };

    window.console.info = function(message) {
        log(message, 'info');
        if (originalConsole && originalConsole.info) {
            originalConsole.info.apply(originalConsole, arguments);
        }
    };

    window.console.warn = function(message) {
        log(message, 'warn');
        if (originalConsole && originalConsole.warn) {
            originalConsole.warn.apply(originalConsole, arguments);
        }
    };

    window.console.error = function(message) {
        log(message, 'error');
        if (originalConsole && originalConsole.error) {
            originalConsole.error.apply(originalConsole, arguments);
        }
    };
    //_________________________________________________________________________________________________

    // Events
    //_________________________________________________________________________________________________
    $window.on('resize', function() {
        updateDimensions();
        window.console.log('Browser Resized');
    });
    //_________________________________________________________________________________________________

    // Init
    //_________________________________________________________________________________________________
    $('head').append('<style>' + css + '</style>');
    $('body').append(templates.logContainer.format($window.width() + ' x ' + $window.height()));
    $('#loggify-navicon').on('click', function (e) {
        e.preventDefault();
        var left = 0;
        if($(this).hasClass('expanded')) {
            left = -$('#loggify-container').width();
            $(this).removeClass('expanded').addClass('collapsed');
        } else {
            $(this).removeClass('collapsed').addClass('expanded');
        }
        $('#loggify-container').animate(
            {
                "left": left
            },
            250
        )
    });
    $('#loggify-log-clear').on('click', function (e) {
        e.preventDefault();
        $('#loggify-log-container tbody').html('');
    });
    updateDimensions();
    //_________________________________________________________________________________________________

}(window, window.console, document, jQuery));