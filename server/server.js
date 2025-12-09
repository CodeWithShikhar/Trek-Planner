require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');
const app = express();

const authRoutes = require('./routes/auth');
const trekRoutes = require('./routes/treks');
const uploadRoutes = require('./routes/uploads');


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use('/auth', authRoutes);
app.use('/treks', trekRoutes);
app.use('/uploads', uploadRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
