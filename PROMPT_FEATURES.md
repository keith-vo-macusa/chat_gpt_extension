# ChatGPT Message Navigator - Prompt Management Features

## Tính năng mới: Quản lý Prompt

Extension đã được nâng cấp với tính năng quản lý prompt mạnh mẽ, cho phép bạn lưu trữ, quản lý và sử dụng lại các prompt yêu thích.

### 🚀 Tính năng chính

#### 1. **CRUD Operations cho Prompt**
- ✅ **Create**: Tạo prompt mới với title, content, category và tags
- ✅ **Read**: Xem danh sách tất cả prompt với tìm kiếm và lọc
- ✅ **Update**: Chỉnh sửa prompt hiện có
- ✅ **Delete**: Xóa prompt không cần thiết

#### 2. **Quản lý Category**
- 📁 Phân loại prompt theo category (General, Coding, Writing, Analysis, Creative)
- 🎨 Mỗi category có màu sắc riêng để dễ nhận biết
- ➕ Tạo category mới tùy chỉnh

#### 3. **Tìm kiếm và Lọc**
- 🔍 Tìm kiếm theo title, content hoặc tags
- 🏷️ Lọc theo category
- 📅 Sắp xếp theo thời gian cập nhật

#### 4. **Injection vào Chat**
- 💉 Click vào prompt để tự động điền vào input field
- 🎯 Hỗ trợ cả textarea và contenteditable elements
- ✨ Feedback thông báo khi injection thành công

#### 5. **Import/Export**
- 📤 Export tất cả prompt ra file JSON
- 📥 Import prompt từ file JSON
- 🔄 Backup và restore dữ liệu

### 🎮 Cách sử dụng

#### **Mở Prompt Manager**
- Click vào nút **📝** (màu tím) trên floating panel
- Hoặc sử dụng phím tắt **Ctrl+P**

#### **Tạo Prompt mới**
1. Click "**+ Create New Prompt**"
2. Điền thông tin:
   - **Title**: Tên prompt (ví dụ: "Code Review")
   - **Content**: Nội dung prompt
   - **Category**: Chọn category phù hợp
   - **Tags**: Các tag phân cách bằng dấu phẩy
3. Click "**Create**"

#### **Sử dụng Prompt**
1. Click vào title của prompt trong danh sách
2. Prompt sẽ được tự động điền vào input field của ChatGPT
3. Bạn có thể chỉnh sửa trước khi gửi

#### **Quản lý Prompt**
- **Edit**: Click nút ✏️ để chỉnh sửa
- **Delete**: Click nút 🗑️ để xóa
- **Search**: Gõ từ khóa vào ô tìm kiếm
- **Filter**: Chọn category từ dropdown

### ⌨️ Phím tắt

| Phím tắt | Chức năng |
|----------|-----------|
| `Ctrl+P` | Mở/đóng Prompt Manager |
| `Ctrl+F` | Tìm kiếm messages |
| `Ctrl+E` | Mở Message History |
| `Ctrl+S` | Mở Statistics |
| `Ctrl+↑` | Message trước |
| `Ctrl+↓` | Message tiếp theo |
| `Ctrl+C` | Copy message hiện tại |
| `Ctrl+Home` | Message đầu tiên |
| `Ctrl+End` | Message cuối cùng |
| `Esc` | Đóng tất cả panels |

### 📁 Cấu trúc dữ liệu

#### Prompt Object
```typescript
interface Prompt {
  id: string           // Unique identifier
  title: string        // Prompt title
  content: string      // Prompt content
  category: string     // Category ID
  createdAt: string    // Creation timestamp
  updatedAt: string    // Last update timestamp
  tags: string[]       // Array of tags
}
```

#### Category Object
```typescript
interface PromptCategory {
  id: string          // Category ID
  name: string        // Category name
  color: string       // Hex color code
}
```

### 🔧 Technical Details

- **Storage**: Sử dụng localStorage để lưu trữ local
- **Injection**: Tự động detect và inject vào ChatGPT input field
- **Compatibility**: Hỗ trợ cả light và dark mode
- **Performance**: Lazy loading và efficient search

### 🎯 Use Cases

#### **Developers**
- Code review prompts
- Debugging assistance
- API documentation requests
- Code generation templates

#### **Writers**
- Article outlines
- Creative writing prompts
- Editing checklists
- Research questions

#### **Students**
- Study questions
- Essay prompts
- Problem-solving templates
- Research queries

#### **Business**
- Email templates
- Meeting agendas
- Report structures
- Analysis frameworks

### 🚨 Lưu ý

- Dữ liệu được lưu local trên browser của bạn
- Không cần internet để sử dụng prompt đã lưu
- Có thể export/import để backup hoặc chia sẻ
- Extension chỉ hoạt động trên ChatGPT domain

### 🔄 Cập nhật

Extension sẽ tự động cập nhật khi có phiên bản mới. Dữ liệu prompt sẽ được giữ nguyên.

---

**Enjoy your enhanced ChatGPT experience! 🎉**
