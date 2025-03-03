const router = require('express').Router();
const { getTasks, createTask, updateTaskStatus, deleteTask } = require('../controllers/task');
const { validateCreateTask, validateId } = require('../middleware/validations');

router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);
router.patch('/:taskId', validateId, updateTaskStatus);
router.delete('/:taskId', validateId, deleteTask);

module.exports = router;