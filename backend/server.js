import express from 'express';
import cors from 'cors';
// import 'dotenv/config';
import connectDB from './src/config/mongodb.js';
import connectCloudinary from './src/config/cloudinary.js';
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoute.js';
import orderRoutes from './src/routes/OrderRoute.js';
import cartRoutes from './src/routes/CartRoute.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET', 'PUT'],
}));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));

