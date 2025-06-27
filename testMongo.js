import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conexión exitosa a MongoDB');
  mongoose.disconnect();
})
.catch(err => {
  console.error('❌ Falló la conexión:', err);
});
