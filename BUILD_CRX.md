# Building Extension to .crx File

Hướng dẫn build extension ChatGPT Message Navigator thành file .crx để cài đặt.

## Cách 1: Sử dụng Script Tự động

### Windows Batch File
```bash
build-crx.bat
```

### PowerShell Script
```powershell
.\build-crx.ps1
```

### NPM Script
```bash
npm run build:crx
```

## Cách 2: Build Thủ công

### Bước 1: Cài đặt crx3 tool
```bash
npm install -g crx3
```

### Bước 2: Build extension
```bash
npm run build
```

### Bước 3: Tạo file .crx
```bash
# Tạo file .crx thông thường
crx3 dist -o chatgpt-message-navigator.crx

# Tạo file .crx với private key (để cập nhật sau này)
crx3 dist -p chatgpt-message-navigator.pem -o chatgpt-message-navigator-with-key.crx
```

## Files được tạo

- `chatgpt-message-navigator.crx` (145 KB) - File extension sẵn sàng cài đặt
- `chatgpt-message-navigator-with-key.crx` (145 KB) - File extension với private key
- `chatgpt-message-navigator.pem` (3 KB) - Private key để cập nhật extension

## Cài đặt Extension

### Cách 1: Load unpacked (Development)
1. Mở Chrome và vào `chrome://extensions/`
2. Bật "Developer mode"
3. Click "Load unpacked" và chọn thư mục `dist`

### Cách 2: Cài đặt file .crx
1. Mở Chrome và vào `chrome://extensions/`
2. Bật "Developer mode"
3. Kéo thả file `.crx` vào trang extensions
4. Hoặc click "Load unpacked" và chọn file `.crx`

## Lưu ý

- File `.pem` chứa private key để cập nhật extension sau này
- Giữ file `.pem` an toàn để có thể tạo phiên bản mới với cùng ID
- File `.crx` có thể được chia sẻ và cài đặt trên các máy khác
