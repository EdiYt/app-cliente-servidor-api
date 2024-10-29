class LibrosExternosAppService {
    constructor() {
    }

    fetchLibrosExternos() {
        const apiUrl = 'http://192.168.137.1:8081/api/libros/obtenerLibros'; 

        return fetch(apiUrl, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos de la API externa');
            }
            return response.json(); 
        }).catch(error => {
            console.error('Error en la petición a la API externa:', error);
            throw error; 
        });
    }
}

module.exports = LibrosExternosAppService;