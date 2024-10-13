class NewsUpdateError extends Error {
    constructor(message='Error al actualizar la noticia') {
        super(message);
        this.name = "NewsUpdateError";
    }
}

module.exports = NewsUpdateError;