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
                    <td>
                        <button onclick="editUser(${user.id})">Editar</button>
                    </td>
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

function editUser(userId) {
    fetch(`http://localhost:3000/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editName').value = user.nombre;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editUserFormContainer').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar los datos del usuario:', error));
}

function updateUser(event) {
    event.preventDefault();

    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        nombre: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value
    };

    fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (response.ok) {
            alert('Usuario actualizado correctamente');
            loadUsers();
            document.getElementById('editUserFormContainer').style.display = 'none';
        } else {
            alert('Error al actualizar el usuario');
        }
    })
    .catch(error => console.error('Error al actualizar el usuario:', error));
}

function cancelEdit() {
    document.getElementById('editUserFormContainer').style.display = 'none';
    document.getElementById('editUserForm').reset();
}
