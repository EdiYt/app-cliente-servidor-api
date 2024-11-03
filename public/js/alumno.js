document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
});

// Función para cargar todos los libros
function loadBooks() {
    fetch('http://localhost:3000/api/books/publico') // Asegúrate de que esta ruta solo devuelva libros públicos
        .then(response => response.json())
        .then(books => {
            const bookTable = document.querySelector('#bookTable tbody');
            bookTable.innerHTML = ''; // Limpia la tabla antes de agregar nuevos libros
            books.forEach(book => {
                const row = document.createElement('tr');
                const pdfLink = book.pdf_path ? `<button onclick="viewPdf('${book.pdf_path}')">Ver PDF</button>` : 'No disponible';
                const estatus = book.estatus ? 'Disponible' : 'No disponible';

                row.innerHTML = `
                    <td>${book.titulo}</td>
                    <td>${book.escritor}</td>
                    <td>${book.categoria}</td>
                    <td>${estatus}</td>
                    <td>${pdfLink}</td>
                `;
                bookTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los libros:', error));
}

// Función para filtrar libros en el buscador
function filterBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#bookTable tbody tr');

    rows.forEach(row => {
        const [title, author, genre] = row.children;
        const isVisible = [title, author, genre].some(cell =>
            cell.textContent.toLowerCase().includes(query)
        );
        row.style.display = isVisible ? '' : 'none';
    });
}

// Función para mostrar el PDF en una nueva pestaña
function viewPdf(pdfUrl) {
    window.open(pdfUrl, '_blank');
}
