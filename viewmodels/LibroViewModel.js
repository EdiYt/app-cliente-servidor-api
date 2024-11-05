class BooksViewModel {
    constructor() {
        this.books = [];
        this.currentBookId = null;
    }

    // Mapeo
    mapBooksData(book) {
        return {
            id: book.id || null,
            nombre: book.nombre || '',
            autor: book.autor || '',
            genero: book.genero || '',
            universidad: book.universidad || '',
            pdfPath: book.pdf_path || book.ruta || '', // Aquí ajustamos para aceptar pdf_path o ruta
            estatus: book.estatus ? 'Disponible' : 'No disponible',
        };
    }
}

export default BooksViewModel;
