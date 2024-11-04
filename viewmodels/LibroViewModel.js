class BooksViewModel {
    constructor() {
        this.books = [];
        this.currentBookId = null;
    }

    // Mapeo 
    mapBooksData(book) {
        return {
            id: book.id,
            nombre: book.nombre,
            autor: book.autor,
            genero: book.genero,
            universidad: book.universidad, 
            pdfPath: book.pdf_path,
            estatus: book.estatus ? 'Disponible' : 'No disponible',
        };
    }
}

module.exports = BooksViewModel;