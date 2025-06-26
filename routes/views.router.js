// routes/viewsRouter.js
import express from 'express';
import CartModel from '../dao/models/cart.model.js';
import ProductModel from '../dao/models/product.model.js';

const router = express.Router();

// Renderiza la vista principal con productos
router.get('/', async (req, res) => {
  try {
  const products = await ProductModel.find();
    res.render('home', { products });
  } catch (error) {
    res.status(500).send('Error al cargar los productos');
  }
});

// Renderiza el carrito por ID
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send('Error al mostrar el carrito');
  }
});

export default router;
