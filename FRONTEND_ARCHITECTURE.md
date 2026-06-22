# RULES CẤU TRÚC DỰ ÁN (React + TypeScript + Vite)

Tệp tin này đóng vai trò là kim chỉ nam về kiến trúc phần mềm cho toàn bộ mã nguồn Frontend (`react_service`). Mọi thay đổi hoặc bổ sung mã nguồn mới bắt buộc phải tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. Nguyên Tắc Tổng Quát

*   **Tách biệt UI và Logic (Separation of Concerns):**
    *   Các tệp `.tsx` trong thư mục `src/pages/` và `src/components/` **CHỈ** đảm nhận vai trò hiển thị giao diện (render UI).
    *   Toàn bộ State local phức tạp, Side-effect, Event Handler và lệnh gọi API phải được chuyển vào các Custom Hook tương ứng (đặt tại `src/features/<feature_name>/hooks/` hoặc `src/hooks/`).
    *   Component nhận dữ liệu & callback thông qua props hoặc thông qua việc sử dụng custom hook, tuyệt đối không tự thực hiện fetch API hay xử lý logic nghiệp vụ nặng trực tiếp bên trong component.
*   **CSS Tách Biệt (CSS Modules):**
    *   Không viết CSS inline trừ trường hợp giá trị style là động (ví dụ: chiều rộng tính theo tỉ lệ phần trăm dựa trên state thực tế).
    *   Sử dụng CSS Modules với phần mở rộng `.module.css` (cùng tên với component tương ứng).
    *   Các biến màu sắc, spacing, typography dùng chung phải được cấu hình tập trung trong `src/styles/variables.css` và sử dụng thông qua các CSS variables (ví dụ: `var(--accent-color)`).

---

## 2. Thứ Tự Ưu Tiên Khi Viết UI

Khi xây dựng giao diện mới hoặc chỉnh sửa giao diện cũ, hãy tuân theo thứ tự ưu tiên sau:

1.  **Component React chung đã có sẵn** trong `src/components/common/` (ví dụ: `<Button>`, `<Input>`, `<Card>`).
2.  **Component con nội bộ** trong thư mục `components/` của từng Page (nếu component đó chỉ phục vụ duy nhất cho Page đó).
3.  **Tự viết Component mới** bằng CSS module kết hợp Tailwind CSS (nếu cần thiết) và đưa vào thư mục thích hợp.
4.  **Hạn chế sử dụng thẻ HTML thuần** (ví dụ: `<button>`, `<input>`) trực tiếp trong các Page component. Hãy ưu tiên đóng gói chúng thành các UI component có kiểu dáng và hành vi đồng bộ.

---

## 3. Bản Đồ Thư Mục (Directory Structure)

```
src/
├── api/                          # Chứa API Client và endpoint định nghĩa thuần
│   ├── client.ts                 # Cấu hình Axios instance + Interceptors
│   └── endpoints/                # Các endpoint gọi API thuần (Chỉ chứa request/response)
│       ├── auth.api.ts
│       └── user.api.ts
│
├── assets/                       # Ảnh, font, các file tĩnh khác
│
├── components/                   # Component dùng chung toàn hệ thống
│   ├── ui/                       # shadcn components (nếu có, không sửa tay)
│   ├── common/                   # Button, Input, Modal, Background... dùng chung
│   └── layout/                   # Header, Sidebar, Footer, Layout chính
│
├── config/                       # Hằng số, cấu hình biến môi trường
│
├── features/                     # Logic nghiệp vụ (Tuyệt đối KHÔNG chứa UI)
│   └── auth/
│       ├── hooks/                # Custom hooks (useLogin.ts, useRegister.ts)
│       ├── services/             # auth.service.ts (Logic nghiệp vụ & trung gian API)
│       └── types/                # Type/interface cụ thể của nghiệp vụ auth
│
├── hooks/                        # Hook dùng chung toàn dự án (useDebounce, useClickOutside...)
│
├── pages/                        # Chỉ chứa mã nguồn UI hiển thị của các trang
│   ├── LoginPage/
│   │   ├── LoginPage.tsx         # Component trang đăng nhập (Chỉ chứa UI + gọi hook)
│   │   ├── LoginPage.module.css
│   │   ├── components/           # Component con chỉ dùng cho riêng trang này
│   │   └── index.ts              # Export mặc định
│   ├── RegisterPage/
│   │   ├── RegisterPage.tsx
│   │   ├── RegisterPage.module.css
│   │   └── index.ts
│   └── HelloPage/
│       ├── HelloPage.tsx
│       ├── HelloPage.module.css
│       └── index.ts
│
├── services/                     # Service không thuộc feature cụ thể (Ví dụ: socket.ts)
│
├── stores/                       # Quản lý Global State (Zustand)
│   ├── auth.store.ts             # Store lưu trữ thông tin đăng nhập, token
│   └── chat.store.ts
│
├── styles/                       # CSS tập trung toàn cục
│   ├── variables.css             # Định nghĩa màu, font, spacing dùng chung
│   ├── globals.css
│   └── reset.css
│
├── types/                        # Type dùng chung toàn dự án
└── utils/                        # Hàm thuần tiện ích (formatDate, validators...)
```

---

## 4. Quy Ước Đặt Tên (Naming Conventions)

*   **Component & Page:** `PascalCase.tsx` (ví dụ: `LoginPage.tsx`, `LoginForm.tsx`).
*   **Custom Hook:** `camelCase.ts` và luôn bắt đầu bằng tiền tố `use` (ví dụ: `useLogin.ts`).
*   **Service:** `<name>.service.ts` (ví dụ: `auth.service.ts`).
*   **Store:** `<name>.store.ts` (ví dụ: `auth.store.ts`).
*   **Type/Interface:** `<name>.types.ts` hoặc đặt trong thư mục `types/`.
*   **CSS Module:** `<ComponentName>.module.css`.
*   **Tệp phân phối phụ:** Tạo `index.ts` tại mỗi thư mục component chính để xuất (export) ra ngoài gọn gàng.

---

## 5. Luồng Dữ Liệu Chuẩn (Data Flow)

Mọi tương tác dữ liệu phải đi qua luồng tuần tự sau, nghiêm cấm nhảy cóc:

```
[Page Component (UI View)]
           ↓ gọi
[features/<name>/hooks/useXxx.ts] (Xử lý state, effects)
           ↓ gọi
[features/<name>/services/xxx.service.ts] (Nghiệp vụ, chuẩn bị payload)
           ↓ gọi
[api/endpoints/xxx.api.ts] (Gọi HTTP Request)
```

Component **KHÔNG** được tự ý gọi trực tiếp Service hay API Endpoint.

---

## 6. Hướng Dẫn Quản Lý State (Zustand & React State)

### Tránh trùng lặp State:
*   **Global State (Zustand):** Chỉ lưu trữ các dữ liệu mang tính toàn cục, cần chia sẻ xuyên suốt toàn bộ ứng dụng (ví dụ: trạng thái đăng nhập, thông tin `user` hiện tại, `token`, cấu hình giao diện tối/sáng).
*   **Local State (`useState` trong Hook):** Chỉ dùng cho các dữ liệu mang tính cục bộ của Form, trạng thái đóng mở Modal, dữ liệu tạm thời của đầu vào người dùng trước khi submit.

### Ví dụ về Zustand Store (`src/stores/auth.store.ts`):
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email?: string
  phone?: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)
```
