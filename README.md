# ChatGPT Message Navigator

Chrome extension để điều hướng giữa các tin nhắn của người dùng trong ChatGPT.

## Tính năng

- ⬆️⬇️ **Điều hướng**: Di chuyển lên/xuống giữa các tin nhắn của bạn
- 🔍 **Tìm kiếm**: Tìm kiếm tin nhắn với tùy chọn nâng cao
- 📤 **Xuất tin nhắn**: Xuất hội thoại ra nhiều định dạng (TXT, MD, JSON, CSV)
- 📚 **Lịch sử hội thoại**: Xem và quản lý tất cả tin nhắn
- 🎯 **Highlight**: Làm nổi bật tin nhắn hiện tại
- 📋 **Copy**: Sao chép tin nhắn vào clipboard
- 📊 **Đếm tin nhắn**: Hiển thị số thứ tự tin nhắn
- 🎨 **UI đẹp**: Giao diện hiện đại với dark mode support

## Cài đặt

1. Clone repository này
2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Build extension:
   ```bash
   npm run build
   ```

4. Load extension vào Chrome:
   - Mở Chrome và vào `chrome://extensions/`
   - Bật "Developer mode"
   - Click "Load unpacked" và chọn thư mục `dist`

## Sử dụng

1. Mở ChatGPT và bắt đầu một cuộc hội thoại
2. Extension sẽ tự động xuất hiện ở góc phải màn hình
3. Sử dụng các nút ⬆️⬇️ để di chuyển giữa các tin nhắn
4. Click "🔍 Search" để tìm kiếm tin nhắn
5. Click "📤 Export" để xuất hội thoại
6. Click "📚 History" để xem lịch sử hội thoại
7. Click "📋 Copy Message" để sao chép tin nhắn hiện tại

### Phím tắt
- `Ctrl+F`: Mở tìm kiếm
- `Ctrl+E`: Mở export panel
- `Ctrl+H`: Mở history panel
- `Ctrl+↑/↓`: Điều hướng tin nhắn
- `Ctrl+C`: Copy tin nhắn hiện tại
- `Esc`: Đóng tất cả panels

## Cấu trúc dự án

```
├── src/
│   ├── components/
│   │   └── MessageNavigator.tsx  # Component chính
│   ├── content.tsx               # Content script
│   ├── content.css              # Styles cho content script
│   └── popup.tsx                # Popup component
├── manifest.json                # Extension manifest
├── package.json                 # Dependencies
└── vite.config.ts              # Vite configuration
```

## Development

```bash
# Development mode
npm run dev

# Build for production
npm run build
```

## Yêu cầu

- Chrome Extension Manifest V3
- React 18
- TypeScript
- Vite
