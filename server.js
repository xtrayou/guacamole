const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route utama untuk halaman login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`SISKEUDES Server Berjalan`);
    console.log(`Buka browser di: http://localhost:${PORT}`);
    console.log(`=============================================`);
});