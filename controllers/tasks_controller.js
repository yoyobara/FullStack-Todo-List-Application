//Require the Task Model Data Structure
const Task = require("../models/task");

// Helper function to format date
function formatDate(dateString) {
  let date = new Date(dateString).getDate();
  if (date < 10) {
    date = "0" + date;
  }
  const month = new Date(dateString).toLocaleString("default", {
    month: "short",
  });
  const year = new Date(dateString).getFullYear().toString().slice(-2);
  return `${month} ${date}, ${year}`;
}

//Export the Home Controller's createTask() Function
module.exports.createTask = async (req, res) => {
  try {
    const formattedDate = formatDate(req.body.date);
    await Task.create({
      task: req.body.task,
      description: req.body.description,
      priority: req.body.priority,
      category: req.body.category,
      date: formattedDate,
    });
    return res.redirect("back");
  } catch (err) {
    console.log("Error in Creating a Task:", err);
    return res.redirect("back");
  }
};

//Export the Home Controller's deleteTask() Function
module.exports.deleteTask = async (req, res) => {
  try {
    let id = req.query.id;
    setTimeout(async () => {
      await Task.destroy({
        where: { id: id },
      });
      return res.redirect("back");
    }, 1000);
  } catch (err) {
    console.log("Error in Deleting a Task:", err);
    return res.redirect("back");
  }
};

//Export the Home Controller's completeTask() Function
module.exports.completeTask = async (req, res) => {
  try {
    let id = req.query.id;
    let completed = req.query.completed;

    if (completed == "true") {
      completed = false;
    } else {
      completed = true;
    }

    await Task.update({ completed: completed }, { where: { id: id } });
    return res.redirect("back");
  } catch (err) {
    console.log("Error in Updating the Task:", err);
    return res.redirect("back");
  }
};

//Export the Home Controller's deleteCompletedTasks() Function
module.exports.deleteCompletedTasks = async (req, res) => {
  try {
    setTimeout(async () => {
      await Task.destroy({
        where: { completed: true },
      });
      return res.redirect("back");
    }, 1000);
  } catch (err) {
    console.log("Error in Deleting the Task:", err);
    return res.redirect("back");
  }
};

//Export the Home Controller's completeAllTasks() Function
module.exports.completeAllTasks = async (req, res) => {
  try {
    await Task.update({ completed: true }, { where: { completed: false } });
    return res.redirect("back");
  } catch (err) {
    console.log("Error in Updating the Task:", err);
    return res.redirect("back");
  }
};
