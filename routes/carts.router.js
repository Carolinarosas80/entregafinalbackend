// routes/cartsRouter.js
import express from 'express';
import Cart from '../dao/models/cart.model.js';
import Product from '../dao/models/product.model.js';

const router = express.Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.equals(pid));

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Error al agregar el producto al carrito' });
  }
});

export default router;
