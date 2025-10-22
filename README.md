# ChatGPT Message Navigator

Chrome extension để điều hướng giữa các tin nhắn của người dùng trong ChatGPT với tính năng Code Minifier mạnh mẽ.

## ✨ Tính năng chính

### 🧭 Điều hướng & Quản lý
- ⬆️⬇️ **Điều hướng**: Di chuyển lên/xuống giữa các tin nhắn của bạn
- 🔍 **Tìm kiếm**: Tìm kiếm tin nhắn với tùy chọn nâng cao
- 📤 **Xuất tin nhắn**: Xuất hội thoại ra nhiều định dạng (TXT, MD, JSON, CSV)
- 📚 **Lịch sử hội thoại**: Xem và quản lý tất cả tin nhắn
- 🎯 **Highlight**: Làm nổi bật tin nhắn hiện tại
- 📋 **Copy**: Sao chép tin nhắn vào clipboard
- 📊 **Đếm tin nhắn**: Hiển thị số thứ tự tin nhắn

### 🚀 Code Minifier (MỚI!)
- 🔧 **Minify Code**: Tối ưu hóa HTML, PHP, CSS, JS, TS, Laravel Blade, JSON
- 🎯 **Tự động phát hiện**: Nhận diện loại code thông minh
- ⚡ **Phím tắt nhanh**: Ctrl+M để mở minifier
- 📊 **Thống kê chi tiết**: Hiển thị kích thước gốc, sau minify, % giảm
- ⚙️ **Tùy chọn linh hoạt**: Bật/tắt các tính năng minify
- 📋 **Copy dễ dàng**: Copy code đã minify với 1 click

### 🎨 Giao diện & Trải nghiệm
- 🎨 **UI đẹp**: Giao diện hiện đại với dark mode support
- ⌨️ **Phím tắt đầy đủ**: Hỗ trợ keyboard shortcuts
- 🔔 **Thông báo**: Feedback trực quan cho các thao tác
- 🌙 **Dark/Light mode**: Tự động thích ứng với theme ChatGPT

## 🚀 Cài đặt

### Cách 1: Cài đặt từ file .crx (Khuyến nghị)
1. Download file `chatgpt-message-navigator.crx` từ releases
2. Mở Chrome và vào `chrome://extensions/`
3. Bật "Developer mode"
4. Kéo thả file `.crx` vào trang extensions
5. Click "Add extension" để cài đặt

### Cách 2: Build từ source code
1. Clone repository này:
   ```bash
   git clone https://github.com/your-username/chatgpt-message-navigator.git
   cd chatgpt-message-navigator
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Build extension:
   ```bash
   npm run build
   # Hoặc build với .crx file
   npm run build:crx
   ```

4. Load extension vào Chrome:
   - Mở Chrome và vào `chrome://extensions/`
   - Bật "Developer mode"
   - Click "Load unpacked" và chọn thư mục `dist`

## 📖 Sử dụng

### 🧭 Điều hướng cơ bản
1. Mở ChatGPT và bắt đầu một cuộc hội thoại
2. Extension sẽ tự động xuất hiện ở góc phải màn hình
3. Sử dụng các nút ⬆️⬇️ để di chuyển giữa các tin nhắn
4. Click "🔍 Search" để tìm kiếm tin nhắn
5. Click "📤 Export" để xuất hội thoại
6. Click "📚 History" để xem lịch sử hội thoại
7. Click "📋 Copy Message" để sao chép tin nhắn hiện tại

### 🚀 Code Minifier
1. **Chọn code** cần minify (hoặc để trống để lấy nội dung input)
2. **Nhấn Ctrl+M** hoặc click nút Code Minifier (✓)
3. **Điều chỉnh tùy chọn** minification nếu cần
4. **Nhấn Minify** hoặc **Ctrl+M** để minify
5. **Copy kết quả** đã được tối ưu

#### Hỗ trợ các loại code:
- **HTML**: Minify tags, loại bỏ comments
- **CSS**: Tối ưu selectors và properties
- **JavaScript/TypeScript**: Minify functions, variables
- **PHP**: Tối ưu PHP code
- **Laravel Blade**: Minify Blade templates
- **JSON**: Minify JSON objects

### ⌨️ Phím tắt
- `Ctrl+↑/↓`: Điều hướng tin nhắn
- `Ctrl+C`: Copy tin nhắn hiện tại
- `Ctrl+F`: Mở tìm kiếm
- `Ctrl+E`: Mở export panel
- `Ctrl+H`: Mở history panel
- `Ctrl+P`: Mở prompt manager
- `Ctrl+T`: Mở theme settings
- `Ctrl+S`: Mở smart suggestions
- `Ctrl+M`: **Mở Code Minifier** (MỚI!)
- `Esc`: Đóng tất cả panels

## 🏗️ Cấu trúc dự án

```
├── src/
│   ├── components/
│   │   ├── MessageNavigator.tsx     # Component chính
│   │   ├── CodeMinifierPanel.tsx    # Code Minifier UI (MỚI!)
│   │   ├── NavigationPanel.tsx      # Navigation controls
│   │   ├── SearchPanel.tsx          # Search functionality
│   │   ├── ExportPanel.tsx          # Export functionality
│   │   └── ...                      # Other components
│   ├── services/
│   │   ├── CodeMinifierService.ts   # Code minification logic (MỚI!)
│   │   ├── MessageService.ts        # Message handling
│   │   ├── SearchService.ts         # Search functionality
│   │   └── ...                      # Other services
│   ├── utils/
│   │   ├── constants.ts             # Constants & keyboard shortcuts
│   │   ├── keyboard.ts              # Keyboard handling
│   │   └── ...                      # Other utilities
│   ├── content.tsx                  # Content script
│   ├── content.css                  # Styles cho content script
│   └── popup.tsx                    # Popup component
├── dist/                            # Built extension files
├── manifest.json                    # Extension manifest
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── build-crx.bat                    # Windows build script
├── build-crx.ps1                    # PowerShell build script
└── *.crx                            # Packaged extension files
```

## 🛠️ Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Build with .crx file generation
npm run build:crx

# Windows build script
build-crx.bat

# PowerShell build script
.\build-crx.ps1
```

## 📋 Yêu cầu hệ thống

- **Chrome**: Version 88+ (Manifest V3)
- **Node.js**: Version 16+
- **npm**: Version 7+

### Dependencies chính
- **React**: 18.2.0
- **TypeScript**: 5.0.2
- **Vite**: 4.4.5
- **Chrome Extension APIs**: Manifest V3

## 🎯 Lợi ích Code Minifier

### 💰 Tiết kiệm chi phí
- **Giảm 30-70% kích thước prompt**
- **Ít tokens hơn** = chi phí thấp hơn
- **Tăng hiệu suất** xử lý ChatGPT

### ⚡ Tối ưu hiệu suất
- **Code ngắn gọn** hơn, dễ đọc
- **Loại bỏ code thừa** không cần thiết
- **Tập trung vào logic chính**

### 🎨 Trải nghiệm tốt hơn
- **Phím tắt nhanh** Ctrl+M
- **Tự động phát hiện** loại code
- **Thống kê chi tiết** minification
- **Copy dễ dàng** với 1 click

## 📚 Tài liệu thêm

- [CODE_MINIFIER_FEATURES.md](./CODE_MINIFIER_FEATURES.md) - Chi tiết về Code Minifier
- [BUILD_CRX.md](./BUILD_CRX.md) - Hướng dẫn build .crx file
- [EXPORT_FEATURES.md](./EXPORT_FEATURES.md) - Tính năng export
- [SEARCH_FEATURES.md](./SEARCH_FEATURES.md) - Tính năng tìm kiếm

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request để cải thiện extension.

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.
