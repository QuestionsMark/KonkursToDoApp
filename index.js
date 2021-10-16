const express = require('express');
const app = express();

// Routes
const tasks = require('./routes/tasks');

// Middlewares
app.use(express.json());
app.use(express.static('public'));

app.use('/tasks', tasks);

// Listener
app.listen(3000, () => console.log('Your application is listening...'));