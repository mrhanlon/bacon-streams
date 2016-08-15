/*globals jQuery, Bacon*/
(function(window, $, Bacon, undefined) {
    var ledger = $('.event-ledger');
    var sources = $('.event-source');
    var controls = $('.source-controls');
    var streams = [];

    $.each(sources, function(i, source) {
        var sourceId = source.dataset.sourceId;
        var controls = $('input[name="listening-' + sourceId + '"]');
        var valve = Bacon.$.radioGroupValue(controls)
            .toEventStream()
            .map(function(val) {
                return val === 'yes';
            });
        var stream = $(source).asEventStream('mousemove')
            .holdWhen(valve.not())
            .map(parseEvent)
            .map(addTimestamp)
        streams.push(stream);
    });

    Bacon.mergeAll(streams)
        .scan('', appendMessage)
        .onValue(updateLedger(ledger));

    function pad(pad, str, padLeft) {
        if (typeof str === 'undefined')
            return pad;
        if (padLeft) {
            return (pad + str).slice(-pad.length);
        } else {
            return (str + pad).substring(0, pad.length);
        }
    }

    function parseEvent(e) {
        var source = e.currentTarget.dataset['sourceName'];
        return source + ' (x: ' + pad('   ', e.offsetX, true) + ', y: ' + pad('   ', e.offsetY, true) + ')';
    }

    function addTimestamp(msg) {
        var d = new Date();
        return msg + ' [ ' + (d.getTime() / 1000).toFixed(3) + ' ]';
    }

    function appendMessage(strCurr, strNew) {
        return strNew + '<br>' + strCurr;
    }

    function updateLedger(el) {
        return function(htmlContent) {
            el.html(htmlContent);
        };
    }
})(window, jQuery, Bacon);