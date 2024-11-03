document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    document.getElementById('registerBookForm').addEventListener('submit', registerBook);
    document.getElementById('editBookForm').addEventListener('submit', updateBook);
});

// Función para cargar todos los libros
function loadBooks() {
    fetch('http://localhost:3000/api/books')
        .then(response => response.json())
        .then(books => {
            const bookTable = document.querySelector('#bookTable tbody');
            bookTable.innerHTML = '';
            books.forEach(book => {
                const row = document.createElement('tr');
                const pdfLink = book.pdf_path ? `<button onclick="viewPdf('${book.pdf_path}')">Ver PDF</button>` : 'No disponible';
                const estatus = book.estatus ? 'Disponible' : 'No disponible';

                row.innerHTML = `
                    <td>${book.nombre}</td>
                    <td>${book.autor}</td>
                    <td>${book.genero}</td>
                    <td>${estatus}</td>
                    <td>${pdfLink}</td>
                    <td>
                        <button onclick="editBook(${book.id})">Editar</button>
                    </td>
                `;
                bookTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los libros:', error));
}

// Función para ver el PDF en el iframe
function viewPdf(pdfUrl) {
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfFrame = document.getElementById('pdfFrame');

    if (pdfViewer.style.display === 'none' || pdfFrame.src !== pdfUrl) {
        pdfFrame.src = pdfUrl;
        pdfViewer.style.display = 'block';
    } else {
        pdfFrame.src = ''; 
        pdfViewer.style.display = 'none';
    }
}

// Función para mostrar el formulario de edición con los datos del libro
function editBook(bookId) {
    fetch(`http://localhost:3000/api/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
            document.getElementById('editBookId').value = book.id;
            document.getElementById('editName').value = book.nombre;
            document.getElementById('editAuthor').value = book.autor;
            document.getElementById('editGenre').value = book.genero;
            document.getElementById('editStatus').value = book.estatus.toString(); 
            document.getElementById('editBookFormContainer').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar los datos del libro:', error));
}

// Función para actualizar el libro en la base de datos
function updateBook(event) {
    event.preventDefault();

    const bookId = document.getElementById('editBookId').value;
    const updatedBook = {
        nombre: document.getElementById('editName').value,
        autor: document.getElementById('editAuthor').value,
        genero: document.getElementById('editGenre').value,
        estatus: document.getElementById('editStatus').value === 'true'
    };

    fetch(`http://localhost:3000/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBook)
    })
    .then(response => {
        if (response.ok) {
            alert('Libro actualizado correctamente');
            loadBooks();
            cancelEdit();
        } else {
            alert('Error al actualizar el libro');
        }
    })
    .catch(error => console.error('Error al actualizar el libro:', error));
}

// Función para cancelar la edición
function cancelEdit() {
    document.getElementById('editBookFormContainer').style.display = 'none';
    document.getElementById('editBookForm').reset();
}