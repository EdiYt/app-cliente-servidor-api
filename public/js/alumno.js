import BooksViewModel from '/viewmodels/LibroViewModel.js';

document.addEventListener('DOMContentLoaded', () => {
    loadAllBooks();
});

const libroViewModel = new BooksViewModel();

// Función para cargar todos los libros
async function loadAllBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/books/all');
        const books = await response.json();

        console.log("Datos recibidos desde la API:", books); 

        if (Array.isArray(books)) {
            // Mapea los libros externos usando LibroViewModel
            const allBooks = books.map(book => libroViewModel.mapBooksData(book));
            console.log("Libros combinados después del mapeo:", allBooks); 
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
            <td>${book.nombre}</td>
            <td>${book.universidad || 'Desconocida'}</td>
            <td>${book.genero}</td>
            <td>
                <button onclick="viewPdf('${book.pdfPath}')">Ver PDF</button>
            </td>
        `;
        bookTable.appendChild(row);
    });
}

let currentPdfUrl = null;

// Definir viewPdf en el objeto window para alcance global
window.viewPdf = function(pdfUrl) {
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfFrame = document.getElementById('pdfFrame');

    if (pdfViewer.style.display === 'block' && pdfFrame.src === pdfUrl) {
        pdfViewer.style.display = 'none';
        pdfFrame.src = ''; 
        currentPdfUrl = null; 
    } else {
        pdfFrame.src = pdfUrl;
        pdfViewer.style.display = 'block';
        currentPdfUrl = pdfUrl; 
    }
}

// Función de cierre de sesión
window.logout = function() {
    localStorage.removeItem('token');  
    sessionStorage.removeItem('token'); 

    window.location.href = 'index.html';
};

// Función para filtrar libros en el buscador
window.filterBooks = function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#bookTable tbody tr');

    rows.forEach(row => {
        const [title, university, genre] = row.children;
        const isVisible = [title, university, genre].some(cell =>
            cell.textContent.toLowerCase().includes(query)
        );
        row.style.display = isVisible ? '' : 'none';
    });
};
