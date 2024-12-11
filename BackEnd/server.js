const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer'); // Thêm multer để xử lý upload file
const path = require('path'); // Để xử lý đường dẫn file

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Để truy cập các file đã upload

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
});

// Kiểm tra kết nối database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Lỗi kết nối đến database:', err.message);
        return;
    }
    console.log('Kết nối đến database thành công!');
    connection.release();
});

// Cấu hình multer để lưu file hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu trữ file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file duy nhất
    },
});

const upload = multer({ storage: storage });

// Lấy danh sách khách hàng (user_role = 0)
app.get('/api/customers', (req, res) => {
    const query = `
    SELECT user_email AS id, user_name AS name, user_email AS email, user_phone AS phone, user_images AS image, user_status AS status
    FROM user
    WHERE user_role = 0
  `;
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn database:', err.message);
            res.status(500).json({ error: 'Database error', errorMessage: err.message });
            return;
        }
        res.json(results);
    });
});

// Thêm khách hàng mới với hình ảnh
app.post('/api/customers', upload.single('image'), (req, res) => {
    const { name, email, phone } = req.body;
    const image = req.file ? req.file.filename : null; // Lấy tên file hình ảnh
    const query = `
        INSERT INTO user (user_name, user_email, user_phone, user_role, user_status, user_images)
        VALUES (?, ?, ?, 0, 1, ?)
    `;
    pool.query(query, [name, email, phone, image], (err, results) => {
        if (err) {
            console.error('Lỗi thêm khách hàng:', err.message);
            res.status(500).json({ error: 'Database error', errorMessage: err.message });
            return;
        }
        res.status(201).json({ message: 'Khách hàng đã được thêm thành công!' });
    });
});

// Cập nhật thông tin khách hàng (bao gồm hình ảnh)
app.put('/api/customers/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const image = req.file ? req.file.filename : null; // Lấy tên file hình ảnh
    const query = `
    UPDATE user
    SET user_name = ?, user_email = ?, user_phone = ?, user_images = ?
    WHERE user_email = ? AND user_role = 0
  `;
    pool.query(query, [name, email, phone, image, id], (err, results) => {
        if (err) {
            console.error('Lỗi cập nhật khách hàng:', err.message);
            res.status(500).json({ error: 'Database error', errorMessage: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Khách hàng không tồn tại' });
            return;
        }
        res.json({ message: 'Khách hàng đã được cập nhật thành công!' });
    });
});

// Cập nhật trạng thái khách hàng (active/unactive)
app.put('/api/customers/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = `
    UPDATE user
    SET user_status = ?
    WHERE user_email = ? AND user_role = 0
  `;
    pool.query(query, [status, id], (err, results) => {
        if (err) {
            console.error('Lỗi cập nhật trạng thái khách hàng:', err.message);
            res.status(500).json({ error: 'Database error', errorMessage: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Khách hàng không tồn tại' });
            return;
        }
        res.json({ message: 'Trạng thái khách hàng đã được cập nhật thành công!' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});