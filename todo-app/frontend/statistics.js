
// ==========================================
// MYDAY - STATISTICS
// File: frontend/statistics.js
// ==========================================

// NOTE 1: Địa chỉ API lấy danh sách công việc
const API_URL = "/api/tasks";

// NOTE 2: Hàm lấy phần tử HTML theo ID
function getElement(id) {
    return document.getElementById(id);
}

// ==========================================
// HÀM CẬP NHẬT THANH TIẾN ĐỘ
// ==========================================

function updateProgressBar(barId, percent) {
    const bar = getElement(barId);

    // Giới hạn độ rộng thanh tiến độ trong khoảng 0-100%
    const safePercent = Math.max(0, Math.min(100, percent));

    bar.style.width = `${safePercent}%`;
}

// ==========================================
// HÀM TÍNH TOÁN THỐNG KÊ
// ==========================================

function calculateStatistics(tasks) {

    // Tổng số công việc
    const total = tasks.length;

    // Số công việc đã hoàn thành
    const completed = tasks.filter(
        task => task.status === "completed"
    ).length;

    // Số công việc chưa hoàn thành
    const pending = tasks.filter(
        task => task.status !== "completed"
    ).length;

    // Tính tỷ lệ hoàn thành
    const completionRate = total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    // Phân loại mức độ ưu tiên
    const high = tasks.filter(
        task => task.priority === "high"
    ).length;

    const medium = tasks.filter(
        task => task.priority === "medium"
    ).length;

    const low = tasks.filter(
        task => task.priority === "low"
    ).length;

    return {
        total,
        completed,
        pending,
        completionRate,
        high,
        medium,
        low
    };
}

// ==========================================
// HIỂN THỊ THỐNG KÊ LÊN GIAO DIỆN
// ==========================================

function renderStatistics(stats) {

    // NOTE: Hiển thị số liệu tổng quan
    getElement("stat-total").textContent = stats.total;
    getElement("stat-completed").textContent = stats.completed;
    getElement("stat-pending").textContent = stats.pending;
    getElement("stat-rate").textContent =
        `${stats.completionRate}%`;

    // NOTE: Tính tỷ lệ hoàn thành và chưa hoàn thành
    const completedPercent = stats.completionRate;

    const pendingPercent = stats.total > 0
        ? Math.round((stats.pending / stats.total) * 100)
        : 0;

    getElement("completed-percent").textContent =
        `${completedPercent}%`;

    getElement("pending-percent").textContent =
        `${pendingPercent}%`;

    // Cập nhật thanh tiến độ
    updateProgressBar("completed-bar", completedPercent);
    updateProgressBar("pending-bar", pendingPercent);

    // NOTE: Hiển thị số lượng công việc theo ưu tiên
    getElement("high-count").textContent = stats.high;
    getElement("medium-count").textContent = stats.medium;
    getElement("low-count").textContent = stats.low;

    // Tính tỷ lệ từng mức ưu tiên trên tổng công việc
    const highPercent = stats.total > 0
        ? (stats.high / stats.total) * 100
        : 0;

    const mediumPercent = stats.total > 0
        ? (stats.medium / stats.total) * 100
        : 0;

    const lowPercent = stats.total > 0
        ? (stats.low / stats.total) * 100
        : 0;

    // Cập nhật thanh tiến độ ưu tiên
    updateProgressBar("high-bar", highPercent);
    updateProgressBar("medium-bar", mediumPercent);
    updateProgressBar("low-bar", lowPercent);

    // NOTE: Thông báo tiến độ
    const note = getElement("progress-note");

    if (stats.total === 0) {
        note.textContent =
            "Bạn chưa có công việc nào. Hãy thêm công việc để theo dõi tiến độ nhé!";
    } else if (stats.completionRate === 100) {
        note.textContent =
            "Tuyệt vời! Bạn đã hoàn thành tất cả công việc.";
    } else if (stats.completionRate >= 70) {
        note.textContent =
            "Bạn đang có tiến độ rất tốt. Hãy tiếp tục duy trì nhé!";
    } else {
        note.textContent =
            "Hãy cố gắng hoàn thành những công việc còn lại nhé!";
    }
}

// ==========================================
// TẢI DỮ LIỆU TỪ BACKEND
// ==========================================

async function loadStatistics() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Không thể tải dữ liệu thống kê."
            );
        }

        // Lấy danh sách công việc thực tế từ Database
        const tasks = result.data || [];

        // Tính toán các chỉ số
        const stats = calculateStatistics(tasks);

        // Hiển thị lên trang
        renderStatistics(stats);

    } catch (error) {
        console.error("Lỗi thống kê:", error);

        const errorMessage = getElement("stats-error");

        errorMessage.textContent =
            "Không thể tải thống kê. Vui lòng kiểm tra kết nối Backend.";

        errorMessage.hidden = false;
    }
}

// ==========================================
// KHỞI TẠO TRANG THỐNG KÊ
// ==========================================

loadStatistics();
