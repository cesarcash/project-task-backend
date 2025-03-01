const router = require('express').Router();
const { addQuote } = require('../controllers/quotes');

router.post('/addQuote', addQuote);

module.exports = router;