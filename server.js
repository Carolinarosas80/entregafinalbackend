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

// Para obtener __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Socket.io - WebSocket
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado vía WebSocket');

  // Crear producto
  socket.on('new-product', async (data) => {
    try {
      const newProduct = await ProductModel.create(data);
      console.log('✅ Producto agregado:', newProduct);
      io.emit('product-added', newProduct); // Se emite a todos los clientes conectados
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  });

  // Eliminar producto
  socket.on('delete-product', async (productId) => {
    try {
      await ProductModel.findByIdAndDelete(productId);
      console.log('🗑️ Producto eliminado:', productId);
      io.emit('product-deleted', productId); // Se emite a todos
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
      io.emit('product-updated', updatedProduct); // Se emite a todos
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
    }
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Función para iniciar servidor luego de conectar a MongoDB
const startServer = async () => {
  try {
    await connectMongo();
    console.log('🗄️ Conectado a MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

startServer();
