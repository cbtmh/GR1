const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');
const commentRoutes = require('./routes/commentRoutes');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

// Import middlewares
const morganMiddleware = require('./middlewares/morgan');
const corsMiddleware = require('./middlewares/cors');

// Middleware
app.use(bodyParser.json()); // Use bodyParser from the 'body-parser' package
app.use(cors());
app.use(morganMiddleware);

// MongoDB Connection
dotenv.config();

main().catch(err => console.log(err));

async function main() {
  mongoose.connect(process.env.MONGODB_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
mongoose.connection.on('connected', () => console.log('connected'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});
// Phục vụ file tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;