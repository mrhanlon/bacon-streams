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
        .scan('', concat)
        .onValue(updateLedger(ledger));

    function parseEvent(e) {
        console.log(e);
        return e.type + ' (x: ' + e.offsetX + ', y: ' + e.offsetY + ')';
    }

    function addTimestamp(msg) {
        var d = new Date();
        return '[ ' + (d.getTime() / 1000).toFixed(3) + ' ] ' + msg;
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