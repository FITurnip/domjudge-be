const express = require('express');
const router = express.Router();
const problemSetController = require('../services/problem_set');

// Route to create a new problem set
router.post('/', problemSetController.createProblemSet);

// Route to get all problem sets
router.get('/', problemSetController.getProblemSets);

// Route to get a problem set by ID
router.get('/:id', problemSetController.getProblemSetById);

// Route to update a problem set
router.put('/:id', problemSetController.updateProblemSet);

// Route to delete a problem set
router.delete('/:id', problemSetController.deleteProblemSet);

module.exports = router;
