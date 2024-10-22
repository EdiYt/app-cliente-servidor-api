class BooksViewModel {
    constructor() {
        this.books = [];
        this.currentBookId = null; 
    }

    // Cargo todos los libros con el dao
    async loadBooks() {
        try {
            const response = await fetch('http://localhost:3000/api/books');
            if (!response.ok) {
                throw new Error('Error al cargar los libros');
            }
            this.books = await response.json();
            this.renderBooks();
        } catch (error) {
            console.error('Error al cargar los libros:', error);
        }
    }

    // Renderizar los libros en la vista
    renderBooks() {
        const bookTable = document.querySelector('#bookTable tbody');
        bookTable.innerHTML = '';

        this.books.forEach(book => {
            const row = document.createElement('tr');
            const pdfLink = book.pdf_path ? `<a href="${book.pdf_path}" target="_blank">Ver PDF</a>` : 'No disponible';
            const estatus = book.estatus ? 'Disponible' : 'No disponible';

            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.nombre}</td>
                <td>${book.autor}</td>
                <td>${book.genero}</td>
                <td>${pdfLink}</td>
                <td>${estatus}</td>
                <td><button onclick="booksViewModel.editBook(${book.id})">Actualizar</button></td>
            `;
            bookTable.appendChild(row);
        });
    }

    // Registro de los libros
    async registerBook(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('nombre', document.getElementById('registerName').value);
        formData.append('autor', document.getElementById('registerAuthor').value);
        formData.append('genero', document.getElementById('registerGenre').value);

        const pdfFile = document.getElementById('registerPdf').files[0];
        if (pdfFile) {
            formData.append('pdf', pdfFile);
        }

        try {
            const response = await fetch('http://localhost:3000/api/books', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al registrar el libro');
            }

            this.loadBooks(); 
            document.getElementById('registerBookForm').reset(); 
        } catch (error) {
            console.error('Error al registrar el libro:', error);
        }
    }

    // Cargo los datos de un libro y se pueden editar
    async editBook(bookId) {
        try {
            const response = await fetch(`http://localhost:3000/api/books/${bookId}`);
            if (!response.ok) {
                throw new Error('Libro no encontrado');
            }

            const book = await response.json();
            document.getElementById('bookId').value = book.id;
            document.getElementById('name').value = book.nombre;
            document.getElementById('author').value = book.autor;
            document.getElementById('genre').value = book.genero;
            document.getElementById('status').checked = book.estatus;

            document.getElementById('updateBookForm').style.display = 'block';

            this.currentBookId = book.id; 
        } catch (error) {
            console.error('Error al cargar el libro:', error);
        }
    }

    // Actualizo un libro
    async updateBook(event) {
        event.preventDefault();

        const bookId = this.currentBookId; 
        const name = document.getElementById('name').value;
        const author = document.getElementById('author').value;
        const genre = document.getElementById('genre').value;
        const status = document.getElementById('status').checked;

        try {
            const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: name,
                    autor: author,
                    genero: genre,
                    estatus: status
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el libro');
            }

            this.loadBooks(); 
            document.getElementById('updateBookForm').reset(); 
            document.getElementById('updateBookForm').style.display = 'none'; 
        } catch (error) {
            console.error('Error al actualizar el libro:', error);
        }
    }
}

// Aquí ocupo el ViewModel
const booksViewModel = new BooksViewModel();
document.addEventListener('DOMContentLoaded', () => booksViewModel.loadBooks());
document.getElementById('registerBookForm').addEventListener('submit', (event) => booksViewModel.registerBook(event));
document.getElementById('updateBookForm').addEventListener('submit', (event) => booksViewModel.updateBook(event));