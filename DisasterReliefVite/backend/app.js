import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'your-mongodb-atlas-uri-here';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  res.send('Disaster Relief Backend API');
});


import userRoutes from './routes/users.js';
import resourceRoutes from './routes/resources.js';
import requestRoutes from './routes/requests.js';
import volunteerRoutes from './routes/volunteers.js';

app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/volunteers', volunteerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
