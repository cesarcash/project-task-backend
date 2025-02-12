const express = require('express');
const usersRouter = require('./routes/users');
const taskRouter = require('./routes/task');

const {PORT = 3000} = process.env;
const app = express();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/tasks', taskRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})