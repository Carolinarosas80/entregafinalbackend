import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductModel from './dao/models/product.model.js';
import { connectMongo } from './config/mongo.js';

dotenv.config();

// Necesario para __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Socket.io
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado vía WebSocket');

  // Crear producto
  socket.on('new-product', async (data) => {
    try {
      const newProduct = await ProductModel.create(data);
      console.log('✅ Producto agregado:', newProduct);
      socket.emit('product-added', newProduct);
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  });

  // Eliminar producto
  socket.on('delete-product', async (productId) => {
    try {
      await ProductModel.findByIdAndDelete(productId);
      console.log('🗑️ Producto eliminado:', productId);
      socket.emit('product-deleted', productId);
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
    }
  });

  // Actualizar producto
  socket.on('update-product', async (data) => {
    try {
      const { id, ...updates } = data;
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, updates, { new: true });
      console.log('🔁 Producto actualizado:', updatedProduct);
      socket.emit('product-updated', updatedProduct);
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
    }
  });
});

// Puerto y conexión
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
  connectMongo();
});

