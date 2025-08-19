const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes/auth')
const cookieParser = require('cookie-parser')
dotenv.config();
const app = express();
const groupRoutes = require('./routes/userFunctionalities/groupRoutes') 
// Middlewares
// By default, browsers do not send cookies (including JWT) between cross-origin requests (e.g., frontend on localhost:5173 and backend on localhost:5000).
app.use(cors(
  {
    origin: 'http://localhost:5173', 
    credentials: true
  }
));
app.use(express.json());
app.use(cookieParser())

//routes
app.use('/', authRoutes)
app.use('/groups', groupRoutes)

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB Connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
