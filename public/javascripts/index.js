/*globals jQuery, Bacon*/
(function(window, $, Bacon, undefined) {
    var dragPad = $('.event-pad');
    var ledger = $('.event-ledger');
    // var controls = $('input[name="listening"]');

    var controlValve = Bacon.$.radioGroupValue($('input[name="listening"]'))
        .toEventStream()
        .map(function(val) {
            return val === 'yes';
        });

    var stream = dragPad.asEventStream('mousemove')
        .holdWhen(controlValve.not())
        .map(parseEvent)
        .map(addTimestamp)
        .map(makeMessage)
        .scan('', concat);

    stream.onValue(updateLedger(ledger));

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

    function makeMessage(msg) {
        return msg + '<br/>';
    }

    function concat(strCurr, strNew) {
        return strNew + strCurr;
    }

    function updateLedger(el) {
        return function(htmlContent) {
            el.html(htmlContent);
        };
    }
})(window, jQuery, Bacon);