// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// POST /tasks - Add a new task
router.post('/', async (req, res) => {
    const { title, description } = req.body;
    
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required.' });
    }

    const newTask = new Task({ title, description });
    
    try {
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});

// GET /tasks - Retrieve all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// PUT /tasks/:id/complete - Mark a task as complete
router.put('/:id/complete', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
});

module.exports = router;
