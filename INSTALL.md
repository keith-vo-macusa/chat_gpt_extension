# Hướng dẫn cài đặt ChatGPT Message Navigator

## Bước 1: Cài đặt Node.js
1. Tải và cài đặt Node.js từ https://nodejs.org/
2. Kiểm tra cài đặt: mở Command Prompt và chạy `node --version`

## Bước 2: Cài đặt dependencies
Mở Command Prompt trong thư mục dự án và chạy:
```bash
npm install
```

## Bước 3: Build extension
Chạy lệnh build:
```bash
npm run build
```

## Bước 4: Load extension vào Chrome
1. Mở Chrome và vào `chrome://extensions/`
2. Bật "Developer mode" ở góc trên bên phải
3. Click "Load unpacked"
4. Chọn thư mục `dist` trong dự án (D:\chatgpt-extension\dist)
5. Extension sẽ xuất hiện trong danh sách với tên "ChatGPT Message Navigator"

## Bước 5: Sử dụng extension
1. Mở ChatGPT (https://chat.openai.com)
2. Bắt đầu một cuộc hội thoại
3. Extension sẽ xuất hiện ở góc phải màn hình
4. Sử dụng các nút để điều hướng giữa tin nhắn

## Troubleshooting

### Nếu gặp lỗi "Cannot find module 'react'"
Chạy lại:
```bash
npm install
npm run build
```

### Nếu extension không hoạt động
1. Kiểm tra Console trong Developer Tools (F12)
2. Đảm bảo bạn đang ở trang ChatGPT
3. Refresh trang và thử lại

### Nếu không tìm thấy tin nhắn
Extension sẽ tự động tìm tin nhắn với các class:
- `user-message-bubble-color`
- `user-message`
- `user`
- `data-message-author-role="user"`

Nếu ChatGPT thay đổi cấu trúc HTML, có thể cần cập nhật extension.
