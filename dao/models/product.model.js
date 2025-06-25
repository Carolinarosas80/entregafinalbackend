import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

// Plugin de paginación
productSchema.plugin(mongoosePaginate);

// Exportación por default (necesaria para importar como default)
const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;