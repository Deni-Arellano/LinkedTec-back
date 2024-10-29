const ws = new WebSocket('ws://localhost:8080');

// Función para convertir un Blob a base64
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]; // Obtener solo la parte base64
            resolve(base64);
        };
        reader.readAsDataURL(blob); // Leer el blob como Data URL
    });
}

// Enviar un blob
async function sendBlob(blob) {
    const base64Data = await blobToBase64(blob);
    const message = {
        type: 'blob', // Tipo de mensaje
        data: base64Data
    };
    ws.send(JSON.stringify(message)); // Enviar como JSON
}

// Ejemplo de creación y envío de un Blob
const data = new Blob(["Hola, este es un mensaje desde el blob!"], { type: 'text/plain' });
sendBlob(data);

ws.onmessage = (event) => {
    const response = JSON.parse(event.data); // Analizar la respuesta JSON
    console.log(`Mensaje recibido del servidor: ${response.data}`);
};

ws.onopen = () => {
    console.log('Conexión WebSocket establecida.');
};

ws.onclose = () => {
    console.log('Conexión WebSocket cerrada.');
};

ws.onerror = (error) => {
    console.error('Error en WebSocket:', error);
};
