var express = require('express');
var debug = require('debug')('urlnode:routes');
var router = express.Router();

//////////////////////////////////////////////////////////////////////////////
/// LOGIC
//////////////////////////////////////////////////////////////////////////////

// Initialize an empty up-scoped variable as "DB"
var db = {};

/// Create an ID of length 5. Collisions are handled by try-try-try-again.
function createId() {
    var id = null;
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Try five times. Repeated collisions unprobable enough for now!
    for (var tryouts=0; tryouts<5; tryouts++) {
        for (var i=0; i<5; i++)
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        // If the entry is unique (and not built-in) break and be happy with it
        if (typeof db[id] === "undefined")
            break;
    }

    return id;
}

//////////////////////////////////////////////////////////////////////////////
/// ROUTES
//////////////////////////////////////////////////////////////////////////////

// GET home page.
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' , db: JSON.stringify(db, null, "\t")});
});

// POST /shorten
router.post("/shorten", function(req, res, next) {
    debug(["POST /shorten ", JSON.stringify(req.body)].join(""));
    // Check that request has param link (as url-encoded)
    if (!req.body.link) {
        res.status(400).send("Request missing parameter link.");
    } else {
        // Create a random ID and store the link. If the ID is falsey, generation failed.
        id = createId();
        if (!id) {
            res.status(500).send("Could not generate an shorthand URL. You may try again.");
        } else {
            db[id] = req.body.link;
            res.status(200).send(id);
        }
    }
});

// GET /:id
router.get("/:id", function(req, res, next) {
    //TODO sanitize
    var url = db[req.params.id];
    debug(["GET /:id", req.params.id, "->", url].join(" "));
    // Check existence
    if (!url) {
        // Move on and likely give proper 404s later
        next();
    } else {
        res.redirect(301, url);
    }
})


module.exports = router;
