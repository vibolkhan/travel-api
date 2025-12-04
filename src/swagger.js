// src/swagger.js
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel API',
      version: '1.0.0',
      description: 'REST API for travel app'
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:4000/api/v1'
      }
    ]
  },
  // 👇 IMPORTANT: point to src/routes/*.js
  apis: [path.join(__dirname, 'routes', '*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
