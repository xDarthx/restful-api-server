const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');

const validateProduct = (req, res, next) => {
    const { name, price, category } = req.body;
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push('Product price must be a positive number');
    }

    if (!price || isNaN(price) || price <= 0) {
        errors.push('Product price must be a positive number');
    }

    if(!category || category.trim() === '') {
        errors.push('Product category is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

router.get('/', async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve products'});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await productModel.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
 
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve product' });
    }
});

router.post('/', validateProduct, async (req, res) => {
    try {
        const newProduct = await productModel.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

router.put('/:id', validateProduct, async (req, res) => {
    try {
        const updatedProduct = await productModel.updateProduct(req.params.id, req.body);

        if(!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const success = await productModel.deleteProduct(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

module.exports = router;