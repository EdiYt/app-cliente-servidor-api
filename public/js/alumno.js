import LibroViewModel from '/viewmodels/LibroViewModel.js';

document.addEventListener('DOMContentLoaded', () => {
    loadAllBooks();
});

const libroViewModel = new LibroViewModel();

// Función para cargar todos los libros
async function loadAllBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/books/all');
        const books = await response.json();

        if (Array.isArray(books)) {
            // Mapea los libros externos usando LibroViewModel
            const allBooks = books.map(book => libroViewModel.mapBooksData(book));
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

function viewPdf(pdfUrl) {
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
function logout() {
    localStorage.removeItem('token');  
    sessionStorage.removeItem('token'); 

    window.location.href = 'index.html';
}
