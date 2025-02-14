const router = require('express').Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/task');
const { validateCreateTask, validateId } = require('../middleware/validations');

router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);
router.put('/:taskId', validateId, updateTask);
router.delete('/:taskId', validateId, deleteTask);

module.exports = router;