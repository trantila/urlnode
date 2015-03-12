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


// URL model
var URL = Backbone.Model.extend({});

// URLs collection
var URLs = Backbone.Collection.extend({
    model: URL
});


// URL list view
var URLEntry = Backbone.View.extend({
    tagName: "li",
    className: "url-entry",
    events: {
        "click .icon":          "open",
        "click .button.edit":   "openEditDialog",
        "click .button.delete": "destroy"
    },

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {}

});


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
