document.addEventListener('DOMContentLoaded', () => {
    loadAllBooks();
});

// Función para cargar todos los libros
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

// Función para mostrar el PDF en el iframe
function viewPdf(pdfUrl) {
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfFrame = document.getElementById('pdfFrame');

    pdfFrame.src = pdfUrl;
    pdfViewer.style.display = 'block'; 
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