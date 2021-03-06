const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const databaseConnection = require('./config/database');
const errorHandler = require('./middleware/error');

const app = express();

dotenv.config({ path: './config/development.env' });

// database connection
databaseConnection();

// app middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());

if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}

// mount routes
app.use('/api/v1', require('./routes/product'));
app.use('/api/v1', require('./routes/category'));
app.use('/api/v1', require('./routes/owner'));
app.use('/api/v1', require('./routes/address'));
app.use('/api/v1', require('./routes/review'));
app.use('/api/v1', require('./routes/country'));
app.use('/api/v1', require('./routes/payment'));
app.use('/api/v1', require('./routes/auth'));

// error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, console.log(`Server running on port: ${PORT}`));

// handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`);
  // close server and exit process
  server.close(() => process.exit(1));
});

module.exports = server;
