// In-memory array to store tasks
let tasks = [];
let nextId = 1;

// Task model with in-memory storage
const Task = {
  // Create a new task
  create: function (data, callback) {
    const newTask = {
      _id: nextId.toString(),
      id: nextId.toString(),
      task: data.task,
      description: data.description || "",
      priority: data.priority,
      category: data.category,
      date: data.date,
      completed: data.completed || false,
    };
    nextId++;
    tasks.push(newTask);
    if (callback) callback(null, newTask);
    return newTask;
  },

  // Find tasks with optional filter and callback support
  find: function (filter, callback) {
    let filtered = tasks;

    // Apply filter if provided
    if (filter && Object.keys(filter).length > 0) {
      filtered = tasks.filter((task) => {
        for (let key in filter) {
          if (task[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });
    }

    // Support callback style
    if (callback) {
      callback(null, filtered);
    }

    // Return as promise for async/await style
    return Promise.resolve(filtered);
  },

  // Find task by ID
  findById: function (id) {
    return Promise.resolve(tasks.find((t) => t._id === id || t.id === id));
  },

  // Find by ID and delete
  findByIdAndDelete: function (id, callback) {
    const index = tasks.findIndex((t) => t._id === id || t.id === id);
    if (index !== -1) {
      const deletedTask = tasks.splice(index, 1)[0];
      if (callback) callback(null, deletedTask);
      return Promise.resolve(deletedTask);
    }
    if (callback) callback(null, null);
    return Promise.resolve(null);
  },

  // Find by ID and update
  findByIdAndUpdate: function (id, data, callback) {
    const task = tasks.find((t) => t._id === id || t.id === id);
    if (task) {
      Object.assign(task, data);
      if (callback) callback(null, task);
      return Promise.resolve(task);
    }
    if (callback) callback(null, null);
    return Promise.resolve(null);
  },

  // Delete many tasks
  deleteMany: function (filter, callback) {
    let deleted = 0;
    if (filter.completed === true) {
      deleted = tasks.filter((t) => !t.completed).length;
      tasks = tasks.filter((t) => !t.completed);
    }
    if (callback) callback(null);
    return Promise.resolve({ deletedCount: deleted });
  },

  // Update many tasks
  updateMany: function (filter, update, callback) {
    let count = 0;
    tasks.forEach((task) => {
      let matches = true;
      for (let key in filter) {
        if (task[key] !== filter[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        Object.assign(task, update);
        count++;
      }
    });
    if (callback) callback(null);
    return Promise.resolve({ modifiedCount: count });
  },
};

// Export the Task object
module.exports = Task;
