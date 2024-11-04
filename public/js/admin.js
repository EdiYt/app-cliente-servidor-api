document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    document.getElementById('registerUserForm').addEventListener('submit', registerUser);
});

// Función para cargar todos los usuarios
function loadUsers() {
    fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(users => {
            const userTable = document.querySelector('#userTable tbody');
            userTable.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.rol}</td>
                `;
                userTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));
}

// Función para registrar un nuevo usuario
function registerUser(event) {
    event.preventDefault();

    const newUser = {
        nombre: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        rol: document.getElementById('registerRole').value
    };

    fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (response.ok) {
            alert('Usuario registrado correctamente');
            loadUsers();
            document.getElementById('registerUserForm').reset();
        } else {
            alert('Error al registrar el usuario');
        }
    })
    .catch(error => console.error('Error al registrar el usuario:', error));
}

// Función de cierre de sesión
function logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
}