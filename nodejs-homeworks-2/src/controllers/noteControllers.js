const {v4: uid} = require('uuid');
const Note = require('../models/Note');

exports.getNotesByUser = async (req, res) => {
  try {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 0;
    const {_id} = req.user;
    Note.find({userId: _id}).skip(offset).limit(limit).then(async (data) => {
      res.json({
        offset: offset,
        limit: limit,
        count: data.length,
        notes: data,
      });
    });
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};

exports.createNewNote = async (req, res) => {
  try {
    const {text} = req.body;
    const {_id} = req.user;
    if (!text) {
      return res.status(400).json({message: 'Bad request'});
    }
    const note = new Note({
      _id: uid(),
      userId: _id,
      completed: false,
      text: text,
      createdDate: new Date().toDateString(),
    });

    note.save().then(() => {
      res.status(200).json({message: 'Success'});
    })
        .catch((error) => res.status(500).json({message: error}),
        );
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};

exports.getNoteByIdAndUser = async (req, res) => {
  try {
    const {id} = req.params;
    const {_id} = req.user;
    if (id) {
      Note.findOne({_id: id, userId: _id}).then((data) => {
        if (data !== null) {
          res.status(200).json({note: data});
        } else {
          throw new Error();
        }
      }).catch(() => res.status(400).json({message: 'Bad request'}));
    } else {
      res.status(400).json({message: 'Bad request'});
    }
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};

exports.putNotebyIdAndUser = async (req, res) => {
  try {
    const {id} = req.params;
    const {_id} = req.user;
    if (id) {
      Note.findOne({_id: id, userId: _id}).then((data) => {
        if (data !== null) {
          const {text} = req.body;
          if (!text) {
            res.status(400).json({message: 'Bad request'});
          }
          data.text = text;

          data.save().then(() => {
            res.status(200).json(data);
          }).catch((error) => res.status(500).json({message: error}),
          );
        } else {
          throw new Error();
        }
      }).catch(() => res.status(400).json({message: 'Bad request'}));
    } else {
      res.status(400).json({message: 'Bad request'});
    }
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};

exports.patchNoteByIdAndUser = async (req, res) => {
  try {
    const {id} = req.params;
    const {_id} = req.user;
    if (id) {
      Note.findOne({_id: id, userId: _id}).then((data) => {
        if (data !== null) {
          const {text} = req.body;
          if (!text) {
            return res.status(400).json({message: 'Bad request'});
          }
          data.completed = !data.completed;

          data.save().then(() => {
            res.status(200).json({message: 'Success'});
          });
        }
      });
    } else {
      res.status(400).json({message: 'Bad request'});
    }
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};

exports.deleteNoteByIdAndUser = async (req, res) => {
  try {
    const {id} = req.params;
    const {_id} = req.user;
    if (id) {
      Note.deleteOne({_id: id, userId: _id}).then(() => {
        res.status(200).json({
          message: 'Success',
        });
      }).catch(() => res.status(400).json({message: 'Bad request'}));
    } else {
      res.status(400).json({message: 'Bad request'});
    }
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};
