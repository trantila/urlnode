var request = require("supertest"),
    assert = require("assert"),
    app = require("../app");

describe("Root routes", function() {
    describe("GET /", function() {
        it("should respond with the index page", function(done) {
            request(app)
                .get("/")
                .expect(200)
                .expect("Content-Type", /html/)
                .end(done);
        });
    });

    describe("GET known 404", function() {
        it("should respond with 404", function(done) {
            request(app)
                .get("/nopagehere")
                .expect(404)
                //.expect("404") // hi-fi
                .end(done);
        });
    });

    describe("POST /shorten", function() {
        it("should return an id on success", function(done) {
            request(app)
                .post("/shorten")
                .send({"link": "https://www.google.fi/"})
                .expect(200)
                .expect("Content-Type", /text\/plain/)
                .expect(/^.{5}$/)
                .end(done);
        });
        it("should return 400 on lacking parameters", function(done) {
            request(app)
                .post("/shorten")
                .send({"link_bad": "https://www.google.fi/"})
                .expect(400)
                .end(done);
        });
    });

    describe("GET /:id", function() {
        it("should respond with 301 on success", function(done) {
            var url = "https://www.google.fi/";
            request(app)
                .post("/shorten")
                .send({"link": url})
                .end(function(err, res) {
                    if (err) return done(err);
                    var id = res.text;
                    request(app)
                        .get("/" + id)
                        .expect(301)
                        .expect("Location", url)
                        .end(done);
                });
        });
        it("should respond with 404 if the entry is not there", function(done) {
            request(app)
                .get("/XXXXX")
                .expect(404)
                .end(done);
        });
    });
});


describe("URLS resource (/urls)", function() {
    describe("POST /urls", function() {
        it("should return the created resource with given details as json", function(done) {
            var id = "google";
            var link = "https://www.google.com";
            request(app)
                .post("/urls")
                .send({"id": id, "link": link})
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(function (res) {
                    var url = JSON.parse(res.text);
                    assert.equal(url.id, id, "ID");
                    assert.equal(url.link, link, "LINK");
                })
                .end(done);
        });
        it("should return 400 if the id is in use", function(done) {
            var id = "doubleid";
            var link = "https://www.google.com";
            request(app)
                .post("/urls")
                .send({"id": id, "link": link})
                .end(function(err, res) {
                    if (err) return done(err);
                    request(app)
                        .post("/urls")
                        .send({"id": id, "link": link})
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .end(done);
                });
        });
        it("should return 400 on missing parameters", function(done) {
            request(app)
                .post("/urls")
                .send({"id_bad": "bad_params1", "link": "bad_params1"})
                .expect(400)
                .expect("Content-Type", /application\/json/)
                .end(function(err, res) {
                    if (err) return done(err);
                    request(app)
                        .post("/urls")
                        .send({"id": "bad_params2"})
                        .expect(400)
                        .end(done);
                });
        });
    });

    describe.skip("GET /urls", function() {
        it("should return the collection resource as json", function(done) {
        });
    });

    describe.skip("GET /urls/:id", function() {
        it("should return an existing resource as json", function(done) {
        });
        it("should return 404 if the resource is not found", function(done) {
        });
    });
});
