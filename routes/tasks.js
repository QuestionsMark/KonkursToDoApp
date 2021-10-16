const express = require('express');
const { readFile, writeFile } = require('fs').promises;

const router = express.Router();

router.get('/', async (req, res) => {
    const toDoList = JSON.parse(await readFile('./data/todo.json', 'utf-8'));
    const doneList = JSON.parse(await readFile('./data/done.json', 'utf-8'));
    res.json({ toDoList, doneList });
});

router.post('/add', async (req, res) => {
    const { task } = req.body;
    try {
        const prevList = JSON.parse(await readFile('./data/todo.json', 'utf-8'));
        prevList.push({ task });
        await writeFile('./data/todo.json', JSON.stringify(prevList));
        res.status(201).json({ message: 'Dodano nowe zadanie' });
    } catch (e) {
        res.status(500).json({ message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
    }
});

router.delete('/remove/:index', async (req, res) => {
    const { index } = req.params;
    try {
        const prevList = JSON.parse(await readFile('./data/todo.json', 'utf-8'));
        prevList.splice(index, 1);
        await writeFile('./data/todo.json', JSON.stringify(prevList));
        res.status(200).json({ message: 'Zadanie zostało usunięte' });
    } catch (e) {
        res.status(500).json({ message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
    }
});

router.delete('/remove-finished/:index', async (req, res) => {
    const { index } = req.params;
    try {
        const prevList = JSON.parse(await readFile('./data/done.json', 'utf-8'));
        prevList.splice(index, 1);
        await writeFile('./data/done.json', JSON.stringify(prevList));
        res.status(200).json({ message: 'Zadanie zostało usunięte' });
    } catch (e) {
        res.status(500).json({ message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
    }
});

router.put('/finish/:index', async (req, res) => {
    const { index } = req.params;
    try {
        const listToDo = JSON.parse(await readFile('./data/todo.json', 'utf-8'));
        const finishedTask = listToDo.splice(index, 1);
        await writeFile('./data/todo.json', JSON.stringify(listToDo));
        const listDone = JSON.parse(await readFile('./data/done.json', 'utf-8'));
        listDone.push(...finishedTask);
        await writeFile('./data/done.json', JSON.stringify(listDone));
        res.status(200).json({ message: 'Zadanie zostało dodane do ukończonych.' });
    } catch (e) {
        res.status(500).json({ message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
    }
});

module.exports = router;