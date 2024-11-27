const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middlewares/authJWT");
const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.create({
      userId: req.user.id,
      title,
    });
    res.status(201).json({ message: "Tarefa criada com sucesso.", task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, completed },
      { new: true }
    );

    if (!task)
      return res.status(404).json({ message: "Tarefa não encontrada." });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task)
      return res.status(404).json({ message: "Tarefa não encontrada." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
