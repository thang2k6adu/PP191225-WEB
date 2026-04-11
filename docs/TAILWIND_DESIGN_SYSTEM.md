# Hướng Dẫn Sử Dụng Design System - Tailwind CSS

Tài liệu này mô tả các thuộc tính CSS đã được định nghĩa sẵn trong dự án thông qua Tailwind CSS configuration. Sử dụng các class này để đảm bảo tính nhất quán trong thiết kế.

## 🎨 Màu Sắc (Colors)

### Gray Scale

Hệ thống màu xám từ đen đến trắng với 12 độ đậm nhạt:

| Class                               | Hex Code  | Mô tả          |
| ----------------------------------- | --------- | -------------- |
| `bg-gray-black` / `text-gray-black` | `#000000` | Đen thuần      |
| `bg-gray-900` / `text-gray-900`     | `#121315` | Đen tối nhất   |
| `bg-gray-800` / `text-gray-800`     | `#1C1D1F` | Đen đậm        |
| `bg-gray-700` / `text-gray-700`     | `#232426` | Xám tối        |
| `bg-gray-600` / `text-gray-600`     | `#323335` | Xám đậm        |
| `bg-gray-500` / `text-gray-500`     | `#545556` | Xám trung tính |
| `bg-gray-400` / `text-gray-400`     | `#858586` | Xám sáng       |
| `bg-gray-300` / `text-gray-300`     | `#B6B6B7` | Xám rất sáng   |
| `bg-gray-200` / `text-gray-200`     | `#CECECF` | Xám nhạt       |
| `bg-gray-100` / `text-gray-100`     | `#E7E7E7` | Xám cực nhạt   |
| `bg-gray-50` / `text-gray-50`       | `#F3F3F3` | Gần trắng      |
| `bg-gray-white` / `text-gray-white` | `#FFFFFF` | Trắng thuần    |

**Ví dụ:**

```jsx
// Background màu xám đậm với text trắng
<div className="bg-gray-800 text-gray-white p-4">
  Dark card
</div>

// Border màu xám nhạt
<button className="border border-gray-200">
  Button
</button>
```

### Primary Colors (Màu Chính)

Màu chính của ứng dụng - sắc tím:

| Class                                 | Hex Code     | Mô tả                            |
| ------------------------------------- | ------------ | -------------------------------- |
| `bg-primary-900` / `text-primary-900` | `#5F33E1`    | Tím đậm (màu chính)              |
| `bg-primary-800` / `text-primary-800` | `#AB94FF`    | Tím sáng (hover state)           |
| `bg-primary-700` / `text-primary-700` | `#EEE9FF`    | Tím rất nhạt (background)        |
| `bg-primary` / `text-primary`         | CSS Variable | Màu primary mặc định (shadcn/ui) |

**Ví dụ:**

```jsx
// Button primary
<button className="bg-primary-900 hover:bg-primary-800 text-white px-4 py-2">
  Primary Action
</button>

// Background nhạt cho card
<div className="bg-primary-700 p-4">
  Highlighted content
</div>
```

### Secondary Colors (Màu Phụ)

Màu thứ hai - sắc hồng:

| Class                                     | Hex Code     | Mô tả                              |
| ----------------------------------------- | ------------ | ---------------------------------- |
| `bg-secondary-900` / `text-secondary-900` | `#F478B8`    | Hồng đậm                           |
| `bg-secondary-700` / `text-secondary-700` | `#FAD1E4`    | Hồng nhạt                          |
| `bg-secondary` / `text-secondary`         | CSS Variable | Màu secondary mặc định (shadcn/ui) |

**Ví dụ:**

```jsx
// Badge hoặc tag
<span className="bg-secondary-900 text-white px-2 py-1 rounded">
  New
</span>

// Background highlight
<div className="bg-secondary-700">
  Secondary highlight
</div>
```

### Accent Colors (Màu Nhấn)

Màu nhấn - sắc cam:

| Class                               | Hex Code     | Mô tả                           |
| ----------------------------------- | ------------ | ------------------------------- |
| `bg-accent-900` / `text-accent-900` | `#FF7D53`    | Cam đậm                         |
| `bg-accent-700` / `text-accent-700` | `#FFE9E1`    | Cam nhạt                        |
| `bg-accent` / `text-accent`         | CSS Variable | Màu accent mặc định (shadcn/ui) |

**Ví dụ:**

```jsx
// Warning hoặc notification
<div className="bg-accent-700 border-l-4 border-accent-900 p-4">
  <p className="text-accent-900">Important notice</p>
</div>
```

### Shadcn/UI System Colors

Các màu được định nghĩa thông qua CSS variables:

- `bg-background` / `text-foreground` - Màu nền và chữ chính
- `bg-card` / `text-card-foreground` - Màu cho card components
- `bg-popover` / `text-popover-foreground` - Màu cho popover/dropdown
- `bg-muted` / `text-muted-foreground` - Màu cho text phụ
- `bg-destructive` / `text-destructive-foreground` - Màu cho actions nguy hiểm
- `border-border` - Màu viền
- `ring-ring` - Màu focus ring

## ✏️ Typography (Kiểu Chữ)

### Font Family

Font mặc định: **Poppins** (fallback: system-ui, sans-serif)

```jsx
// Mặc định đã áp dụng cho toàn bộ app
<p className="font-sans">Text with Poppins font</p>
```

### Heading Styles (H1 - H6)

Mỗi cấp heading có 4 variants: `regular`, `medium`, `semi`, `bold`

#### H1 - 48px

| Class             | Font Weight | Line Height |
| ----------------- | ----------- | ----------- |
| `text-h1-regular` | 400         | 58px        |
| `text-h1-medium`  | 500         | 58px        |
| `text-h1-semi`    | 600         | 58px        |
| `text-h1-bold`    | 700         | 58px        |

#### H2 - 40px

| Class             | Font Weight | Line Height |
| ----------------- | ----------- | ----------- |
| `text-h2-regular` | 400         | 50px        |
| `text-h2-medium`  | 500         | 50px        |
| `text-h2-semi`    | 600         | 50px        |
| `text-h2-bold`    | 700         | 50px        |

#### H3 - 33px

| Class             | Font Weight | Line Height |
| ----------------- | ----------- | ----------- |
| `text-h3-regular` | 400         | 43px        |
| `text-h3-medium`  | 500         | 43px        |
| `text-h3-semi`    | 600         | 43px        |
| `text-h3-bold`    | 700         | 43px        |

#### H4 - 28px

| Class             | Font Weight | Line Height |
| ----------------- | ----------- | ----------- |
| `text-h4-regular` | 400         | 36px        |
| `text-h4-medium`  | 500         | 36px        |
| `text-h4-semi`    | 600         | 36px        |
| `text-h4-bold`    | 700         | 36px        |

#### H5 - 23px

| Class             | Font Weight | Line Height |
| ----------------- | ----------- | ----------- |
| `text-h5-regular` | 400         | 30px        |
| `text-h5-medium`  | 500         | 30px        |
| `text-h5-semi`    | 600         | 30px        |
| `text-h5-bold`    | 700         | 30px        |

#### H6 - 19px

| Class             | Font Weight | Line Height |
| ----------------- | ----------- | ----------- |
| `text-h6-regular` | 400         | 25px        |
| `text-h6-medium`  | 500         | 25px        |
| `text-h6-semi`    | 600         | 25px        |
| `text-h6-bold`    | 700         | 25px        |

**Ví dụ:**

```jsx
<h1 className="text-h1-bold text-gray-900">
  Main Page Title
</h1>

<h2 className="text-h2-semi text-gray-800">
  Section Title
</h2>

<h3 className="text-h3-medium text-gray-700">
  Subsection Title
</h3>
```

### Body Text - 16px

| Class               | Font Weight | Line Height |
| ------------------- | ----------- | ----------- |
| `text-body-regular` | 400         | 24px        |
| `text-body-medium`  | 500         | 24px        |
| `text-body-semi`    | 600         | 24px        |
| `text-body-bold`    | 700         | 24px        |

**Ví dụ:**

```jsx
<p className="text-body-regular text-gray-600">
  Regular paragraph text for main content.
</p>

<p className="text-body-semi text-gray-900">
  Emphasized text with semi-bold weight.
</p>
```

### Caption Large - 13px

| Class                     | Font Weight | Line Height |
| ------------------------- | ----------- | ----------- |
| `text-caption-lg-regular` | 400         | 18px        |
| `text-caption-lg-medium`  | 500         | 18px        |
| `text-caption-lg-semi`    | 600         | 18px        |
| `text-caption-lg-bold`    | 700         | 18px        |

**Ví dụ:**

```jsx
<span className="text-caption-lg-regular text-gray-500">
  Helper text or labels
</span>
```

### Caption Small - 11px

| Class                     | Font Weight | Line Height |
| ------------------------- | ----------- | ----------- |
| `text-caption-sm-regular` | 400         | 15px        |
| `text-caption-sm-medium`  | 500         | 15px        |
| `text-caption-sm-semi`    | 600         | 15px        |
| `text-caption-sm-bold`    | 700         | 15px        |

**Ví dụ:**

```jsx
<span className="text-caption-sm-regular text-gray-400">
  Metadata or timestamps
</span>
```

### Caption Extra Small - 9px

| Class                     | Font Weight | Line Height |
| ------------------------- | ----------- | ----------- |
| `text-caption-xs-regular` | 400         | 12px        |
| `text-caption-xs-medium`  | 500         | 12px        |
| `text-caption-xs-semi`    | 600         | 12px        |
| `text-caption-xs-bold`    | 700         | 12px        |

**Ví dụ:**

```jsx
<span className="text-caption-xs-regular text-gray-400">
  Tiny labels or badges
</span>
```

## 🎭 Effects

### Box Shadow

| Class       | CSS Value                  | Mô tả                             |
| ----------- | -------------------------- | --------------------------------- |
| `shadow-md` | `0 0 8px rgba(0,0,0,0.15)` | Bóng mờ vừa phải cho cards/modals |

**Ví dụ:**

```jsx
<div className="bg-white shadow-md rounded-lg p-4">Card with medium shadow</div>
```

### Border Radius

Border radius được định nghĩa thông qua CSS variables:

| Class        | CSS Value                   | Mô tả      |
| ------------ | --------------------------- | ---------- |
| `rounded-lg` | `var(--radius)`             | Bo góc lớn |
| `rounded-md` | `calc(var(--radius) - 2px)` | Bo góc vừa |
| `rounded-sm` | `calc(var(--radius) - 4px)` | Bo góc nhỏ |

**Ví dụ:**

```jsx
// Button với bo góc medium
<button className="bg-primary-900 text-white px-4 py-2 rounded-md">
  Click me
</button>

// Card với bo góc large
<div className="bg-white shadow-md rounded-lg p-6">
  Card content
</div>
```

## 🎯 Dark Mode

Dark mode được kích hoạt thông qua class `dark`:

```jsx
// Element thay đổi màu theo dark mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-white">
  Content that adapts to dark mode
</div>
```

## 📋 Best Practices

### 1. Sử dụng màu nhất quán

```jsx
// ✅ Tốt - Sử dụng các màu đã định nghĩa
<button className="bg-primary-900 hover:bg-primary-800">
  Submit
</button>

// ❌ Tránh - Tự định nghĩa màu mới
<button className="bg-[#5F33E1] hover:bg-[#AB94FF]">
  Submit
</button>
```

### 2. Sử dụng typography scale

```jsx
// ✅ Tốt - Sử dụng các class text đã định nghĩa
<h1 className="text-h1-bold">Title</h1>
<p className="text-body-regular">Description</p>

// ❌ Tránh - Tự định nghĩa font size
<h1 className="text-[48px] font-bold leading-[58px]">Title</h1>
```

### 3. Hierarchy màu sắc

- **Primary (900)**: Actions chính, buttons quan trọng
- **Primary (800)**: Hover states
- **Primary (700)**: Backgrounds nhẹ, highlights
- **Gray scale**: Text, borders, backgrounds phụ
- **Secondary/Accent**: Để nhấn mạnh và tạo điểm nhấn

### 4. Text colors

```jsx
// Hierarchy của text
<h1 className="text-gray-900">Main heading</h1>
<p className="text-gray-700">Body text</p>
<span className="text-gray-500">Helper text</span>
<small className="text-gray-400">Metadata</small>
```

## 🔧 Responsive Design

Kết hợp với Tailwind responsive prefixes:

```jsx
<h1 className="text-h4-bold md:text-h3-bold lg:text-h2-bold">
  Responsive heading
</h1>

<div className="p-4 md:p-6 lg:p-8 bg-primary-700 md:bg-secondary-700">
  Responsive padding and colors
</div>
```

## 📦 Component Examples

### Card Component

```jsx
<div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
  <h3 className="text-h5-semi text-gray-900 dark:text-gray-white mb-2">
    Card Title
  </h3>
  <p className="text-body-regular text-gray-600 dark:text-gray-300">
    Card description text goes here.
  </p>
  <button className="mt-4 bg-primary-900 hover:bg-primary-800 text-white px-4 py-2 rounded-md">
    Action
  </button>
</div>
```

### Form Input

```jsx
<div className="space-y-2">
  <label className="text-caption-lg-semi text-gray-700">Email Address</label>
  <input
    type="email"
    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 ring-primary-900 outline-none"
    placeholder="Enter your email"
  />
  <span className="text-caption-sm-regular text-gray-500">
    We'll never share your email.
  </span>
</div>
```

### Alert Component

```jsx
<div className="bg-accent-700 border-l-4 border-accent-900 p-4 rounded-md">
  <h4 className="text-body-semi text-accent-900 mb-1">Warning</h4>
  <p className="text-caption-lg-regular text-gray-700">
    Please review your information before submitting.
  </p>
</div>
```

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)
- Project file: `tailwind.config.js`
