document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
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

                row.innerHTML = `
                    <td>${book.nombre}</td>
                    <td>${book.universidad || 'UNAM'}</td>
                    <td>${book.genero}</td>
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