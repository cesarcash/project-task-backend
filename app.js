const express = require('express');
const mongoose = require('mongoose');
const {errors} = require('celebrate');
const usersRouter = require('./routes/users');
const taskRouter = require('./routes/task');
const quotesRouter = require('./routes/quote');
const cors = require('cors');
const {login, createUser} = require('./controllers/users');
const auth = require('./middleware/auth');
const {validateCreateUser, validateLoginUser} = require('./middleware/validations');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { HttpResponseMessage } = require('./enums/http');

const allowedCors = [
  'https://apptask.twilightparadox.com',
  'http://apptask.twilightparadox.com',
  'http://localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];

const {PORT = 3000} = process.env;
const app = express();

// mongoose.connect('mongodb://localhost:27017/task-manager')
mongoose.connect('mongodb+srv://cesarcash5:cesarcash123@cluster0.tk29m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log('Connected to MongoDB');
}).catch((e) => {
  console.log('Error connecting to MongoDB', e);
});

app.use(express.json());
app.use(cors());
app.options('*',cors());
app.use(requestLogger);

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS.join(','));
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

app.post('/signin', validateLoginUser, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/tasks', taskRouter);
app.use('/quotes', quotesRouter)

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? HttpResponseMessage.SERVER_ERROR : message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})