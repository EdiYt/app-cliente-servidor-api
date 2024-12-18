document.addEventListener('DOMContentLoaded', () => {
    loadAllBooks();
    document.getElementById('registerBookForm').addEventListener('submit', registerBook);
    document.getElementById('editBookForm').addEventListener('submit', updateBook);
});

// Función para registrar un nuevo libro
function registerBook(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nombre', document.getElementById('registerName').value);
    formData.append('autor', document.getElementById('registerAuthor').value);
    formData.append('genero', document.getElementById('registerGenre').value);
    formData.append('universidad', 'UNAM'); 
    const pdfFile = document.getElementById('registerPdf').files[0];
    if (pdfFile) formData.append('pdf', pdfFile);

    fetch('http://localhost:3000/api/books', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Libro registrado correctamente');
            loadBooks(); 
            document.getElementById('registerBookForm').reset();
        } else {
            alert('Error al registrar el libro');
        }
    })
    .catch(error => console.error('Error al registrar el libro:', error));
}

async function loadAllBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/books/all');
        const books = await response.json();

        if (Array.isArray(books)) {
            const allBooks = [].concat(books);
            console.log("Libros combinados:", allBooks);
            displayBooks(allBooks); 
        } else {
            console.error("Error: la respuesta de libros no es un array");
        }
    } catch (error) {
        console.error('Error al cargar libros:', error);
    }
}

function displayBooks(books) {
    const bookTable = document.querySelector('#bookTable tbody');
    bookTable.innerHTML = '';

    books.forEach(book => {
        console.log('Mostrando libro:', book); 
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.nombre || book.titulo}</td>
            <td>${book.universidad || 'Desconocida'}</td>
            <td>${book.genero || book.categoria}</td>
            <td>
                <button onclick="viewPdf('${book.pdf_path || book.pdfLink}')">Ver PDF</button>
            </td>
        `;
        bookTable.appendChild(row);
    });
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

// Función de cierre de sesión
function logout() {
    localStorage.removeItem('token');  
    sessionStorage.removeItem('token'); 

    window.location.href = 'index.html';
}