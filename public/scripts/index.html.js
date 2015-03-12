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

    var clicks = $("button").asEventStream("click");
    clicks.log();

    var text = $("input").asEventStream("keyup")
        .map(getInputValue)
        .toProperty(getInputValue());
    text.log();

    var buttonEnabled = text
        .map(urlnode.yes);
    buttonEnabled.log();

    buttonEnabled.not()
        .onValue($("button"), "attr", "disabled");

    var responses = clicks.flatMap(function(click) {
        console.log("ENTER AJAX");
        return Bacon.fromPromise($.post("/shorten/", {
            "link": $("input").val()
        }));
    });
    responses.onValue(function (response) {
        console.log("AJAX RETURNS");
    });
});
