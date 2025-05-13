const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/user', require('./src/routes/user.route'));
app.use('/recipe', require('./src/routes/recipe.route'));
// app.use('/review', require('./src/routes/review.route'));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// module.exports = app;