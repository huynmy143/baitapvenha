
// ==========================================
// MYDAY - ALL TASKS
// File: frontend/all-tasks.js
// ==========================================

// NOTE 1: Khai báo địa chỉ API
const API_URL = "/api/tasks";

// NOTE 2: Lấy các phần tử HTML
const taskList = document.getElementById("all-task-list");
const taskSearch = document.getElementById("task-search");
const statusFilter = document.getElementById("task-status-filter");
const priorityFilter = document.getElementById("task-priority-filter");
const taskCount = document.getElementById("task-count");
const pageMessage = document.getElementById("page-message");

// NOTE 3: Biến lưu danh sách công việc từ Database
let tasks = [];

// ==========================================
// HÀM HIỂN THỊ THÔNG BÁO
// ==========================================

function showMessage(message) {
    pageMessage.textContent = message;
    pageMessage.hidden = false;
}

// ==========================================
// HÀM TẢI DỮ LIỆU TỪ BACKEND
// ==========================================

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Không thể tải công việc.");
        }

        // Lấy danh sách công việc từ API
        tasks = result.data || [];

        renderTasks();

    } catch (error) {
        console.error("Lỗi tải công việc:", error);
        showMessage("Không thể kết nối máy chủ. Vui lòng kiểm tra Backend.");
        taskCount.textContent = "Không tải được dữ liệu.";
    }
}

// ==========================================
// HÀM CHUYỂN ĐỔI NỘI DUNG HIỂN THỊ
// ==========================================

function getPriorityLabel(priority) {
    const labels = {
        high: "Cao",
        medium: "Trung bình",
        low: "Thấp"
    };

    return labels[priority] || "Trung bình";
}

function getStatusLabel(status) {
    return status === "completed"
        ? "Đã hoàn thành"
        : "Chưa hoàn thành";
}

// Định dạng ngày theo kiểu Việt Nam
function formatDate(date) {
    if (!date) return "Chưa có ngày";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// ==========================================
// HÀM LỌC CÔNG VIỆC
// ==========================================

function getFilteredTasks() {
    const keyword = taskSearch.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;

    return tasks.filter(task => {
        // Tìm kiếm theo tên và mô tả
        const matchesKeyword =
            task.title.toLowerCase().includes(keyword) ||
            (task.description || "").toLowerCase().includes(keyword);

        // Lọc theo trạng thái
        const matchesStatus =
            selectedStatus === "all" ||
            task.status === selectedStatus;

        // Lọc theo mức ưu tiên
        const matchesPriority =
            selectedPriority === "all" ||
            task.priority === selectedPriority;

        return matchesKeyword && matchesStatus && matchesPriority;
    });
}

// ==========================================
// TẠO NÚT THAO TÁC
// ==========================================

function createActionButton(label, className, action, taskId) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `page-action-btn ${className}`;
    button.textContent = label;

    button.dataset.action = action;
    button.dataset.id = taskId;

    return button;
}

// ==========================================
// HIỂN THỊ DANH SÁCH CÔNG VIỆC
// ==========================================

function renderTasks() {
    const filteredTasks = getFilteredTasks();

    taskList.replaceChildren();

    taskCount.textContent =
        `Hiển thị ${filteredTasks.length}/${tasks.length} công việc`;

    if (filteredTasks.length === 0) {
        const empty = document.createElement("div");
        empty.className = "page-empty";
        empty.textContent = tasks.length === 0
            ? "Bạn chưa có công việc nào. Hãy thêm công việc đầu tiên nhé!"
            : "Không tìm thấy công việc phù hợp.";

        taskList.appendChild(empty);
        return;
    }

    filteredTasks.forEach(task => {
        const card = document.createElement("article");
        card.className = "page-task";

        if (task.status === "completed") {
            card.classList.add("completed");
        }

        // Phần thông tin công việc
        const main = document.createElement("div");
        main.className = "page-task-main";

        const info = document.createElement("div");
        info.className = "page-task-info";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "Không có mô tả";

        const details = document.createElement("p");
        details.textContent =
            `Ngày: ${formatDate(task.date)} · ` +
            `Thời gian: ${task.startTime || "--:--"} - ${task.endTime || "--:--"}`;

        const priority = document.createElement("span");
        priority.className = `page-priority priority-${task.priority}`;
        priority.textContent = `Ưu tiên: ${getPriorityLabel(task.priority)}`;

        const status = document.createElement("span");
        status.className = `page-status status-${task.status}`;
        status.textContent = getStatusLabel(task.status);

        info.append(title, description, details, priority, status);
        main.appendChild(info);

        // Các nút thao tác
        const actions = document.createElement("div");
        actions.className = "page-task-actions";

        const completeButton = createActionButton(
            task.status === "completed" ? "Chưa xong" : "Hoàn thành",
            "page-complete-btn",
            "toggle",
            task.id
        );

        const deleteButton = createActionButton(
            "Xóa",
            "page-delete-btn",
            "delete",
            task.id
        );

        actions.append(completeButton, deleteButton);

        card.append(main, actions);
        taskList.appendChild(card);
    });
}

// ==========================================
// CẬP NHẬT TRẠNG THÁI CÔNG VIỆC
// ==========================================

async function toggleTaskStatus(id) {
    const task = tasks.find(item => String(item.id) === String(id));

    if (!task) return;

    const newStatus = task.status === "completed"
        ? "pending"
        : "completed";

    try {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Không thể cập nhật trạng thái.");
        }

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

// ==========================================
// XÓA CÔNG VIỆC
// ==========================================

async function deleteTask(id) {
    const confirmed = confirm("Chị có chắc muốn xóa công việc này không?");

    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Không thể xóa công việc.");
        }

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

// ==========================================
// SỰ KIỆN NÚT THAO TÁC
// ==========================================

taskList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "toggle") {
        toggleTaskStatus(id);
    }

    if (action === "delete") {
        deleteTask(id);
    }
});

// ==========================================
// SỰ KIỆN TÌM KIẾM VÀ LỌC
// ==========================================

taskSearch.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
priorityFilter.addEventListener("change", renderTasks);

// ==========================================
// KHỞI TẠO TRANG
// ==========================================

loadTasks();
