const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = 3001;
const SECRET_KEY = process.env.SECRET_KEY || 'monohall_secret_key_123';

// Middleware
// Increase limit for Base64 image uploads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// Database Setup
const db = new sqlite3.Database('./monohall.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Brands Table
        db.run(`CREATE TABLE IF NOT EXISTS brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            logo_base64 TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Settings Table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`, (err) => {
            if (!err) {
                // Insert defaults if not exist
                db.run("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ['hero_layout', 'TOP-R']);
                db.run("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ['brand_size', '90']);
                db.run("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ['brand_spacing', '24']); // 24px = gap-6
            }
        });

        // Events Table
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            artist TEXT,
            subtitle TEXT,
            date DATETIME,
            price TEXT,
            status TEXT,
            ticket_url TEXT,
            image_base64 TEXT,
            brand_id INTEGER,
            is_featured INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (brand_id) REFERENCES brands(id)
        )`);

        // Event Gallery Table
        db.run(`CREATE TABLE IF NOT EXISTS event_gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            image_base64 TEXT NOT NULL,
            caption TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
        )`);

        // Add brand_id and is_featured columns if they don't exist (for existing databases)
        db.run(`ALTER TABLE events ADD COLUMN brand_id INTEGER`, (err) => {
            // Column may already exist, ignore error
        });
        db.run(`ALTER TABLE events ADD COLUMN is_featured INTEGER DEFAULT 0`, (err) => {
            // Column may already exist, ignore error
        });

        // Check if default admin exists
        db.get("SELECT * FROM users WHERE username = ?", ['reabillaw'], (err, row) => {
            if (err) console.error(err);
            if (!row) {
                const hash = bcrypt.hashSync('Reab@112', 10);
                db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['reabillaw', hash, 'admin'], (err) => {
                    if (err) console.error("Error creating default admin:", err);
                    else console.log("Default admin user created.");
                });
            }
        });
    });
}

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, SECRET_KEY, (err, authData) => {
            if (err) {
                return res.sendStatus(403);
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
};

// --- AUTH ENDPOINTS ---

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                token: token,
                user: { username: user.username, role: user.role }
            });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

// --- USER MANAGEMENT ENDPOINTS (Protected) ---

// Get all users
app.get('/users', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);

    db.all("SELECT id, username, role, created_at FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, users: rows });
    });
});

// Create new user
app.post('/users', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const { username, password } = req.body;

    if (!username) return res.status(400).json({ success: false, message: "Username required" });

    let finalPassword = password;
    if (!finalPassword) {
        finalPassword = crypto.randomBytes(8).toString('hex');
    }

    const hash = bcrypt.hashSync(finalPassword, 10);

    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hash, 'admin'], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ success: false, message: "Username already exists" });
            }
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({
            success: true,
            message: "User created successfully",
            user: {
                id: this.lastID,
                username: username,
                generatedPassword: finalPassword
            }
        });
    });
});

// Update own profile
app.put('/users/me', verifyToken, (req, res) => {
    const userId = req.authData.id;
    const { newUsername, currentPassword, newPassword } = req.body;

    if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password is required to update profile" });
    }

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
        if (err || !user) return res.status(500).json({ success: false, message: "User not found" });

        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(401).json({ success: false, message: "Incorrect current password" });
        }

        let query = "UPDATE users SET username = ?";
        let params = [newUsername || user.username];

        if (newPassword) {
            query += ", password = ?";
            params.push(bcrypt.hashSync(newPassword, 10));
        }

        query += " WHERE id = ?";
        params.push(userId);

        db.run(query, params, function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ success: false, message: "Username already exists" });
                }
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true, message: "Profile updated successfully" });
        });
    });
});

// Delete user
app.delete('/users/:id', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const id = req.params.id;
    if (req.authData.id == id) {
        return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    }
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "User deleted", changes: this.changes });
    });
});

// --- BRANDS MANAGEMENT ENDPOINTS (Protected) ---

// Get all brands
app.get('/brands', (req, res) => {
    // Public endpoint for fetching brands
    db.all("SELECT id, name, logo_base64, created_at FROM brands ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, brands: rows });
    });
});

// Get single brand
app.get('/brands/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM brands WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ success: false, message: "Brand not found" });
        res.json({ success: true, brand: row });
    });
});

// Create new brand
app.post('/brands', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const { name, logo_base64, description } = req.body;

    if (!name || !logo_base64) return res.status(400).json({ success: false, message: "Name and Logo are required" });

    db.run("INSERT INTO brands (name, logo_base64, description) VALUES (?, ?, ?)", [name, logo_base64, description], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({
            success: true,
            message: "Brand created successfully",
            brand: {
                id: this.lastID,
                name,
                description
            }
        });
    });
});

// Delete brand
app.delete('/brands/:id', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const id = req.params.id;

    db.run("DELETE FROM brands WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Brand deleted", changes: this.changes });
    });
});

// --- EVENTS MANAGEMENT ENDPOINTS (Protected) ---

// Get all events
app.get('/events', (req, res) => {
    db.all("SELECT e.*, b.name as brand_name FROM events e LEFT JOIN brands b ON e.brand_id = b.id ORDER BY date ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, events: rows });
    });
});

// Get featured events (max 5)
app.get('/events/featured', (req, res) => {
    db.all("SELECT e.*, b.name as brand_name FROM events e LEFT JOIN brands b ON e.brand_id = b.id WHERE e.is_featured = 1 ORDER BY date ASC LIMIT 5", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, events: rows });
    });
});

// Get events by brand
app.get('/events/brand/:brandId', (req, res) => {
    const brandId = req.params.brandId;
    db.all("SELECT e.*, b.name as brand_name FROM events e LEFT JOIN brands b ON e.brand_id = b.id WHERE e.brand_id = ? ORDER BY date ASC", [brandId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, events: rows });
    });
});

// Get single event
app.get('/events/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT e.*, b.name as brand_name FROM events e LEFT JOIN brands b ON e.brand_id = b.id WHERE e.id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ success: false, message: "Event not found" });
        res.json({ success: true, event: row });
    });
});

// Create new event
app.post('/events', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const { artist, subtitle, date, price, status, ticket_url, image_base64, brand_id, is_featured } = req.body;

    if (!artist || !date) return res.status(400).json({ success: false, message: "Title and Date are required" });

    db.run(`INSERT INTO events (artist, subtitle, date, price, status, ticket_url, image_base64, brand_id, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [artist, subtitle, date, price || '', status, ticket_url, image_base64, brand_id || null, is_featured ? 1 : 0],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({
                success: true,
                message: "Event created successfully",
                event: {
                    id: this.lastID,
                    artist, subtitle, date, price, status, ticket_url, brand_id, is_featured
                }
            });
        });
});

// Update event
app.put('/events/:id', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const id = req.params.id;
    const { artist, subtitle, date, price, status, ticket_url, image_base64, brand_id, is_featured } = req.body;

    if (!artist || !date) return res.status(400).json({ success: false, message: "Title and Date are required" });

    // If image_base64 is provided, update it; otherwise keep the existing one
    if (image_base64) {
        db.run(`UPDATE events SET artist = ?, subtitle = ?, date = ?, price = ?, status = ?, ticket_url = ?, image_base64 = ?, brand_id = ?, is_featured = ? WHERE id = ?`,
            [artist, subtitle, date, price || '', status, ticket_url, image_base64, brand_id || null, is_featured ? 1 : 0, id],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: "Event updated successfully", changes: this.changes });
            });
    } else {
        db.run(`UPDATE events SET artist = ?, subtitle = ?, date = ?, price = ?, status = ?, ticket_url = ?, brand_id = ?, is_featured = ? WHERE id = ?`,
            [artist, subtitle, date, price || '', status, ticket_url, brand_id || null, is_featured ? 1 : 0, id],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: "Event updated successfully", changes: this.changes });
            });
    }
});

// Delete event
app.delete('/events/:id', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const id = req.params.id;

    db.run("DELETE FROM events WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Event deleted", changes: this.changes });
    });
});

// --- EVENT GALLERY ENDPOINTS ---

// Get gallery for an event
app.get('/events/:id/gallery', (req, res) => {
    const eventId = req.params.id;
    db.all("SELECT * FROM event_gallery WHERE event_id = ? ORDER BY created_at DESC", [eventId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, gallery: rows });
    });
});

// Add image to event gallery
app.post('/events/:id/gallery', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const eventId = req.params.id;
    const { image_base64, caption } = req.body;

    if (!image_base64) return res.status(400).json({ success: false, message: "Image is required" });

    db.run("INSERT INTO event_gallery (event_id, image_base64, caption) VALUES (?, ?, ?)",
        [eventId, image_base64, caption || ''],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({
                success: true,
                message: "Image added to gallery",
                image: { id: this.lastID, event_id: eventId, caption }
            });
        });
});

// Delete image from gallery
app.delete('/events/gallery/:imageId', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const imageId = req.params.imageId;

    db.run("DELETE FROM event_gallery WHERE id = ?", [imageId], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Image deleted from gallery", changes: this.changes });
    });
});

// --- SETTINGS ENDPOINTS ---

// Get all settings
app.get('/settings', (req, res) => {
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const settings = {};
        rows.forEach(row => {
            settings[row.key] = row.value;
        });
        res.json({ success: true, settings });
    });
});

// Update settings
app.post('/settings', verifyToken, (req, res) => {
    if (req.authData.role !== 'admin') return res.sendStatus(403);
    const { settings } = req.body; // Expect object like { hero_layout: 'TOP-R', ... }

    if (!settings) return res.status(400).json({ success: false, message: "Settings required" });

    const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        for (const [key, value] of Object.entries(settings)) {
            stmt.run(key, String(value));
        }
        db.run("COMMIT", (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: "Settings updated" });
        });
    });
    stmt.finalize();
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
