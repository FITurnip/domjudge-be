const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const problemSetRoutes = require('./routes/problem_set');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// routes by module
app.use('/auth', authRoutes); 
app.use('/api/problem-sets', problemSetRoutes); 

app.get('/', (req, res) => {
    res.send("Web is running");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
