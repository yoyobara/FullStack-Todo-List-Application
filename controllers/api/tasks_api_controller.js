const Task = require("../../models/task");

// Helper for formatting date in same style as original controller
function formatDate(input) {
  const dateObj = new Date(input);
  let date = dateObj.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  const month = dateObj.toLocaleString("default", { month: "short" });
  const year = dateObj.getFullYear().toString().slice(-2);
  return `${month} ${date}, ${year}`;
}

module.exports.listTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    return res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(task);
  } catch (err) {
    console.error("Error fetching task", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports.createTask = async (req, res) => {
  try {
    if (
      !req.body.task ||
      !req.body.priority ||
      !req.body.category ||
      !req.body.date
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const formattedDate = formatDate(req.body.date);
    const newTask = await Task.create({
      task: req.body.task,
      description: req.body.description,
      priority: req.body.priority,
      category: req.body.category,
      date: formattedDate,
      completed: req.body.completed || false,
    });
    return res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports.updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.date) {
      updates.date = formatDate(updates.date);
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(task);
  } catch (err) {
    console.error("Error updating task", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting task", err);
    return res.status(500).json({ error: "Server error" });
  }
};
