const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, 'public', 'uploads');
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
});

app.post('/upload', upload.array('images'), (req, res) => {
    if (!req.files?.length) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    res.json({
        message: `${req.files.length} file(s) uploaded successfully`,
        files: req.files.map(file => file.filename)
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS clickfit_db`);
        await connection.changeUser({ database: 'clickfit_db', charset: 'utf8mb4' });

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                                                 ID INT AUTO_INCREMENT PRIMARY KEY,
                                                 email VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL UNIQUE,
                password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
                type VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
                active TINYINT DEFAULT 1
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        await connection.query(`DROP PROCEDURE IF EXISTS addUser`);
        await connection.query(`
            CREATE PROCEDURE addUser(
                IN p_email VARCHAR(255),
                IN p_password VARCHAR(255),
                IN p_type VARCHAR(255),
                IN p_active TINYINT
            )
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
                    INSERT INTO users (email, password, type, active)
                    VALUES (p_email, p_password, p_type, p_active);
                END IF;
            END
        `);

        await connection.query(`CALL addUser('test@example.com', 'hashedpassword123', 'member', 1)`);
        await connection.end();

        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Database initialization failed:', err);
    }
}
initializeDatabase();
