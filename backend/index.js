const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const   corsOptions = {
    origin: ["localhost", "vercel.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/user', require('./src/routes/user.route'));
app.use('/recipe', require('./src/routes/recipe.route'));
app.use('/review', require('./src/routes/review.route'));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// module.exports = app;