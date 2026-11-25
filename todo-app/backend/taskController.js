
// ==========================================
// MYDAY - TASK CONTROLLER
// File: backend/taskController.js
// ==========================================

// NOTE 1: Kết nối với Database
const { getDatabase, saveDatabase } = require("../database/db");

// ==========================================
// HÀM HỖ TRỢ
// ==========================================

// NOTE: Kiểm tra ID hợp lệ
function isValidId(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

// NOTE: Lấy dữ liệu từ kết quả truy vấn SQLite
function getRows(result) {
    if (!result || result.length === 0) {
        return [];
    }

    const columns = result[0].columns;
    const values = result[0].values;

    return values.map(row => {
        const task = {};

        columns.forEach((column, index) => {
            task[column] = row[index];
        });

        // Đổi tên các cột cho phù hợp với Frontend
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            date: task.date,
            priority: task.priority,
            startTime: task.start_time,
            endTime: task.end_time,
            status: task.status
        };
    });
}

// NOTE: Kiểm tra dữ liệu công việc
function validateTask(data) {
    const { title, date, priority, status } = data;

    if (!title || !String(title).trim()) {
        return "Tên công việc không được để trống.";
    }

    if (!date) {
        return "Vui lòng chọn ngày thực hiện.";
    }

    if (!["low", "medium", "high"].includes(priority)) {
        return "Mức độ ưu tiên không hợp lệ.";
    }

    if (
        status !== undefined &&
        !["pending", "completed"].includes(status)
    ) {
        return "Trạng thái công việc không hợp lệ.";
    }

    return null;
}

// ==========================================
// 1. LẤY DANH SÁCH CÔNG VIỆC
// ==========================================

function getAllTasks(req, res) {
    try {
        const db = getDatabase();

        // Lấy toàn bộ công việc, công việc mới nhất hiển thị trước
        const result = db.exec(
            "SELECT * FROM tasks ORDER BY id DESC"
        );

        const tasks = getRows(result);

        res.status(200).json({
            success: true,
            data: tasks
        });

    } catch (error) {
        console.error("Lỗi lấy danh sách:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách công việc."
        });
    }
}

// ==========================================
// 2. LẤY CHI TIẾT CÔNG VIỆC
// ==========================================

function getTaskById(req, res) {
    try {
        const db = getDatabase();
        const id = Number(req.params.id);

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID công việc không hợp lệ."
            });
        }

        const result = db.exec(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
        );

        const tasks = getRows(result);

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy công việc."
            });
        }

        res.status(200).json({
            success: true,
            data: tasks[0]
        });

    } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy thông tin công việc."
        });
    }
}

// ==========================================
// 3. THÊM CÔNG VIỆC
// ==========================================

function createTask(req, res) {
    try {
        const db = getDatabase();

        const data = req.body;
        const validationError = validateTask(data);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const {
            title,
            description,
            date,
            priority,
            startTime,
            endTime,
            status
        } = data;

        db.run(
            `INSERT INTO tasks (
                title,
                description,
                date,
                priority,
                start_time,
                end_time,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                String(title).trim(),
                description || "",
                date,
                priority,
                startTime || "",
                endTime || "",
                status || "pending"
            ]
        );

        // Lưu thay đổi vào file SQLite
        saveDatabase();

        // Lấy ID của công việc vừa tạo
        const result = db.exec(
            "SELECT last_insert_rowid() AS id"
        );

        const newId = result[0].values[0][0];

        res.status(201).json({
            success: true,
            message: "Thêm công việc thành công!",
            id: newId
        });

    } catch (error) {
        console.error("Lỗi thêm công việc:", error);

        res.status(500).json({
            success: false,
            message: "Không thể thêm công việc."
        });
    }
}

// ==========================================
// 4. CẬP NHẬT CÔNG VIỆC
// ==========================================

function updateTask(req, res) {
    try {
        const db = getDatabase();
        const id = Number(req.params.id);

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID công việc không hợp lệ."
            });
        }

        const data = req.body;
        const validationError = validateTask(data);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const {
            title,
            description,
            date,
            priority,
            startTime,
            endTime,
            status
        } = data;

        db.run(
            `UPDATE tasks SET
                title = ?,
                description = ?,
                date = ?,
                priority = ?,
                start_time = ?,
                end_time = ?,
                status = ?
            WHERE id = ?`,
            [
                String(title).trim(),
                description || "",
                date,
                priority,
                startTime || "",
                endTime || "",
                status || "pending",
                id
            ]
        );

        if (db.getRowsModified() === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy công việc cần cập nhật."
            });
        }

        saveDatabase();

        res.status(200).json({
            success: true,
            message: "Cập nhật công việc thành công!"
        });

    } catch (error) {
        console.error("Lỗi cập nhật:", error);

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật công việc."
        });
    }
}

// ==========================================
// 5. CẬP NHẬT TRẠNG THÁI CÔNG VIỆC
// ==========================================

function updateTaskStatus(req, res) {
    try {
        const db = getDatabase();
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID công việc không hợp lệ."
            });
        }

        if (!["pending", "completed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái không hợp lệ."
            });
        }

        db.run(
            "UPDATE tasks SET status = ? WHERE id = ?",
            [status, id]
        );

        if (db.getRowsModified() === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy công việc."
            });
        }

        saveDatabase();

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái thành công!"
        });

    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật trạng thái."
        });
    }
}

// ==========================================
// 6. XÓA CÔNG VIỆC
// ==========================================

function deleteTask(req, res) {
    try {
        const db = getDatabase();
        const id = Number(req.params.id);

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID công việc không hợp lệ."
            });
        }

        db.run(
            "DELETE FROM tasks WHERE id = ?",
            [id]
        );

        if (db.getRowsModified() === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy công việc cần xóa."
            });
        }

        saveDatabase();

        res.status(200).json({
            success: true,
            message: "Xóa công việc thành công!"
        });

    } catch (error) {
        console.error("Lỗi xóa công việc:", error);

        res.status(500).json({
            success: false,
            message: "Không thể xóa công việc."
        });
    }
}

// ==========================================
// XUẤT CÁC HÀM ĐỂ TASK ROUTES SỬ DỤNG
// ==========================================

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
};
