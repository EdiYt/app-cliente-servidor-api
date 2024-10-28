class UsersViewModel {
    constructor() {
        this.users = [];
        this.currentUserId = null;
    }

    // Cargar todos los usuarios
    async loadUsers() {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            if (!response.ok) {
                throw new Error('Error al cargar los usuarios');
            }
            this.users = await response.json();
            this.renderUsers();
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    }

    renderUsers() {
        const userTable = document.querySelector('#userTable tbody');
        userTable.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td><button onclick="usersViewModel.editUser(${user.id})">Actualizar</button></td>
            `;
            userTable.appendChild(row);
        });
    }

    // Registrar un usuario
    async registerUser(event) {
        event.preventDefault();
        const nombre = document.getElementById('register-name').value; 
        const email = document.getElementById('register-email').value; 
        const password = document.getElementById('register-password').value; 

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });

            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }

            window.location.href = 'users.html'; 
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
        }
    }

    // Editar usuario
    async editUser(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`);
            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const user = await response.json();
            document.getElementById('userId').value = user.id;
            document.getElementById('name').value = user.nombre;
            document.getElementById('email').value = user.email;

            document.getElementById('updateSection').style.display = 'block';
            this.currentUserId = user.id;
        } catch (error) {
            console.error('Error al cargar el usuario:', error);
        }
    }

    // Actualizar un usuario
    async updateUser(event) {
        event.preventDefault();

        const userId = this.currentUserId;
        const nombre = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }

            this.loadUsers();
            document.getElementById('updateUserForm').reset();
            document.getElementById('updateSection').style.display = 'none'; 
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    }
}

const usersViewModel = new UsersViewModel();

document.addEventListener('DOMContentLoaded', () => {
    usersViewModel.loadUsers();

    const updateForm = document.getElementById('updateUserForm');
    if (updateForm) {
        updateForm.addEventListener('submit', (event) => usersViewModel.updateUser(event));
    } else {
        console.error('El formulario de actualización no se encontró');
    }
});
