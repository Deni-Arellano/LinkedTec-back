class PostulacionNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = "PostulacionNotFound";
        this.statusCode = 404;
    }
}

module.exports = PostulacionNotFound;