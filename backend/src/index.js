import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import spinRoutes from './routes/spin.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/spin', spinRoutes);
app.use('/api/admin', adminRoutes);

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('Backend listening on', port));
