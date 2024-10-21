document.addEventListener('DOMContentLoaded', () => {
    loadBooks(); // Cargar libros al cargar la página
});

// Función para cargar todos los libros
function loadBooks() {
    fetch('http://localhost:3000/api/books')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los libros');
            }
            return response.json();
        })
        .then(books => {
            const bookTable = document.querySelector('#bookTable tbody');
            bookTable.innerHTML = ''; // Limpiar la tabla antes de agregar los libros
            books.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.nombre}</td>
                    <td>${book.autor}</td>
                    <td>${book.genero}</td>
                    <td>
                        <button onclick="editBook(${book.id})">Actualizar</button>
                    </td>
                `;
                bookTable.appendChild(row); // Agregar la fila a la tabla
            });
        })
        .catch(error => console.error('Error al cargar los libros:', error));
}

// Función para editar un libro
function editBook(bookId) {
    fetch(`http://localhost:3000/api/books/${bookId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Libro no encontrado');
            }
            return response.json();
        })
        .then(book => {
            document.getElementById('bookId').value = book.id;
            document.getElementById('name').value = book.nombre;
            document.getElementById('author').value = book.autor;
            document.getElementById('genre').value = book.genero;
            document.getElementById('status').checked = book.estatus;

            document.getElementById('updateBookForm').style.display = 'block'; // Mostrar el formulario de actualización
        })
        .catch(error => console.error('Error al cargar el libro:', error));
}

// Evento para manejar la actualización de un libro
document.getElementById('updateBookForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario
    const bookId = document.getElementById('bookId').value;
    const name = document.getElementById('name').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const status = document.getElementById('status').checked;

    fetch(`http://localhost:3000/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json' // Enviar como JSON
        },
        body: JSON.stringify({
            nombre: name,
            autor: author,
            genero: genre,
            estatus: status
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Libro actualizado correctamente.');
            loadBooks(); // Volver a cargar los libros
            document.getElementById('updateBookForm').reset(); // Limpiar el formulario
            document.getElementById('updateBookForm').style.display = 'none'; // Ocultar el formulario
        } else {
            alert('Error al actualizar el libro.');
        }
    })
    .catch(error => {
        console.error('Error al actualizar el libro:', error);
        alert('Error al actualizar el libro: ' + error.message);
    });
});

// Evento para manejar el registro de un libro
document.getElementById('registerBookForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario
    const formData = {
        nombre: document.getElementById('registerName').value,
        autor: document.getElementById('registerAuthor').value,
        genero: document.getElementById('registerGenre').value,
        estatus: document.getElementById('registerStatus').checked,
    };

    fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Enviar como JSON
        },
        body: JSON.stringify(formData) // Convertir a JSON
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error desconocido al registrar el libro');
            });
        }
        return response.json(); // Parsear la respuesta JSON
    })
    .then(data => {
        alert('Libro registrado correctamente.');
        loadBooks(); // Volver a cargar los libros
        document.getElementById('registerBookForm').reset(); // Limpiar el formulario
    })
    .catch(error => {
        console.error('Error al registrar el libro:', error);
        alert('Error al registrar el libro: ' + error.message); // Mensaje de error
    });
});