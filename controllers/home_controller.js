//Require the Task Model Data Structure
const Task = require("../models/task");

//Export the Home Controller's home() Function
module.exports.home = async (req, res) => {
  try {
    let count = 0;
    const taskList = await Task.findAll();
    taskList.forEach((task) => {
      if (!task.completed) {
        count++;
      }
    });
    return res.render("all-tasks", {
      title: "Home Page",
      task_list: taskList,
      count: count,
    });
  } catch (err) {
    console.log("Error in fetching the tasks from DB:", err);
    return res.render("all-tasks", {
      title: "Home Page",
      task_list: [],
      count: 0,
    });
  }
};

//Export the Home Controller's incompleteTasks() Function
module.exports.incompleteTasks = async (req, res) => {
  try {
    const taskList = await Task.findAll({
      where: { completed: false },
    });
    return res.render("incomplete-tasks", {
      title: "Incomplete Tasks",
      task_list: taskList,
      count: taskList.length,
    });
  } catch (err) {
    console.log("Error in fetching the tasks from DB:", err);
    return res.render("incomplete-tasks", {
      title: "Incomplete Tasks",
      task_list: [],
      count: 0,
    });
  }
};

//Export the Home Controller's completedTasks() Function
module.exports.completedTasks = async (req, res) => {
  try {
    let count = 0;
    const arr = [];
    const taskList = await Task.findAll();
    taskList.forEach((task) => {
      if (!task.completed) {
        count++;
      } else {
        arr.push(task);
      }
    });
    return res.render("completed-tasks", {
      title: "Completed Tasks",
      task_list: arr,
      count: count,
    });
  } catch (err) {
    console.log("Error in fetching the tasks from DB:", err);
    return res.render("completed-tasks", {
      title: "Completed Tasks",
      task_list: [],
      count: 0,
    });
  }
};
