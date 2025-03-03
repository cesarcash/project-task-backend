const router = require('express').Router();
const { addQuote, getQuotes } = require('../controllers/quotes');

router.post('/addQuote', addQuote);
router.get('/:limit', getQuotes);

module.exports = router;