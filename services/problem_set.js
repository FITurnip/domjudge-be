const db = require('../config/db');
const utils = require('./utils');

// Function to create a new problem set
const createProblemSet = async (req, res) => {
    const { title, isHidden } = req.body;  // Access title and isHidden from req.body

    try {
        // Check if title is a string and isHidden is a boolean
        if (typeof title !== 'string') throw new Error("Title must be a string");
        if (typeof isHidden !== 'boolean') throw new Error("isHidden must be a boolean");

        // Perform the database insertion
        const [result] = await db.promise().query(
            'INSERT INTO problem_sets (title, isHidden) VALUES (?, ?)', 
            [title, isHidden]
        );

        // Respond with success
        res.status(201).json({ message: 'Problem set created successfully', id: result.insertId });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: `Error creating problem set: ${error.message}` });
    }
};

// Function to get all problem sets
const getProblemSets = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM problem_sets');
        const formatedData = rows.map(item => ({
            ...item,
            isHidden: utils.toBoolean(item.isHidden)
        }))
        res.json(formatedData); // Send all problem sets as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problem sets', error: error.message });
    }
};

// Function to get a single problem set by ID
const getProblemSetById = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameters

    try {
        const [rows] = await db.promise().query('SELECT * FROM problem_sets WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Problem set not found' });
        }
        res.json(rows[0]); // Send the single problem set as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problem set', error: error.message });
    }
};

// Function to update a problem set by ID
const updateProblemSet = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameters
    const { title, isHidden } = req.body; // Get the title and isHidden from the request body

    try {
        const [result] = await db.promise().query(
            'UPDATE problem_sets SET title = ?, isHidden = ? WHERE id = ?', 
            [title, isHidden, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Problem set not found' });
        }

        res.json({ message: 'Problem set updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating problem set', error: error.message });
    }
};

// Function to delete a problem set by ID
const deleteProblemSet = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameters

    try {
        const [result] = await db.promise().query('DELETE FROM problem_sets WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Problem set not found' });
        }

        res.json({ message: 'Problem set deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting problem set', error: error.message });
    }
};

module.exports = {
    createProblemSet,
    getProblemSets,
    getProblemSetById,
    updateProblemSet,
    deleteProblemSet
};
