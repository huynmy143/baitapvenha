
// ==========================================
// MYDAY - TASK ROUTES
// File: backend/taskRoutes.js
// ==========================================

// NOTE 1: Import Express
const express = require("express");

// NOTE 2: Khởi tạo Router
const router = express.Router();

// NOTE 3: Import các hàm xử lý công việc
const taskController = require("./taskController");

// ==========================================
// CÁC API QUẢN LÝ CÔNG VIỆC
// ==========================================

// GET: Lấy toàn bộ danh sách công việc
router.get("/", taskController.getAllTasks);

// GET: Lấy thông tin một công việc theo ID
router.get("/:id", taskController.getTaskById);

// POST: Thêm công việc mới
router.post("/", taskController.createTask);

// PUT: Cập nhật thông tin công việc
router.put("/:id", taskController.updateTask);

// PATCH: Cập nhật trạng thái hoàn thành
router.patch("/:id/status", taskController.updateTaskStatus);

// DELETE: Xóa công việc
router.delete("/:id", taskController.deleteTask);

// NOTE 4: Xuất Router
module.exports = router;
