
// ==========================================
// MYDAY - SQLITE DATABASE
// File: database/db.js
// ==========================================

// NOTE 1: Import thư viện
const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

// NOTE 2: Xác định đường dẫn file Database
// Database sẽ được lưu trong database/myday.sqlite
const DB_PATH = path.join(__dirname, "myday.sqlite");

// NOTE 3: Khai báo biến lưu kết nối Database
let db = null;

// ==========================================
// KHỞI TẠO DATABASE
// ==========================================

async function initDatabase() {
    try {
        // Khởi tạo SQL.js
        const SQL = await initSqlJs();

        // Kiểm tra Database đã tồn tại chưa
        if (fs.existsSync(DB_PATH)) {
            // Nếu có rồi thì đọc dữ liệu cũ
            const fileBuffer = fs.readFileSync(DB_PATH);

            // Mở Database hiện có
            db = new SQL.Database(fileBuffer);

            console.log("Đã kết nối Database MyDay.");

        } else {
            // Nếu chưa có thì tạo Database mới
            db = new SQL.Database();

            console.log("Đã tạo Database MyDay mới.");
        }

        // NOTE 4: Tạo bảng lưu công việc
        db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                date TEXT NOT NULL,
                priority TEXT NOT NULL DEFAULT 'medium',
                start_time TEXT DEFAULT '',
                end_time TEXT DEFAULT '',
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tạo chỉ mục để tìm kiếm và lọc theo ngày nhanh hơn
        db.run(`
            CREATE INDEX IF NOT EXISTS idx_tasks_date
            ON tasks(date)
        `);

        // Lưu Database lần đầu hoặc lưu thay đổi cấu trúc
        saveDatabase();

        return db;

    } catch (error) {
        console.error("Lỗi khởi tạo Database:", error);
        throw error;
    }
}

// ==========================================
// LẤY KẾT NỐI DATABASE
// ==========================================

function getDatabase() {
    // NOTE: Kiểm tra Database đã được khởi tạo chưa
    if (!db) {
        throw new Error("Database chưa được khởi tạo.");
    }

    return db;
}

// ==========================================
// LƯU DATABASE VÀO FILE
// ==========================================

function saveDatabase() {
    if (!db) {
        throw new Error("Không có Database để lưu.");
    }

    // Chuyển dữ liệu SQLite thành Buffer
    const data = db.export();

    // Ghi dữ liệu vào file myday.sqlite
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ==========================================
// XUẤT CÁC HÀM ĐỂ BACKEND SỬ DỤNG
// ==========================================

module.exports = {
    initDatabase,
    getDatabase,
    saveDatabase
};
