// routes/viewsRouter.js
import express from 'express';
import ProductModel from '../dao/models/product.model.js';
import CartMmodel from '../dao/cart.model.js';

const router = express.Router();

// Renderiza la vista principal con productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products });
  } catch (error) {
    res.status(500).send('Error al cargar los productos');
  }
});

// Renderiza el carrito por ID
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send('Error al mostrar el carrito');
  }
});

export default router;
