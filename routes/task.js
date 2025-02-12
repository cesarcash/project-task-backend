const router = require('express').Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/task');

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/', updateTask);
router.delete('/', deleteTask);

module.exports = router;