// js/users.js
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
            userTable.innerHTML = ''; // Limpia la tabla antes de cargar nuevos datos
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
            return response.json(); // Parsear la respuesta a JSON
        })
        .then(user => {
            document.getElementById('userId').value = user.id; 
            document.getElementById('name').value = user.nombre;
            document.getElementById('email').value = user.email;

            // Mostrar el formulario de actualización
            document.getElementById('updateSection').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar el usuario:', error));
}

// Función para ocultar el formulario de actualización
function hideUpdateForm() {
    document.getElementById('updateSection').style.display = 'none'; // Ocultar el formulario
}

// Evento para manejar la actualización de un usuario
document.getElementById('updateUserForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Validar que los campos no estén vacíos
    if (!name || !email) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    console.log({ userId, name, email }); // <-- Agrega esto para verificar los valores

    fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json' // Enviar como JSON
        },
        body: JSON.stringify({ nombre: name, email: email }) // Convertir a JSON
    })
    .then(response => {
        if (response.ok) {
            alert('Usuario actualizado correctamente.');
            loadUsers(); // Recargar la tabla de usuarios
            hideUpdateForm(); // Ocultar el formulario después de la actualización
        } else {
            alert('Error al actualizar el usuario.');
        }
    })
    .catch(error => console.error('Error al actualizar el usuario:', error));
});
