document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

function loadUsers() {
    fetch('http://localhost:3000/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(users => {
            const userTable = document.querySelector('#userTable tbody');
            userTable.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="editUser(${user.id})">Actualizar</button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));
}

// Función para editar un usuario
function editUser(userId) {
    fetch(`http://localhost:3000/api/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }
            return response.json();
        })
        .then(user => {
            document.getElementById('userId').value = user.id;
            document.getElementById('name').value = user.nombre;
            document.getElementById('email').value = user.email;

            document.getElementById('updateSection').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar el usuario:', error));
}

// Función para ocultar el formulario de actualización
function hideUpdateForm() {
    document.getElementById('updateSection').style.display = 'none';
}

// Evento para manejar la actualización de un usuario
document.getElementById('updateUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (!name || !email) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: name, email: email })
    })
    .then(response => {
        if (response.ok) {
            alert('Usuario actualizado correctamente.');
            loadUsers();
            hideUpdateForm();
        } else {
            alert('Error al actualizar el usuario.');
        }
    })
    .catch(error => console.error('Error al actualizar el usuario:', error));
});