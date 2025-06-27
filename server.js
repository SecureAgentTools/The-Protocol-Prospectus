const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Handle API endpoint (optional - for form submissions)
app.post('/api/apply', express.json(), (req, res) => {
    console.log('Application received:', req.body);
    // In a real app, you'd save this to a database or send an email
    res.json({ success: true, message: 'Application received successfully!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/technical-page.html to see the technical page`);
});
