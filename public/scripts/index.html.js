/*
 * URLNode namespace
 */
(function urlnode (root) {
    function yes(arg) {
        return !!arg;
    }

    root.urlnode = {
        "yes": yes
    };
})(window);


///////////////////////////////////////////////////////////////////////////////
// ON PAGE LOAD
///////////////////////////////////////////////////////////////////////////////

$(function () {
    var clicks = $("button").asEventStream("click").log();
    var text = $("input").asEventStream("keyup").map(function (e) {
        return $(e.target).val();
    }).toProperty().log();

    var buttonEnabled = text.map(urlnode.yes).log();

    buttonEnabled.onValue(function(enabled) {
        $("button").attr("disabled", !enabled);
    });
});
