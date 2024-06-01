const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuarios',
            version: '1.0.0',
            description: 'Documentación de la API de Usuarios'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local'
            }
        ]
    },
    apis: ['./index.js'] // Archivos donde se encuentran los comentarios de Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
