const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const jsonFilePath = path.join(__dirname, 'input.json');

// Middleware to parse JSON requests
app.use(express.json());

// Serve the static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the required JavaScript files from the 'js' directory
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve the 'para-urban-model.json' file from the 'assets' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API endpoint to get the initial JSON values
app.get('/initialValues', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// API endpoint to update the JSON values
app.post('/updateValues', (req, res) => {
    const { EnableAnalysis, Population, Seed } = req.body;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        try {
            const jsonData = JSON.parse(data);
            jsonData.EnableAnalysis = EnableAnalysis;
            jsonData.Population = Population;
            jsonData.Seed = Seed;

            fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to the file:', err);
                    return res.status(500).json({ error: 'Server error' });
                }

                res.json({ success: true });
            });
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Serve the index.html file for all other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
