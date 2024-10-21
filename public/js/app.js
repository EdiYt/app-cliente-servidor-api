const API_URL = 'http://localhost:3000/api'; 

// Función para manejar el inicio de sesión
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar el envío del formulario
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Enviamos el contenido como JSON
            },
            body: JSON.stringify({ email, password }) // Convertimos a JSON
        });

        const data = await response.json(); // Parsear la respuesta JSON

        if (response.ok) {
            alert('Inicio de sesión exitoso');
            // Redirigir a users.html
            window.location.href = 'users.html';
        } else {
            alert(data.message); // Mensaje de error
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.'); // Mensaje de error general
    }
});

// Función para manejar el registro de usuarios
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar el envío del formulario
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Enviamos el contenido como JSON
            },
            body: JSON.stringify({ nombre: name, email, password }) // Convertimos a JSON
        });

        const data = await response.json(); // Parsear la respuesta JSON

        if (response.ok) {
            alert('Registro exitoso');
            // Opcional: Redirigir o limpiar el formulario
            // window.location.href = 'login.html'; // Redireccionar a la página de inicio de sesión
        } else {
            alert(data.message); // Mensaje de error
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al intentar registrar. Por favor, inténtalo de nuevo.'); // Mensaje de error general
    }
});
