// =====================================================
// 1. LẤY CÁC PHẦN TỬ HTML
// NOTE: Các ID ở đây phải trùng với ID trong index.html.
// =====================================================

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


// NOTE: Kiểm tra các phần tử HTML quan trọng.
// Nếu thiếu ID, Console sẽ giúp mình tìm lỗi.
const requiredElements = [
    "addTaskBtn",
    "taskFormContainer",
    "taskForm",
    "taskList",
    "searchInput",
    "statusFilter",
    "priorityFilter",
    "titleInput",
    "descriptionInput",
    "dateInput",
    "priorityInput",
    "startTimeInput",
    "endTimeInput",
    "statusInput"
];

const missingElements = requiredElements.filter(function (key) {
    return !elements[key];
});

if (missingElements.length > 0) {
    console.error(
        "MyDay: Không tìm thấy phần tử HTML:",
        missingElements.join(", ")
    );
}


// =====================================================
// 2. KHAI BÁO DỮ LIỆU
// NOTE: localStorage giúp công việc không bị mất khi
// tải lại trang. Sau này có thể thay bằng SQLite.
// =====================================================

const STORAGE_KEY = "myday_tasks";

let tasks = loadTasks();
let editingTaskId = null;


// Đọc dữ liệu công việc đã lưu trong trình duyệt.
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

        return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
        console.error("Không thể đọc dữ liệu công việc:", error);
        return [];
    }
}


// Lưu danh sách công việc vào localStorage.
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Không thể lưu dữ liệu công việc:", error);
        alert("Không thể lưu dữ liệu. Vui lòng kiểm tra bộ nhớ trình duyệt.");
    }
}


// =====================================================
// 3. CÁC HÀM HỖ TRỢ
// NOTE: Gom các thao tác dùng nhiều lần để tránh lặp code.
// =====================================================


// Tạo ID riêng cho mỗi công việc.
function createTaskId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return String(Date.now());
}


// Chuyển ngày từ YYYY-MM-DD sang DD/MM/YYYY.
function formatDate(dateString) {
    if (!dateString) return "Chưa có ngày";

    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;

    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
}


// Khởi tạo icon Lucide.
function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
}


// Hiển thị ngày hiện tại trên giao diện.
function updateCurrentDate() {
    if (!elements.currentDate) return;

    elements.currentDate.textContent = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// Chuyển mức độ ưu tiên sang tiếng Việt.
function getPriorityText(priority) {
    const labels = {
        high: "Cao",
        medium: "Trung bình",
        low: "Thấp"
    };

    return labels[priority] || "Chưa xác định";
}


// Chuyển trạng thái công việc sang tiếng Việt.
function getStatusText(status) {
    return status === "completed"
        ? "Đã hoàn thành"
        : "Chưa hoàn thành";
}


// =====================================================
// 4. MỞ VÀ ĐÓNG BIỂU MẪU
// =====================================================


// Mở biểu mẫu để thêm công việc mới.
function openTaskForm() {
    editingTaskId = null;
    elements.taskForm.reset();

    if (elements.formHeading) {
        elements.formHeading.textContent = "Thêm công việc mới";
    }

    if (elements.saveButton) {
        elements.saveButton.innerHTML =
            '<i data-lucide="plus"></i> Lưu công việc';
    }

    elements.taskFormContainer.hidden = false;

    refreshIcons();
    elements.titleInput.focus();
}


// Đóng biểu mẫu và xóa dữ liệu đang nhập.
function closeTaskForm() {
    elements.taskFormContainer.hidden = true;
    elements.taskForm.reset();
    editingTaskId = null;
}


// =====================================================
// 5. THÊM VÀ CẬP NHẬT CÔNG VIỆC
// NOTE: Dùng chung một biểu mẫu cho cả hai chức năng.
// =====================================================


// Lấy dữ liệu từ các ô nhập liệu.
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


// Kiểm tra dữ liệu trước khi lưu.
function validateTask(taskData) {
    if (!taskData.title || !taskData.date) {
        alert("Vui lòng nhập tên công việc và ngày thực hiện!");
        return false;
    }

    if (
        taskData.startTime &&
        taskData.endTime &&
        taskData.endTime <= taskData.startTime
    ) {
        alert("Giờ kết thúc phải sau giờ bắt đầu!");
        return false;
    }

    return true;
}


// Xử lý khi người dùng nhấn nút lưu.
function handleTaskSubmit(event) {
    event.preventDefault();

    const taskData = getFormData();

    if (!validateTask(taskData)) return;

    if (editingTaskId !== null) {

        // Nếu đang chỉnh sửa thì cập nhật công việc cũ.
        const taskToUpdate = tasks.find(function (task) {
            return task.id === editingTaskId;
        });

        if (!taskToUpdate) {
            alert("Không tìm thấy công việc cần chỉnh sửa.");
            closeTaskForm();
            return;
        }

        Object.assign(taskToUpdate, taskData);

        alert("Đã cập nhật công việc thành công!");

    } else {

        // Nếu không chỉnh sửa thì tạo công việc mới.
        const newTask = {
            id: createTaskId(),
            ...taskData
        };

        tasks.push(newTask);

        alert("Đã thêm công việc thành công!");
    }

    saveTasks();
    renderTasks();
    updateStatistics();
    closeTaskForm();
}


// =====================================================
// 6. CHỈNH SỬA, XÓA VÀ ĐỔI TRẠNG THÁI
// =====================================================


// Lấy thông tin công việc và đưa lên biểu mẫu chỉnh sửa.
function editTask(taskId) {
    const task = tasks.find(function (item) {
        return item.id === taskId;
    });

    if (!task) return;

    editingTaskId = taskId;

    elements.titleInput.value = task.title || "";
    elements.descriptionInput.value = task.description || "";
    elements.dateInput.value = task.date || "";
    elements.priorityInput.value = task.priority || "medium";
    elements.startTimeInput.value = task.startTime || "";
    elements.endTimeInput.value = task.endTime || "";
    elements.statusInput.value = task.status || "pending";

    if (elements.formHeading) {
        elements.formHeading.textContent = "Chỉnh sửa công việc";
    }

    if (elements.saveButton) {
        elements.saveButton.innerHTML =
            '<i data-lucide="save"></i> Lưu thay đổi';
    }

    elements.taskFormContainer.hidden = false;

    refreshIcons();
    elements.titleInput.focus();
}


// Xóa công việc khỏi danh sách.
function deleteTask(taskId) {
    const isConfirmed = confirm(
        "Bạn có chắc chắn muốn xóa công việc này không?"
    );

    if (!isConfirmed) return;

    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    saveTasks();
    renderTasks();
    updateStatistics();
}


// Chuyển đổi giữa trạng thái hoàn thành và chưa hoàn thành.
function toggleTaskStatus(taskId) {
    const task = tasks.find(function (item) {
        return item.id === taskId;
    });

    if (!task) return;

    task.status = task.status === "completed"
        ? "pending"
        : "completed";

    saveTasks();
    renderTasks();
    updateStatistics();
}


// =====================================================
// 7. TẠO THẺ CÔNG VIỆC
// NOTE: Dùng textContent để hiển thị nội dung người dùng
// nhập, hạn chế lỗi chèn HTML không mong muốn.
// =====================================================


// Tạo một thẻ công việc.
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
    dateInfo.append(` ${formatDate(task.date)}`);

    const timeInfo = document.createElement("span");
    timeInfo.innerHTML = '<i data-lucide="clock-3"></i>';

    const timeText = task.startTime
        ? `${task.startTime}${task.endTime ? " - " + task.endTime : ""}`
        : "Chưa đặt giờ";

    timeInfo.append(` ${timeText}`);

    meta.append(dateInfo, timeInfo);

    const status = document.createElement("div");
    status.className =
        `task-status ${task.status === "completed" ? "is-completed" : "is-pending"}`;
    status.textContent = getStatusText(task.status);

    content.append(heading, description, meta, status);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = createActionButton(
        "edit",
        "pencil",
        "Chỉnh sửa"
    );

    const deleteButton = createActionButton(
        "delete",
        "trash-2",
        "Xóa"
    );

    const completeButton = task.status === "completed"
        ? createActionButton("toggle", "rotate-ccw", "Đánh dấu chưa xong")
        : createActionButton("toggle", "check", "Hoàn thành");

    actions.append(editButton, deleteButton, completeButton);

    taskItem.append(content, actions);

    return taskItem;
}


// Tạo các nút thao tác trên thẻ công việc.
function createActionButton(action, iconName, label) {
    const button = document.createElement("button");

    button.type = "button";

    button.className = `
        ${action === "edit" ? "edit-task-btn" : ""}
        ${action === "delete" ? "delete-task-btn" : ""}
        ${action === "toggle" ? "complete-task-btn" : ""}
    `.trim();

    button.dataset.action = action;
    button.innerHTML = `<i data-lucide="${iconName}"></i> ${label}`;

    return button;
}


// =====================================================
// 8. TÌM KIẾM VÀ LỌC CÔNG VIỆC
// NOTE: Bộ lọc hoạt động trên toàn bộ danh sách tasks.
// =====================================================


// Trả về danh sách công việc phù hợp với điều kiện lọc.
function getFilteredTasks() {
    const keyword = elements.searchInput.value
        .trim()
        .toLocaleLowerCase("vi");

    const selectedStatus = elements.statusFilter.value;
    const selectedPriority = elements.priorityFilter.value;

    return tasks.filter(function (task) {
        const title = (task.title || "").toLocaleLowerCase("vi");
        const description = (task.description || "")
            .toLocaleLowerCase("vi");

        const matchesKeyword =
            title.includes(keyword) ||
            description.includes(keyword);

        const matchesStatus =
            selectedStatus === "all" ||
            task.status === selectedStatus;

        const matchesPriority =
            selectedPriority === "all" ||
            task.priority === selectedPriority;

        return matchesKeyword &&
            matchesStatus &&
            matchesPriority;
    });
}


// Hiển thị khi danh sách không có công việc phù hợp.
function renderEmptyState() {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "empty-icon";
    iconWrapper.innerHTML = '<i data-lucide="clipboard-list"></i>';

    const heading = document.createElement("h3");
    heading.textContent = "Chưa tìm thấy công việc";

    const message = document.createElement("p");
    message.textContent = "Hãy thêm công việc mới để bắt đầu nhé!";

    emptyState.append(iconWrapper, heading, message);

    elements.taskList.replaceChildren(emptyState);
}


// Hiển thị danh sách công việc lên giao diện.
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    elements.taskList.replaceChildren();

    if (filteredTasks.length === 0) {
        renderEmptyState();
        refreshIcons();
        return;
    }

    const fragment = document.createDocumentFragment();

    filteredTasks.forEach(function (task) {
        fragment.appendChild(createTaskElement(task));
    });

    elements.taskList.appendChild(fragment);

    refreshIcons();
}


// =====================================================
// 9. CẬP NHẬT THỐNG KÊ
// NOTE: Thống kê tính trên toàn bộ công việc,
// không phụ thuộc vào tìm kiếm hay bộ lọc.
// =====================================================

function updateStatistics() {
    const completedCount = tasks.filter(function (task) {
        return task.status === "completed";
    }).length;

    const pendingCount = tasks.length - completedCount;

    if (elements.totalTasks) {
        elements.totalTasks.textContent = tasks.length;
    }

    if (elements.completedTasks) {
        elements.completedTasks.textContent = completedCount;
    }

    if (elements.pendingTasks) {
        elements.pendingTasks.textContent = pendingCount;
    }
}


// =====================================================
// 10. GẮN SỰ KIỆN
// NOTE: Event Delegation giúp quản lý các nút trong danh sách
// mà không cần gắn sự kiện riêng cho từng thẻ công việc.
// =====================================================

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


// Bắt sự kiện nhấn nút bên trong danh sách công việc.
if (elements.taskList) {
    elements.taskList.addEventListener("click", function (event) {
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


// =====================================================
// 11. KHỞI CHẠY ỨNG DỤNG
// NOTE: Các hàm này chạy khi JavaScript được tải.
// =====================================================

updateCurrentDate();
renderTasks();
updateStatistics();
