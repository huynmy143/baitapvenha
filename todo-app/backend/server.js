
/* ==========================================
   MYDAY - BACKEND SERVER
   File: backend/server.js
   ========================================== */

// NOTE 1: Import các thư viện cần thiết
const express = require("express");
const cors = require("cors");
const path = require("path");

// NOTE 2: Import các API quản lý công việc
const taskRoutes = require("./taskRoutes");

// NOTE 3: Import chức năng khởi tạo Database
const { initDatabase } = require("../database/db");

// NOTE 4: Khởi tạo ứng dụng Express
const app = express();

// NOTE 5: Khai báo cổng hoạt động
const PORT = 3000;

// ==========================================
// MIDDLEWARE
// ==========================================

// Cho phép Backend nhận dữ liệu JSON từ Frontend
app.use(express.json());

// Cho phép Frontend gửi yêu cầu đến Backend
app.use(cors());

// Phục vụ các file giao diện từ thư mục frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ==========================================
// API ROUTES
// ==========================================

// API kiểm tra trạng thái Backend
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "MyDay Backend đang hoạt động!"
    });
});

// Kết nối các API quản lý công việc
app.use("/api/tasks", taskRoutes);

// Xử lý đường dẫn API không tồn tại
app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy API yêu cầu."
        });
    }

    next();
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error("Lỗi Server:", err);

    res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi từ máy chủ."
    });
});

// ==========================================
// KHỞI ĐỘNG SERVER
// ==========================================

// NOTE: Chỉ khởi động Server sau khi Database sẵn sàng
async function startServer() {
    try {
        await initDatabase();

        app.listen(PORT, () => {
            console.log("--------------------------------");
            console.log("MYDAY - PERSONAL TASK MANAGER");
            console.log(`Server: http://localhost:${PORT}`);
            console.log("--------------------------------");
        });

    } catch (error) {
        console.error("Không thể khởi động MyDay:", error);
        process.exit(1);
    }
}

startServer();
