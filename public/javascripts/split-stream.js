/*globals jQuery, Bacon*/
(function(window, $, Bacon, undefined) {
    var eventSource = $('.event-source');
    var ledger = $('.event-ledger');
    // var controls = $('input[name="listening"]');

    var valve = Bacon.$.radioGroupValue($('input[name="listening"]'))
        .toEventStream()
        .map(function(val) {
            return val === 'yes';
        });

    var stream = eventSource.asEventStream('mousemove')
        .holdWhen(valve.not())
        .map(parseEvent)
        .map(addTimestamp);

    // send event to logs
    stream.onValue(function(msg) {
        var ajaxStream = Bacon.$.ajaxPost('/log', {'message': msg});
        ajaxStream.onValue(function (resp) {
            // no op
        });
        ajaxStream.onError(function(err) {
            console.log(err);
        });
    });

    // update ledger
    stream.scan('', appendMessage).onValue(updateLedger(ledger));

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
        var source = e.currentTarget.dataset['source'];
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