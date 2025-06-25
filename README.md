# Entrega Final Backend

Este proyecto implementa un sistema de productos y carritos con Node.js, Express y MongoDB.

## Tecnologías
- Node.js
- Express
- MongoDB + Mongoose
- Handlebars

## Rutas principales

### Productos
- `GET /api/products` (paginado, filtro, sort)
- `GET /api/products/:pid`

### Carritos
- `GET /api/carts/:cid`
- `PUT /api/carts/:cid`
- `PUT /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid`
- `DELETE /api/carts/:cid/products/:pid`

## Cómo correr
```
npm install
npm start
```

## Autor
Carolina Rosas