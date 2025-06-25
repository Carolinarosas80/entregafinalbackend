import ProductManager from '../dao/mongo/managers/ProductManager.js';

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const products = await productManager.getAll({ limit, page, sort, query });
    res.json({ status: 'success', payload: products });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productManager.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await productManager.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await productManager.update(req.params.pid, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productManager.delete(req.params.pid);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};
