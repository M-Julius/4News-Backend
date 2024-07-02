const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database'); // Pastikan path sesuai dengan struktur direktori Anda
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware untuk handling file upload
const upload = require('./middleware/upload'); // Sesuaikan path sesuai struktur direktori Anda
const authenticateJWT = require('./middleware/authenticateJWT');
app.use('/uploads', express.static('uploads')); // Serve static files (uploads)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/news', authenticateJWT, newsRoutes);
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/category', authenticateJWT, categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Inisialisasi koneksi ke database Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');
    // Sync models with database (jika diperlukan)
    // sequelize.sync();
  })
  .catch((err) => console.error('Database connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
