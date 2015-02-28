var request = require("supertest"),
    app = require("../app");

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
