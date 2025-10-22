# Code Minifier Feature

Tính năng Code Minifier giúp tối ưu hóa code HTML, PHP, CSS, JS, TS, Laravel,... để giảm kích thước prompt và tối ưu hiệu suất.

## 🚀 Tính năng chính

### 1. Hỗ trợ nhiều loại code
- **HTML**: Loại bỏ comments, whitespace, tối ưu tags
- **CSS**: Minify CSS, loại bỏ comments và whitespace
- **JavaScript/TypeScript**: Minify JS/TS, loại bỏ comments
- **PHP**: Minify PHP code, loại bỏ comments
- **Laravel Blade**: Minify Blade templates
- **JSON**: Minify JSON objects

### 2. Phím tắt nhanh
- **Ctrl + M**: Mở Code Minifier panel
- **Ctrl + M** (trong panel): Minify code ngay lập tức

### 3. Tự động phát hiện loại code
Extension tự động phát hiện loại code dựa trên:
- Cú pháp đặc trưng của từng ngôn ngữ
- Các keywords và patterns
- Cấu trúc code

### 4. Tùy chọn minification
- ✅ Remove Comments
- ✅ Remove Whitespace
- ✅ Remove Empty Lines
- ✅ Preserve Strings
- ✅ Minify HTML
- ✅ Minify CSS
- ✅ Minify JS

### 5. Thống kê minification
- Kích thước gốc (Original Size)
- Kích thước sau minify (Minified Size)
- Số ký tự giảm (Reduction)
- Phần trăm giảm (Percentage)

## 🎯 Cách sử dụng

### Cách 1: Sử dụng phím tắt
1. Chọn text code cần minify (hoặc để trống để lấy nội dung input)
2. Nhấn **Ctrl + M**
3. Panel Code Minifier sẽ mở với code đã được load
4. Điều chỉnh tùy chọn minification nếu cần
5. Nhấn **Minify** hoặc **Ctrl + M** để minify
6. Copy kết quả minified

### Cách 2: Sử dụng nút UI
1. Click vào nút **Code Minifier** (biểu tượng checkmark) trên panel
2. Paste code vào ô "Original Code"
3. Điều chỉnh tùy chọn
4. Nhấn **Minify**
5. Copy kết quả

## 📊 Ví dụ minification

### HTML Example
```html
<!-- Original -->
<div class="container">
    <h1>Hello World</h1>
    <p>This is a paragraph</p>
</div>

<!-- Minified -->
<div class="container"><h1>Hello World</h1><p>This is a paragraph</p></div>
```

### CSS Example
```css
/* Original */
.container {
    margin: 20px;
    padding: 10px;
    background-color: #f0f0f0;
}

/* Minified */
.container{margin:20px;padding:10px;background-color:#f0f0f0}
```

### JavaScript Example
```javascript
// Original
function calculateSum(a, b) {
    // This function adds two numbers
    return a + b;
}

// Minified
function calculateSum(a,b){return a+b}
```

## ⚙️ Cấu hình

### Tùy chọn minification
- **Remove Comments**: Loại bỏ tất cả comments
- **Remove Whitespace**: Loại bỏ khoảng trắng thừa
- **Remove Empty Lines**: Loại bỏ dòng trống
- **Preserve Strings**: Giữ nguyên nội dung trong dấu ngoặc kép
- **Minify HTML**: Bật minify cho HTML
- **Minify CSS**: Bật minify cho CSS
- **Minify JS**: Bật minify cho JavaScript

### Keyboard Shortcuts
- `Ctrl + M`: Mở Code Minifier
- `Ctrl + M` (trong panel): Minify code
- `Ctrl + C`: Copy code (trong textarea)

## 🔧 Technical Details

### Code Detection Algorithm
1. **HTML**: Tìm tags HTML và structure
2. **PHP**: Tìm `<?php`, `<?=`, `<?` tags
3. **CSS**: Tìm `{}`, `:` patterns
4. **JS/TS**: Tìm `function`, `const`, `let`, `var`, `=>`, `import`
5. **Blade**: Tìm `@` directives
6. **JSON**: Kiểm tra `{}` structure

### Minification Process
1. Detect code type
2. Apply type-specific minification rules
3. Remove comments (if enabled)
4. Remove whitespace (if enabled)
5. Remove empty lines (if enabled)
6. Optimize syntax
7. Calculate statistics

## 🎨 UI Components

### Code Minifier Panel
- **Header**: Title + Code type badge + Close button
- **Options Section**: Checkboxes for minification options
- **Content Section**:
  - Original Code textarea (editable)
  - Minified Code textarea (read-only)
- **Stats Section**: Minification statistics
- **Controls**: Copy buttons + Minify button

### Navigation Button
- **Icon**: Checkmark with lines (minimize symbol)
- **Color**: Blue (#3b82f6)
- **Tooltip**: "Code Minifier - Ctrl+M"
- **Position**: Feature buttons group

## 🚀 Performance

### Optimization Benefits
- **Reduced prompt size**: Giảm kích thước prompt đáng kể
- **Faster processing**: Code ngắn gọn hơn, xử lý nhanh hơn
- **Better readability**: Loại bỏ code thừa, tập trung vào logic chính
- **Cost savings**: Ít tokens hơn = chi phí thấp hơn

### Statistics Tracking
- Real-time size calculation
- Percentage reduction display
- Character count comparison
- Visual progress indicators

## 🔮 Future Enhancements

### Planned Features
- [ ] Syntax highlighting trong textarea
- [ ] Multiple file support
- [ ] Batch minification
- [ ] Custom minification rules
- [ ] Export minified code to file
- [ ] Integration với code editors
- [ ] Advanced compression algorithms
- [ ] Code beautification (reverse minification)

### Advanced Options
- [ ] Preserve specific comments
- [ ] Custom regex patterns
- [ ] Language-specific optimizations
- [ ] Performance metrics
- [ ] Code quality analysis

## 📝 Changelog

### v1.0.0 - Initial Release
- ✅ Basic code minification
- ✅ Multi-language support (HTML, CSS, JS, PHP, Blade, JSON)
- ✅ Keyboard shortcuts (Ctrl+M)
- ✅ UI panel với options
- ✅ Statistics tracking
- ✅ Auto code detection
- ✅ Copy to clipboard
- ✅ Theme support (light/dark)

---

**Lưu ý**: Tính năng Code Minifier được thiết kế để tối ưu hóa code cho việc sử dụng trong ChatGPT prompts. Hãy kiểm tra kỹ code sau khi minify để đảm bảo tính chính xác.
