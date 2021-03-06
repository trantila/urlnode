var express = require('express');
var debug = require('debug')('urlnode:routes');
var root = express.Router();
var urls = express.Router();

//////////////////////////////////////////////////////////////////////////////
/// LOGIC
//////////////////////////////////////////////////////////////////////////////

// Initialize an empty up-scoped variable as "DB"
var db = {};

/// Create an ID of length 5. Collisions are handled by try-try-try-again.
function createId() {
    var id = "";
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Try five times. Repeated collisions unprobable enough for now!
    for (var tryout=0; tryout<5; tryout++) {
        for (var i=0; i<5; i++)
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        // If the entry is unique (and not built-in) break and be happy with it
        if (typeof db[id] === "undefined")
            break;
        else
            id = "";
        // Log excess attempts
        if (tryout)
            console.log(["Retrying id creation, attempt #", tryout+1].join(""));
    }

    return id;
}

//////////////////////////////////////////////////////////////////////////////
/// ROUTES
//////////////////////////////////////////////////////////////////////////////

/// Root level

// GET home page.
root.get('/', function(req, res, next) {
    res.render('index', {
        title: 'URLNode',
        title_kicker: ' - URL shortener on node.js',
        db: db
    });
});

// POST /shorten
root.post("/shorten", function(req, res, next) {
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
            res.set("Content-Type", "text/plain");
            res.status(200).send(id);
        }
    }
});

// GET /:id
root.get("/:id", function(req, res, next) {
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
});


/// URLS collection

root.use("/urls", urls);
urls.all(function(req, res, next) {
    res.set("Content-type", "application/json");
})

// Collection
urls.route("/")
.get(function(req, res, next) {
    debug("GET /urls/");
    // TODO no limits
    var entries = [];
    for (id in db)
        entries.push({"id": id, "link": db[id]});
    res.status(200).json(entries);
})
// POST /
.post(function(req, res, next) {
    debug(["POST /urls/ ", JSON.stringify(req.body)].join(""));
    // Check that request has params link and id
    if (!req.body.link || !req.body.id) {
        res.status(400).json({"error": "Request missing parameter(s)."});
    } else {
        if (db[req.body.id]) {
            res.status(400).json({"error": "Entry with given short-url/id exists already."});
        } else {
            db[req.body.id] = req.body.link;
            res.status(200).json({"id": req.body.id, "link": req.body.link});
        }
    }
});

// Resource
urls.route("/:id")
.get(function(req, res, next) {
    debug("GET /urls/:id");
    if (!db[req.params.id])
        res.status(404).json({"error": "No entry with given id."});
    else
        res.status(200).json({"id": req.body.id, "link": db[req.params.id]});
});


module.exports = root;
