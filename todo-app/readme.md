# MYDAY - PERSONAL TASK MANAGER

## 1. Giới thiệu dự án

**MyDay** là ứng dụng quản lý công việc cá nhân, hỗ trợ người dùng lập kế hoạch, theo dõi và quản lý các công việc hằng ngày một cách khoa học và hiệu quả.

Ứng dụng có giao diện thân thiện với tông màu xanh pastel và trắng, dễ sử dụng. Người dùng có thể tạo, chỉnh sửa, xóa, tìm kiếm, lọc công việc và theo dõi tiến độ hoàn thành.

Hệ thống sử dụng Node.js và Express.js để xây dựng Backend, kết hợp với cơ sở dữ liệu SQLite để lưu trữ và quản lý dữ liệu công việc.

## 2. Công nghệ sử dụng

- **Frontend:** HTML5, CSS3, JavaScript.
- **Backend:** Node.js, Express.js.
- **Database:** SQLite (sql.js).
- **API:** RESTful API.
- **Icons:** Lucide Icons.
- **Code Editor:** Visual Studio Code.
- **Version Control:** Git và GitHub.

## 3. Các chức năng chính

### 3.1. Trang Hôm nay

- Hiển thị danh sách công việc được lên lịch trong ngày hiện tại.
- Thêm công việc mới với các thông tin: tên công việc, mô tả, ngày thực hiện, giờ bắt đầu, giờ kết thúc và mức độ ưu tiên.
- Chỉnh sửa thông tin công việc.
- Xóa công việc.
- Cập nhật trạng thái công việc: đã hoàn thành hoặc chưa hoàn thành.
- Tìm kiếm công việc theo tên hoặc nội dung mô tả.
- Lọc công việc theo trạng thái và mức độ ưu tiên.
- Thống kê tổng số công việc, số công việc đã hoàn thành và số công việc chưa hoàn thành trong ngày.

### 3.2. Trang Tất cả công việc

- Hiển thị toàn bộ công việc được lưu trong hệ thống.
- Tìm kiếm công việc theo tên hoặc mô tả.
- Lọc công việc theo trạng thái.
- Lọc công việc theo mức độ ưu tiên.
- Cập nhật trạng thái hoàn thành của công việc.
- Xóa công việc không còn cần thiết.

### 3.3. Trang Thống kê

- Hiển thị tổng số công việc.
- Thống kê số lượng công việc đã hoàn thành.
- Thống kê số lượng công việc chưa hoàn thành.
- Tính tỷ lệ hoàn thành công việc.
- Thống kê công việc theo mức độ ưu tiên: Cao, Trung bình và Thấp.
- Hiển thị thanh tiến độ và biểu đồ trực quan giúp người dùng theo dõi kết quả thực hiện.

## 4. Cơ sở dữ liệu

Hệ thống sử dụng SQLite để lưu trữ thông tin công việc.

Bảng dữ liệu chính: `tasks`

| Trường dữ liệu | Mô tả |
|---|---|
| id | Mã công việc |
| title | Tên công việc |
| description | Mô tả công việc |
| date | Ngày thực hiện |
| priority | Mức độ ưu tiên |
| start_time | Giờ bắt đầu |
| end_time | Giờ kết thúc |
| status | Trạng thái công việc |
| created_at | Thời điểm tạo công việc |

Dữ liệu được lưu trữ trong file `database/myday.sqlite` và được truy xuất thông qua Backend API.

## 5. Cấu trúc thư mục

```text
todo-app/
│
├── backend/
│   ├── server.js
│   ├── taskRoutes.js
│   └── taskController.js
│
├── database/
│   ├── db.js
│   └── myday.sqlite
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── all-tasks.html
│   ├── all-tasks.js
│   ├── statistics.html
│   ├── statistics.js
│   └── pages.css
│
├── package.json
├── package-lock.json
└── README.md
```

## 6. Các API của hệ thống

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| GET | `/api/tasks` | Lấy danh sách công việc |
| GET | `/api/tasks/:id` | Lấy thông tin công việc theo ID |
| POST | `/api/tasks` | Thêm công việc mới |
| PUT | `/api/tasks/:id` | Chỉnh sửa công việc |
| PATCH | `/api/tasks/:id/status` | Cập nhật trạng thái công việc |
| DELETE | `/api/tasks/:id` | Xóa công việc |

## 7. Hướng dẫn cài đặt và chạy dự án

### Bước 1: Clone dự án

```bash
git clone https://github.com/huynmy143/baitapvenha/todo-app
```

### Bước 2: Di chuyển vào thư mục dự án

```bash
cd todo-app
```

### Bước 3: Cài đặt các thư viện cần thiết

```bash
npm install
```

### Bước 4: Khởi động Backend Server

```bash
node backend/server.js
```

### Bước 5: Truy cập ứng dụng

Mở trình duyệt và truy cập:

```text
http://localhost:3000
```

## 8. Nguyên lý hoạt động

Hệ thống hoạt động theo mô hình Frontend - Backend - Database:

1. Người dùng thao tác trên giao diện Frontend.
2. Frontend gửi yêu cầu đến Backend thông qua RESTful API.
3. Backend tiếp nhận và xử lý yêu cầu.
4. Backend truy xuất hoặc cập nhật dữ liệu trong SQLite.
5. Kết quả được trả về Frontend để cập nhật giao diện.

## 9. Kết luận

MyDay giúp người dùng quản lý công việc cá nhân, sắp xếp kế hoạch hằng ngày và theo dõi tiến độ thực hiện một cách thuận tiện.

Thông qua dự án, nhóm vận dụng các kiến thức về HTML, CSS, JavaScript, Node.js, Express.js, RESTful API và cơ sở dữ liệu SQLite vào quá trình xây dựng một ứng dụng Web hoàn chỉnh.
