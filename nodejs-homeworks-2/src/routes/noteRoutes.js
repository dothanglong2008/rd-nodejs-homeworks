const express = require('express');
const router = new express.Router();

const noteControllers = require('../controllers/noteControllers');
const {checkToken} = require('../controllers/utils');

router.get('/api/notes', checkToken, noteControllers.getNotesByUser);

router.post('/api/notes', checkToken, noteControllers.createNewNote);

router.get('/api/notes/:id', checkToken, noteControllers.getNoteByIdAndUser);

router.put('/api/notes/:id', checkToken, noteControllers.putNotebyIdAndUser);

router
    .patch('/api/notes/:id', checkToken, noteControllers.patchNoteByIdAndUser);

router
    .delete('/api/notes/:id',
        checkToken,
        noteControllers.deleteNoteByIdAndUser);

module.exports = router;
