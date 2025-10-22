# ChatGPT Message Navigator - Export & History Features

## 📤 Tính năng xuất tin nhắn và lịch sử hội thoại

Extension đã được nâng cấp với tính năng xuất tin nhắn và quản lý lịch sử hội thoại mạnh mẽ, cho phép bạn lưu trữ, phân tích và quản lý các cuộc hội thoại ChatGPT một cách hiệu quả.

### 🚀 Tính năng chính

#### 1. **Xuất tin nhắn đa định dạng**
- ✅ **Text (.txt)**: Định dạng văn bản thuần túy
- ✅ **Markdown (.md)**: Định dạng markdown với formatting
- ✅ **JSON (.json)**: Định dạng JSON với metadata đầy đủ
- ✅ **CSV (.csv)**: Định dạng bảng tính cho phân tích

#### 2. **Tùy chọn xuất linh hoạt**
- 📊 **Thống kê hội thoại**: Hiển thị số liệu chi tiết
- 🏷️ **Metadata**: Bao gồm thông tin hội thoại
- 🔢 **Đánh số tin nhắn**: Tự động đánh số thứ tự
- ⏰ **Timestamp**: Thêm thời gian xuất
- 🎯 **Preview**: Xem trước nội dung trước khi xuất

#### 3. **Lịch sử hội thoại thông minh**
- 📚 **Xem tất cả tin nhắn**: Danh sách đầy đủ tin nhắn
- 🔍 **Tìm kiếm trong lịch sử**: Tìm kiếm nhanh
- 📊 **Phân loại theo độ dài**: Ngắn, trung bình, dài
- 📈 **Thống kê chi tiết**: Số liệu thống kê đầy đủ
- 🎯 **Chọn tin nhắn**: Click để chuyển đến tin nhắn

#### 4. **Giao diện thân thiện**
- 🎨 **Modal đẹp mắt**: Giao diện popup hiện đại
- 📱 **Responsive**: Tương thích mọi kích thước màn hình
- 🌙 **Dark mode**: Hỗ trợ chế độ tối
- ⚡ **Keyboard shortcuts**: Điều hướng bằng phím tắt

### 🎮 Cách sử dụng

#### **Mở Export Panel**
- Click vào nút **📤** (màu xanh) trên floating panel
- Hoặc sử dụng phím tắt **Ctrl+E**

#### **Xuất tin nhắn**
1. Chọn định dạng xuất (TXT, MD, JSON, CSV)
2. Cấu hình tùy chọn xuất:
   - ☑️ Bao gồm thông tin hội thoại
   - ☑️ Đánh số tin nhắn
   - ☑️ Bao gồm thời gian
3. Xem trước nội dung
4. Click "**📥 Xuất file**"

#### **Xem lịch sử hội thoại**
1. Click vào nút **📚** (màu tím) trên floating panel
2. Hoặc sử dụng phím tắt **Ctrl+H**
3. Sử dụng các tùy chọn:
   - **Tìm kiếm**: Gõ từ khóa để tìm tin nhắn
   - **Lọc**: Chọn theo độ dài tin nhắn
   - **Sắp xếp**: Theo thứ tự, độ dài, hoặc số từ
4. Click vào tin nhắn để chuyển đến

### ⌨️ Phím tắt

| Phím tắt | Chức năng |
|----------|-----------|
| `Ctrl+E` | Mở Export Panel |
| `Ctrl+H` | Mở History Panel |
| `Ctrl+F` | Mở Search Panel |
| `Ctrl+↑/↓` | Điều hướng tin nhắn |
| `Ctrl+C` | Copy tin nhắn hiện tại |
| `Esc` | Đóng tất cả panels |

### 📊 Thống kê hội thoại

#### **Thống kê tổng quan**
- **Tổng tin nhắn**: Số lượng tin nhắn trong hội thoại
- **Tổng ký tự**: Tổng số ký tự trong tất cả tin nhắn
- **Tổng từ**: Tổng số từ trong tất cả tin nhắn
- **Độ dài trung bình**: Độ dài trung bình của tin nhắn

#### **Phân loại tin nhắn**
- **📝 Ngắn**: < 100 ký tự
- **📄 Trung bình**: 100-500 ký tự
- **📚 Dài**: > 500 ký tự

### 📁 Định dạng xuất

#### **Text (.txt)**
```
# ChatGPT Conversation

**Export Date:** 2024-01-15 10:30:00
**Message Count:** 5
**Total Characters:** 1,250

---

## Message 1

Nội dung tin nhắn đầu tiên...

## Message 2

Nội dung tin nhắn thứ hai...
```

#### **Markdown (.md)**
```markdown
# ChatGPT Conversation

> **Export Information**
> - **Date:** 2024-01-15 10:30:00
> - **Messages:** 5
> - **Characters:** 1,250

---

## Message 1

Nội dung tin nhắn đầu tiên...
```

#### **JSON (.json)**
```json
{
  "metadata": {
    "title": "ChatGPT Conversation",
    "exportDate": "2024-01-15T10:30:00.000Z",
    "messageCount": 5,
    "totalCharacters": 1250
  },
  "messages": [
    {
      "index": 1,
      "text": "Nội dung tin nhắn...",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "characterCount": 250,
      "wordCount": 50
    }
  ]
}
```

#### **CSV (.csv)**
```csv
Message Number,Text,Character Count,Word Count
1,"Nội dung tin nhắn...",250,50
2,"Nội dung tin nhắn...",300,60
```

### 🎯 Use Cases

#### **Backup hội thoại**
- Xuất toàn bộ hội thoại để lưu trữ
- Backup định kỳ các cuộc hội thoại quan trọng
- Lưu trữ lâu dài trên cloud storage

#### **Phân tích nội dung**
- Xuất CSV để phân tích trong Excel/Google Sheets
- Thống kê độ dài tin nhắn và từ khóa
- Phân tích pattern trong cuộc hội thoại

#### **Chia sẻ hội thoại**
- Xuất Markdown để chia sẻ trên GitHub
- Xuất Text để gửi qua email
- Xuất JSON để tích hợp với hệ thống khác

#### **Quản lý lịch sử**
- Xem lại tất cả tin nhắn đã gửi
- Tìm kiếm tin nhắn cũ
- Phân loại tin nhắn theo độ dài

### 🔧 Technical Details

- **Export Algorithm**: Sử dụng thuật toán xuất hiệu quả
- **File Generation**: Tạo file blob và download tự động
- **Memory Management**: Tối ưu hóa memory cho hội thoại dài
- **Performance**: Lazy loading và efficient processing
- **Compatibility**: Hỗ trợ tất cả trình duyệt hiện đại

### 🎨 Giao diện

#### **Export Panel**
- Modal popup ở giữa màn hình
- Thống kê hội thoại ở đầu
- Tùy chọn định dạng và cấu hình
- Preview nội dung trước khi xuất
- Progress bar khi đang xuất

#### **History Panel**
- Danh sách tin nhắn với thông tin chi tiết
- Tìm kiếm và lọc nâng cao
- Thống kê tổng quan
- Color coding theo độ dài tin nhắn

#### **Dark Mode**
- Tự động detect system theme
- Màu sắc tối ưu cho mắt
- Contrast cao để dễ đọc

### 🚨 Lưu ý

- Dữ liệu được xử lý local trên browser
- Không gửi dữ liệu lên server
- File được download trực tiếp về máy
- Hỗ trợ Unicode và emoji
- Extension chỉ hoạt động trên ChatGPT domain

### 🔄 Cập nhật

Extension sẽ tự động cập nhật khi có phiên bản mới. Tất cả cài đặt export sẽ được giữ nguyên.

---

**Enjoy your enhanced ChatGPT export and history experience! 📤📚✨**
