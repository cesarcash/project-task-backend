const moment = require('moment');
const Task = require('../models/task');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
const AuthError = require('../middleware/errors/AuthError');
const NotFoundError = require('../middleware/errors/NotFoundError');
const BadRequestError = require('../middleware/errors/BadRequestError');

const getTasks = async (req, res, next) => {

    if(!req.user){
      return next(new AuthError(HttpResponseMessage.UNAUTHORIZED));
    }

    try{
      const tasks = await Task.find({ owner: req.user._id }).populate('owner');
      const formatedTask = tasks.map(task => {
        return {
          ...task._doc,
          createdAt: moment(task.createdAt).format('YYYY-MM-DD'),
          endDate: moment(task.endDate).format('YYYY-MM-DD')
        }
      });
      res.status(HttpStatus.OK).json({data: formatedTask});
    }catch(e){
      next(e);
    }

}

const createTask = async (req, res, next) => {

    const owner = req.user._id;
    const {title, description, endDate} = req.body;

    if(!title || !description || !endDate){
      return next(new BadRequestError(HttpResponseMessage.BAD_REQUEST));
    }

    try{
      const task = await Task.create({title, description, endDate, owner});
      const newTask = await Task.findById(task._id).populate('owner');

      res.status(HttpStatus.CREATED).json({data: newTask});
    }catch(e){
      next(e);
    }


}

const updateTask = async (req, res, next) => {

  const taskId = req.params.taskId;
  const {status} = req.body;

  if(!status){
    return next(new BadRequestError(HttpResponseMessage.BAD_REQUEST));
  }

  try{

    const updatedTask = await Task.findByIdAndUpdate(taskId, {status}, {new: true}).populate('owner');
    if(!updatedTask) return next(new NotFoundError(HttpResponseMessage.NOT_FOUND));

    res.status(HttpStatus.OK).json({data: updatedTask});

  }catch(e){
    next(e);
  }

}

const deleteTask = async (req, res, next) => {


  try{
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);
    if(!task) return next(new NotFoundError(HttpResponseMessage.NOT_FOUND));

    res.status(HttpStatus.OK).send({message: "Tarea eliminada correctamente"});

  }catch(e){
    next(e);
  }

}

module.exports = { getTasks, createTask, updateTask, deleteTask };