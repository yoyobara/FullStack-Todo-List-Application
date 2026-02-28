const express = require("express");
const router = express.Router();

const api = require("../../controllers/api/tasks_api_controller");

// GET /api/tasks
router.get("/", api.listTasks);
// POST /api/tasks
router.post("/", api.createTask);
// GET /api/tasks/:id
router.get("/:id", api.getTask);
// PUT /api/tasks/:id
router.put("/:id", api.updateTask);
// DELETE /api/tasks/:id
router.delete("/:id", api.deleteTask);

module.exports = router;
