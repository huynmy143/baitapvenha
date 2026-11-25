
// =====================================================
// MYDAY - QUẢN LÝ CÔNG VIỆC HÔM NAY
// File: frontend/script.js
// Kết nối Backend API và Database SQLite
// =====================================================


// 1. CẤU HÌNH API
const API_URL = "/api/tasks";

let tasks = [];
let editingTaskId = null;


// 2. LẤY CÁC PHẦN TỬ HTML
const elements = {
    addTaskBtn: document.getElementById("add-task-btn"),
    taskFormContainer: document.getElementById("task-form-container"),
    taskForm: document.getElementById("task-form"),
    closeTaskFormBtn: document.getElementById("close-task-form"),
    cancelTaskBtn: document.getElementById("cancel-task-btn"),
    taskList: document.getElementById("task-list"),

    searchInput: document.getElementById("search-input"),
    statusFilter: document.getElementById("status-filter"),
    priorityFilter: document.getElementById("priority-filter"),

    totalTasks: document.getElementById("total-tasks"),
    completedTasks: document.getElementById("completed-tasks"),
    pendingTasks: document.getElementById("pending-tasks"),

    currentDate: document.getElementById("current-date"),

    titleInput: document.getElementById("task-title"),
    descriptionInput: document.getElementById("task-description"),
    dateInput: document.getElementById("task-date"),
    priorityInput: document.getElementById("task-priority"),
    startTimeInput: document.getElementById("task-start-time"),
    endTimeInput: document.getElementById("task-end-time"),
    statusInput: document.getElementById("task-status"),

    formHeading: document.querySelector(".task-form-header h2"),
    saveButton: document.querySelector(".save-btn")
};


// 3. HÀM GỌI BACKEND API
async function callAPI(url, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
        throw new Error(
            result.message || "Không thể kết nối với máy chủ."
        );
    }

    return result;
}


// 4. LẤY NGÀY HÔM NAY
function getTodayString() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// 5. TẢI DỮ LIỆU TỪ DATABASE
async function loadTasks() {
    try {
        const result = await callAPI(API_URL);

        // Dữ liệu được lấy từ SQLite thông qua Backend.
        tasks = Array.isArray(result.data) ? result.data : [];

        renderTasks();
        updateStatistics();

    } catch (error) {
        console.error("Lỗi tải công việc:", error);

        elements.taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i data-lucide="cloud-off"></i>
                </div>
                <h3>Không thể tải công việc</h3>
                <p>${escapeHTML(error.message)}</p>
                <button type="button" id="retry-load-btn">
                    Thử tải lại
                </button>
            </div>
        `;

        refreshIcons();
    }
}


// 6. CÁC HÀM HỖ TRỢ
function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}


function formatDate(dateString) {
    if (!dateString) return "Chưa có ngày";

    const parts = String(dateString).slice(0, 10).split("-");

    if (parts.length !== 3) return dateString;

    const [year, month, day] = parts;

    return `${day}/${month}/${year}`;
}


function getPriorityText(priority) {
    const labels = {
        high: "Cao",
        medium: "Trung bình",
        low: "Thấp"
    };

    return labels[priority] || "Chưa xác định";
}


function getStatusText(status) {
    return status === "completed"
        ? "Đã hoàn thành"
        : "Chưa hoàn thành";
}


function updateCurrentDate() {
    if (!elements.currentDate) return;

    elements.currentDate.textContent =
        new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}


// 7. MỞ VÀ ĐÓNG BIỂU MẪU
function openTaskForm() {
    editingTaskId = null;

    elements.taskForm.reset();

    elements.dateInput.value = getTodayString();

    elements.formHeading.textContent = "Thêm công việc mới";

    elements.saveButton.innerHTML =
        '<i data-lucide="plus"></i> Lưu công việc';

    elements.taskFormContainer.hidden = false;

    refreshIcons();
    elements.titleInput.focus();
}


function closeTaskForm() {
    elements.taskFormContainer.hidden = true;
    elements.taskForm.reset();

    editingTaskId = null;
}


// 8. LẤY DỮ LIỆU TỪ BIỂU MẪU
function getFormData() {
    return {
        title: elements.titleInput.value.trim(),
        description: elements.descriptionInput.value.trim(),
        date: elements.dateInput.value,
        priority: elements.priorityInput.value,
        startTime: elements.startTimeInput.value,
        endTime: elements.endTimeInput.value,
        status: elements.statusInput.value
    };
}


function validateTask(data) {
    if (!data.title || !data.date) {
        alert("Vui lòng nhập tên công việc và ngày thực hiện!");
        return false;
    }

    if (
        data.startTime &&
        data.endTime &&
        data.endTime <= data.startTime
    ) {
        alert("Giờ kết thúc phải sau giờ bắt đầu!");
        return false;
    }

    return true;
}


// 9. THÊM VÀ CẬP NHẬT CÔNG VIỆC
async function handleTaskSubmit(event) {
    event.preventDefault();

    const data = getFormData();

    if (!validateTask(data)) return;

    const isEditing = editingTaskId !== null;

    const url = isEditing
        ? `${API_URL}/${encodeURIComponent(editingTaskId)}`
        : API_URL;

    const method = isEditing ? "PUT" : "POST";

    try {
        elements.saveButton.disabled = true;
        elements.saveButton.textContent = "Đang lưu...";

        // Gửi dữ liệu lên Backend để lưu vào SQLite.
        await callAPI(url, method, data);

        alert(
            isEditing
                ? "Cập nhật công việc thành công!"
                : "Thêm công việc thành công!"
        );

        closeTaskForm();

        // Tải lại dữ liệu mới nhất từ Database.
        await loadTasks();

    } catch (error) {
        console.error("Lỗi lưu công việc:", error);
        alert("Không thể lưu công việc: " + error.message);

    } finally {
        elements.saveButton.disabled = false;
        elements.saveButton.innerHTML =
            '<i data-lucide="plus"></i> Lưu công việc';

        refreshIcons();
    }
}


// 10. CHỈNH SỬA CÔNG VIỆC
function editTask(taskId) {
    const task = tasks.find(
        item => String(item.id) === String(taskId)
    );

    if (!task) {
        alert("Không tìm thấy công việc!");
        return;
    }

    editingTaskId = task.id;

    elements.titleInput.value = task.title || "";
    elements.descriptionInput.value = task.description || "";
    elements.dateInput.value = String(task.date || "").slice(0, 10);
    elements.priorityInput.value = task.priority || "medium";
    elements.startTimeInput.value = task.startTime || "";
    elements.endTimeInput.value = task.endTime || "";
    elements.statusInput.value = task.status || "pending";

    elements.formHeading.textContent = "Chỉnh sửa công việc";

    elements.saveButton.innerHTML =
        '<i data-lucide="save"></i> Lưu thay đổi';

    elements.taskFormContainer.hidden = false;

    refreshIcons();
    elements.titleInput.focus();
}


// 11. XÓA CÔNG VIỆC
async function deleteTask(taskId) {
    if (!confirm("Chị có chắc chắn muốn xóa công việc này không?")) {
        return;
    }

    try {
        await callAPI(
            `${API_URL}/${encodeURIComponent(taskId)}`,
            "DELETE"
        );

        alert("Đã xóa công việc thành công!");

        await loadTasks();

    } catch (error) {
        alert("Không thể xóa công việc: " + error.message);
    }
}


// 12. CẬP NHẬT TRẠNG THÁI
async function toggleTaskStatus(taskId) {
    const task = tasks.find(
        item => String(item.id) === String(taskId)
    );

    if (!task) return;

    const newStatus = task.status === "completed"
        ? "pending"
        : "completed";

    try {
        await callAPI(
            `${API_URL}/${encodeURIComponent(taskId)}/status`,
            "PATCH",
            { status: newStatus }
        );

        await loadTasks();

    } catch (error) {
        alert("Không thể cập nhật trạng thái: " + error.message);
    }
}


// 13. TẠO NÚT THAO TÁC
function createActionButton(action, iconName, label) {
    const button = document.createElement("button");

    button.type = "button";
    button.dataset.action = action;

    if (action === "edit") {
        button.className = "edit-task-btn";
    } else if (action === "delete") {
        button.className = "delete-task-btn";
    } else {
        button.className = "complete-task-btn";
    }

    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", iconName);

    button.append(icon, document.createTextNode(" " + label));

    return button;
}


// 14. TẠO THẺ CÔNG VIỆC
function createTaskElement(task) {
    const taskItem = document.createElement("article");

    taskItem.className = "task-item";
    taskItem.dataset.taskId = task.id;

    const content = document.createElement("div");
    content.className = "task-item-content";

    const heading = document.createElement("div");
    heading.className = "task-item-heading";

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.title || "Công việc chưa có tên";

    const priority = document.createElement("span");
    priority.className =
        `priority-label priority-${task.priority || "medium"}`;
    priority.textContent = getPriorityText(task.priority);

    heading.append(title, priority);

    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description || "Không có mô tả";

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const dateInfo = document.createElement("span");
    dateInfo.innerHTML = '<i data-lucide="calendar-days"></i>';
    dateInfo.append(" " + formatDate(task.date));

    const timeInfo = document.createElement("span");
    timeInfo.innerHTML = '<i data-lucide="clock-3"></i>';

    const timeText = task.startTime
        ? `${task.startTime}${task.endTime ? " - " + task.endTime : ""}`
        : "Chưa đặt giờ";

    timeInfo.append(" " + timeText);

    meta.append(dateInfo, timeInfo);

    const status = document.createElement("div");
    status.className =
        `task-status ${
            task.status === "completed"
                ? "is-completed"
                : "is-pending"
        }`;

    status.textContent = getStatusText(task.status);

    content.append(heading, description, meta, status);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = createActionButton("edit", "pencil", "Chỉnh sửa");
    const deleteButton = createActionButton("delete", "trash-2", "Xóa");

    const completeButton = task.status === "completed"
        ? createActionButton("toggle", "rotate-ccw", "Đánh dấu chưa xong")
        : createActionButton("toggle", "check", "Hoàn thành");

    actions.append(editButton, deleteButton, completeButton);

    taskItem.append(content, actions);

    return taskItem;
}


// 15. LỌC CÔNG VIỆC HÔM NAY
function getFilteredTasks() {
    const today = getTodayString();

    const keyword = elements.searchInput.value
        .trim()
        .toLocaleLowerCase("vi");

    const selectedStatus = elements.statusFilter.value;
    const selectedPriority = elements.priorityFilter.value;

    return tasks.filter(task => {
        const isToday =
            String(task.date || "").slice(0, 10) === today;

        const title = (task.title || "").toLocaleLowerCase("vi");
        const description =
            (task.description || "").toLocaleLowerCase("vi");

        const matchesKeyword =
            title.includes(keyword) || description.includes(keyword);

        const matchesStatus =
            selectedStatus === "all" || task.status === selectedStatus;

        const matchesPriority =
            selectedPriority === "all" || task.priority === selectedPriority;

        return (
            isToday &&
            matchesKeyword &&
            matchesStatus &&
            matchesPriority
        );
    });
}


// 16. HIỂN THỊ DANH SÁCH
function renderTasks() {
    if (!elements.taskList) return;

    const filteredTasks = getFilteredTasks();

    elements.taskList.replaceChildren();

    if (filteredTasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";

        const icon = document.createElement("div");
        icon.className = "empty-icon";
        icon.innerHTML = '<i data-lucide="notebook-tabs"></i>';

        const heading = document.createElement("h3");
        heading.textContent = "Hôm nay chưa có công việc nào";

        const message = document.createElement("p");
        message.textContent =
            "Hãy thêm công việc mới để bắt đầu nhé!";

        emptyState.append(icon, heading, message);
        elements.taskList.appendChild(emptyState);

    } else {
        const fragment = document.createDocumentFragment();

        filteredTasks.forEach(task => {
            fragment.appendChild(createTaskElement(task));
        });

        elements.taskList.appendChild(fragment);
    }

    refreshIcons();
}


// 17. CẬP NHẬT THỐNG KÊ HÔM NAY
function updateStatistics() {
    const today = getTodayString();

    const todayTasks = tasks.filter(task =>
        String(task.date || "").slice(0, 10) === today
    );

    const completedCount = todayTasks.filter(
        task => task.status === "completed"
    ).length;

    const pendingCount = todayTasks.length - completedCount;

    elements.totalTasks.textContent = todayTasks.length;
    elements.completedTasks.textContent = completedCount;
    elements.pendingTasks.textContent = pendingCount;
}


// 18. GẮN SỰ KIỆN
if (elements.addTaskBtn) {
    elements.addTaskBtn.addEventListener("click", openTaskForm);
}

if (elements.closeTaskFormBtn) {
    elements.closeTaskFormBtn.addEventListener("click", closeTaskForm);
}

if (elements.cancelTaskBtn) {
    elements.cancelTaskBtn.addEventListener("click", closeTaskForm);
}

if (elements.taskForm) {
    elements.taskForm.addEventListener("submit", handleTaskSubmit);
}

if (elements.searchInput) {
    elements.searchInput.addEventListener("input", renderTasks);
}

if (elements.statusFilter) {
    elements.statusFilter.addEventListener("change", renderTasks);
}

if (elements.priorityFilter) {
    elements.priorityFilter.addEventListener("change", renderTasks);
}


// 19. XỬ LÝ NÚT TRONG DANH SÁCH
if (elements.taskList) {
    elements.taskList.addEventListener("click", event => {
        const retryButton = event.target.closest("#retry-load-btn");

        if (retryButton) {
            loadTasks();
            return;
        }

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const taskItem = button.closest(".task-item");

        if (!taskItem) return;

        const taskId = taskItem.dataset.taskId;
        const action = button.dataset.action;

        if (action === "edit") {
            editTask(taskId);
        } else if (action === "delete") {
            deleteTask(taskId);
        } else if (action === "toggle") {
            toggleTaskStatus(taskId);
        }
    });
}


// 20. KHỞI CHẠY
updateCurrentDate();
loadTasks();
