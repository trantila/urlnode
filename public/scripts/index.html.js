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
    function getInputValue(e) {
        return $("input").val();
    }

    var clicks = $("button").asEventStream("click")
        .log();

    var text = $("input").asEventStream("keyup")
        .map(getInputValue)
        .toProperty(getInputValue())
        .log();

    var buttonEnabled = text
        .map(urlnode.yes).log()
        .not().onValue($("button"), "attr", "disabled");
});
