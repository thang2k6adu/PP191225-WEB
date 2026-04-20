# Coding Guide - Workflow cho Feature Development

Hướng dẫn chi tiết về workflow code khi implement một feature mới trong React Boilerplate.

## 📋 Mục Lục

1. [Tổng Quan Workflow](#tổng-quan-workflow)
2. [Chi Tiết Từng Bước](#chi-tiết-từng-bước)
3. [Ví Dụ Cụ Thể: User Management Feature](#ví-dụ-cụ-thể-user-management-feature)
4. [Best Practices](#best-practices)
5. [Checklist](#checklist)

---

## 🎯 Tổng Quan Workflow

Khi implement một feature mới, hãy làm theo thứ tự sau:

```
1. Types (TypeScript Interfaces)
   ↓
2. Constants (API Endpoints, Routes)
   ↓
3. Service Layer (API Calls)
   ↓
4. Redux Thunks (Async Actions)
   ↓
4.5 Redux Cache Strategy
  ↓
5. Redux Slice (State Management)
   ↓
6. Custom Hooks (Optional - để dùng dễ hơn)
   ↓
7. Components (Reusable UI)
   ↓
8. Pages (Page Components)
   ↓
9. Routes (Routing)
   ↓
10. i18n Translations (Optional)
```

---

## 📝 Chi Tiết Từng Bước

### BƯỚC 1: Định nghĩa Types (TypeScript Interfaces)

**📍 Location:** `src/types/[featureName].ts`

**Mục đích:** Định nghĩa tất cả TypeScript interfaces/types cho feature

**Cấu trúc:**

```typescript
// src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  // ... các fields khác
}

export interface CreateUserData {
  name: string;
  email: string;
  // ... các fields khác
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  // ... các fields optional
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}
```

**⚠️ Lưu ý:**

- Export types trong `src/types/index.ts`:

```typescript
export * from './auth';
export * from './user'; // Thêm dòng này
```

---

### BƯỚC 2: Thêm API Endpoints vào Constants

**📍 Location:** `src/constants/index.ts`

**Mục đích:** Định nghĩa API endpoints và routes

**Cấu trúc:**

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    // ...
  },
  USERS: {
    // Thêm mới
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  // ...
  USERS: '/users', // Thêm route mới
} as const;
```

---

### BƯỚC 3: Tạo Service Layer (API Calls)

**📍 Location:** `src/services/[featureName]Service.ts`

**Mục đích:** Tách biệt logic gọi API, dễ test và maintain

**Cấu trúc:**

```typescript
import apiClient from '@/utils/api';
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserListResponse,
} from '@/types/user';
import { API_ENDPOINTS } from '@/constants';

export const userService = {
  // Get all users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>(
      API_ENDPOINTS.USERS.LIST,
      { params }
    );
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(
      API_ENDPOINTS.USERS.DETAIL(id)
    );
    return response.data;
  },

  // Create user
  createUser: async (data: CreateUserData): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(
      API_ENDPOINTS.USERS.CREATE,
      data
    );
    return response.data;
  },

  // Update user
  updateUser: async (
    id: string,
    data: UpdateUserData
  ): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },
};
```

**⚠️ Lưu ý:**

- Luôn sử dụng `apiClient` từ `@/utils/api` (đã có interceptors)
- Luôn type rõ ràng cho request/response
- Handle errors ở thunks, không handle ở service

---

### BƯỚC 4: Tạo Redux Thunks (Async Actions)

**📍 Location:** `src/store/thunks/[featureName]Thunks.ts`

**Mục đích:** Xử lý async actions với Redux Toolkit

**Cấu trúc:**

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { userService } from '@/services/userService';
import { CreateUserData, UpdateUserData, UserListResponse } from '@/types/user';

export interface FetchUsersArgs {
  page?: number;
  limit?: number;
  search?: string;
  force?: boolean;
  ttlMs?: number;
}

const getUsersParamsKey = (args?: FetchUsersArgs): string =>
  JSON.stringify({
    page: args?.page ?? 1,
    limit: args?.limit ?? 10,
    search: args?.search ?? '',
  });

// Fetch users with TTL cache guard
export const fetchUsersThunk = createAsyncThunk<
  UserListResponse,
  FetchUsersArgs | undefined,
  { rejectValue: string; state: RootState }
>(
  'user/fetchUsers',
  async (args, { rejectWithValue }) => {
    try {
      return await userService.getUsers({
        page: args?.page,
        limit: args?.limit,
        search: args?.search,
      });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  },
  {
    condition: (args, { getState }) => {
      const state = getState().user;

      if (args?.force || state.isInvalidated) return true;
      if (state.isLoading) return false;
      if (state.users.length === 0 || !state.lastFetchedAt) return true;
      if (state.lastParamsKey !== getUsersParamsKey(args)) return true;

      const effectiveTtlMs = args?.ttlMs ?? state.ttlMs;
      return Date.now() - state.lastFetchedAt >= effectiveTtlMs;
    },
  }
);

// Create user
export const createUserThunk = createAsyncThunk<
  UserResponse,
  CreateUserData,
  { rejectValue: string }
>('user/createUser', async (data, { rejectWithValue }) => {
  try {
    return await userService.createUser(data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create user'
    );
  }
});

// Update user
export const updateUserThunk = createAsyncThunk<
  UserResponse,
  { id: string; data: UpdateUserData },
  { rejectValue: string }
>('user/updateUser', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await userService.updateUser(id, data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update user'
    );
  }
});

// Delete user
export const deleteUserThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await userService.deleteUser(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete user'
    );
  }
});
```

**⚠️ Lưu ý:**

- Export trong `src/store/thunks/index.ts`:

```typescript
export * from './authThunks';
export * from './userThunks'; // Thêm dòng này
```

- Với mọi thunk fetch list, luôn có args phân trang (`page`, `limit`) và cache control (`force`, `ttlMs`)
- Sử dụng `condition` của `createAsyncThunk` để skip network call khi cache còn hạn
- Normalize params key bằng giá trị default (`page = 1`, `limit = 10`) để tránh cache miss giả

---

### BƯỚC 4.5: Chuẩn Cache Ở Redux (Bắt buộc cho list fetch)

**Mục đích:** Tránh gọi API lại khi navigate trong SPA nhưng vẫn đảm bảo dữ liệu mới khi cần

**4 trường chuẩn phải có trong state list:**

- `lastFetchedAt`: thời điểm fetch thành công gần nhất
- `lastParamsKey`: key của bộ query gần nhất (page/limit/search...)
- `ttlMs`: thời gian cache sống
- `isInvalidated`: cờ đánh dấu cần fetch lại sau mutation

**Cơ chế hoạt động:**

1. Page/component vẫn có thể gọi `fetchList()` khi mount
2. Thunk `condition` quyết định có gọi API thật hay không
3. Nếu cache hit trong TTL, thunk bị skip (không gọi API)
4. Mutation (create/update/delete/activate/complete...) phải set `isInvalidated = true`
5. Fetch thành công sẽ reset `isInvalidated = false` và cập nhật metadata cache

---

### BƯỚC 5: Tạo Redux Slice (State Management)

**📍 Location:** `src/store/slices/[featureName]Slice.ts`

**Mục đích:** Quản lý state của feature với Redux Toolkit

**Cấu trúc:**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from '../thunks/userThunks';

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  lastFetchedAt: number | null;
  lastParamsKey: string | null;
  ttlMs: number;
  isInvalidated: boolean;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  lastFetchedAt: null,
  lastParamsKey: null,
  ttlMs: 60_000,
  isInvalidated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch users
    builder
      .addCase(fetchUsersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data.items;
        state.total = action.payload.data.meta.totalItems;
        state.page = action.payload.data.meta.currentPage;
        state.limit = action.payload.data.meta.itemsPerPage;
        state.lastFetchedAt = Date.now();
        state.lastParamsKey = JSON.stringify({
          page: action.meta.arg?.page ?? 1,
          limit: action.meta.arg?.limit ?? 10,
          search: action.meta.arg?.search ?? '',
        });
        state.ttlMs = action.meta.arg?.ttlMs ?? state.ttlMs;
        state.isInvalidated = false;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      });

    // Create user
    builder.addCase(createUserThunk.fulfilled, (state, action) => {
      state.users.push(action.payload.data);
      state.isInvalidated = true;
    });

    // Update user
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.data.id);
      if (index !== -1) {
        state.users[index] = action.payload.data;
      }
      state.isInvalidated = true;
    });

    // Delete user
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
      state.isInvalidated = true;
    });
  },
});

export const { clearError, setPage } = userSlice.actions;
export default userSlice.reducer;
```

**⚠️ Lưu ý:**

- Đăng ký slice trong `src/store/index.ts`:

```typescript
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    user: userReducer, // Thêm dòng này
  },
});
```

---

### BƯỚC 6: Tạo Custom Hook (Optional)

**📍 Location:** `src/hooks/use[FeatureName].ts`

**Mục đích:** Tạo custom hook để dùng dễ hơn trong components

**Cấu trúc:**

```typescript
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from '@/store/thunks/userThunks';
import { CreateUserData, UpdateUserData } from '@/types/user';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, currentUser, isLoading, error, total, page, limit } =
    useAppSelector(state => state.user);

  const isConditionSkip = (action: { meta?: { condition?: boolean } }) =>
    Boolean(action.meta?.condition);

  const fetchUsers = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      const result = await dispatch(fetchUsersThunk(params));
      if (fetchUsersThunk.rejected.match(result) && !isConditionSkip(result)) {
        toast.error(result.payload || 'Failed to fetch users');
      }
      return result;
    },
    [dispatch]
  );

  const fetchUserById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchUserByIdThunk(id));
      if (fetchUserByIdThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch user');
      }
      return result;
    },
    [dispatch]
  );

  const createUser = useCallback(
    async (data: CreateUserData) => {
      const result = await dispatch(createUserThunk(data));
      if (createUserThunk.fulfilled.match(result)) {
        toast.success('User created successfully!');
      } else if (createUserThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to create user');
      }
      return result;
    },
    [dispatch]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserData) => {
      const result = await dispatch(updateUserThunk({ id, data }));
      if (updateUserThunk.fulfilled.match(result)) {
        toast.success('User updated successfully!');
      } else if (updateUserThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to update user');
      }
      return result;
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteUserThunk(id));
      if (deleteUserThunk.fulfilled.match(result)) {
        toast.success('User deleted successfully!');
      } else if (deleteUserThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to delete user');
      }
      return result;
    },
    [dispatch]
  );

  return {
    users,
    currentUser,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
```

**⚠️ Lưu ý:**

- **Luôn sử dụng `useAppDispatch` và `useAppSelector` từ `@/store/hooks`** thay vì `useDispatch` và `useSelector` trực tiếp (để có type safety tốt hơn)
- Hook này optional, nhưng nên dùng để code gọn hơn
- Sử dụng `useCallback` để tránh re-render không cần thiết
- **Xử lý toast notifications trong hook** để hiển thị success/error messages cho user
- Sử dụng `.fulfilled.match()` và `.rejected.match()` để check kết quả của thunk
- Với thunk có `condition`, không hiển thị toast lỗi khi action bị skip do cache hit (`meta.condition === true`)
- Toast messages nên user-friendly và informative

---

### BƯỚC 7: Tạo Components (Reusable UI)

**📍 Location:** `src/components/[ComponentName].tsx`

**Mục đích:** Tạo các component tái sử dụng được

**Ví dụ: UserList Component**

```typescript
import React, { useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import Table from './Table';
import LoadingSpinner from './LoadingSpinner';

const UserList: React.FC = () => {
  const { users, isLoading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return <Table data={users} columns={columns} />;
};

export default UserList;
```

**⚠️ Lưu ý:**

- Components nên nhỏ, focused vào một nhiệm vụ
- Sử dụng các components có sẵn (Button, Input, Modal, Card, Table)
- Handle loading và error states

---

### BƯỚC 8: Tạo Page Component

**📍 Location:** `src/pages/[PageName].tsx`

**Mục đích:** Tạo page component chính cho feature

**Cấu trúc:**

```typescript
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useUsers } from '@/hooks/useUsers';
import UserList from '@/components/UserList';
import UserForm from '@/components/UserForm';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

const Users: React.FC = () => {
  const { t } = useTranslation();
  const { createUser, updateUser, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingUserId(id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingUserId) {
        await updateUser(editingUserId, data);
      } else {
        await createUser(data);
      }
      setIsModalOpen(false);
      setEditingUserId(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Users - React Boilerplate</title>
        <meta name="description" content="Users management page" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('pages.users')}</h1>
          <Button onClick={handleCreate}>Create User</Button>
        </div>

        <UserList />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUserId(null);
          }}
          title={editingUserId ? 'Edit User' : 'Create User'}
        >
          <UserForm
            userId={editingUserId}
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </>
  );
};

export default Users;
```

**⚠️ Lưu ý:**

- Luôn sử dụng `Helmet` cho SEO
- Sử dụng `useTranslation` cho i18n
- Handle loading, error states
- Sử dụng các components có sẵn

---

### BƯỚC 9: Thêm Route

**📍 Location:** `src/App.tsx`

**Mục đích:** Đăng ký route cho page mới

**Cấu trúc:**

```typescript
// Lazy load page
const Users = React.lazy(() => import('@/pages/Users'));

// Trong Routes:
<Route
  path="users"
  element={
    <ProtectedRoute>
      <Users />
    </ProtectedRoute>
  }
/>
```

**⚠️ Lưu ý:**

- Sử dụng lazy loading cho performance
- Sử dụng `ProtectedRoute` nếu cần authentication
- Route path nên match với constant trong `ROUTES`

---

### BƯỚC 10: Thêm i18n Translations (Optional)

**📍 Location:** `src/constants/locales/en.json` và `vi.json`

**Mục đích:** Thêm translations cho feature

**Cấu trúc:**

```json
// en.json
{
  "pages": {
    "users": "Users Management",
    "users.create": "Create User",
    "users.edit": "Edit User"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}

// vi.json
{
  "pages": {
    "users": "Quản Lý Người Dùng",
    "users.create": "Tạo Người Dùng",
    "users.edit": "Chỉnh Sửa Người Dùng"
  },
  "common": {
    "save": "Lưu",
    "cancel": "Hủy"
  }
}
```

---

## 🎯 Ví Dụ Cụ Thể: User Management Feature

Dưới đây là ví dụ đầy đủ cho User Management Feature:

### 1. Types (`src/types/user.ts`)

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserResponse {
  data: User;
}
```

### 2. Constants (`src/constants/index.ts`)

```typescript
export const API_ENDPOINTS = {
  // ... existing
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;

export const ROUTES = {
  // ... existing
  USERS: '/users',
} as const;
```

### 3. Service (`src/services/userService.ts`)

```typescript
import apiClient from '@/utils/api';
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserListResponse,
  UserResponse,
} from '@/types/user';
import { API_ENDPOINTS } from '@/constants';

export const userService = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>(
      API_ENDPOINTS.USERS.LIST,
      { params }
    );
    return response.data;
  },

  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(
      API_ENDPOINTS.USERS.DETAIL(id)
    );
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(
      API_ENDPOINTS.USERS.CREATE,
      data
    );
    return response.data;
  },

  updateUser: async (
    id: string,
    data: UpdateUserData
  ): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },
};
```

### 4. Thunks (`src/store/thunks/userThunks.ts`)

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/userService';
import {
  CreateUserData,
  UpdateUserData,
  UserListResponse,
  UserResponse,
} from '@/types/user';

export const fetchUsersThunk = createAsyncThunk<
  UserListResponse,
  { page?: number; limit?: number; search?: string } | undefined,
  { rejectValue: string }
>('user/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    return await userService.getUsers(params);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch users'
    );
  }
});

export const fetchUserByIdThunk = createAsyncThunk<
  UserResponse,
  string,
  { rejectValue: string }
>('user/fetchUserById', async (id, { rejectWithValue }) => {
  try {
    return await userService.getUserById(id);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch user'
    );
  }
});

export const createUserThunk = createAsyncThunk<
  UserResponse,
  CreateUserData,
  { rejectValue: string }
>('user/createUser', async (data, { rejectWithValue }) => {
  try {
    return await userService.createUser(data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create user'
    );
  }
});

export const updateUserThunk = createAsyncThunk<
  UserResponse,
  { id: string; data: UpdateUserData },
  { rejectValue: string }
>('user/updateUser', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await userService.updateUser(id, data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update user'
    );
  }
});

export const deleteUserThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await userService.deleteUser(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete user'
    );
  }
});
```

### 5. Slice (`src/store/slices/userSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from '../thunks/userThunks';

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch users
    builder
      .addCase(fetchUsersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserByIdThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data;
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user';
      });

    // Create user
    builder.addCase(createUserThunk.fulfilled, (state, action) => {
      state.users.push(action.payload.data);
    });

    // Update user
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.data.id);
      if (index !== -1) {
        state.users[index] = action.payload.data;
      }
      if (state.currentUser?.id === action.payload.data.id) {
        state.currentUser = action.payload.data;
      }
    });

    // Delete user
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    });
  },
});

export const { clearError, setPage } = userSlice.actions;
export default userSlice.reducer;
```

### 6. Hook (`src/hooks/useUsers.ts`)

```typescript
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from '@/store/thunks/userThunks';
import { CreateUserData, UpdateUserData } from '@/types/user';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, currentUser, isLoading, error, total, page, limit } =
    useAppSelector(state => state.user);

  const fetchUsers = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      const result = await dispatch(fetchUsersThunk(params));
      if (fetchUsersThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch users');
      }
      return result;
    },
    [dispatch]
  );

  const fetchUserById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchUserByIdThunk(id));
      if (fetchUserByIdThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch user');
      }
      return result;
    },
    [dispatch]
  );

  const createUser = useCallback(
    async (data: CreateUserData) => {
      const result = await dispatch(createUserThunk(data));
      if (createUserThunk.fulfilled.match(result)) {
        toast.success('User created successfully!');
      } else if (createUserThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to create user');
      }
      return result;
    },
    [dispatch]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserData) => {
      const result = await dispatch(updateUserThunk({ id, data }));
      if (updateUserThunk.fulfilled.match(result)) {
        toast.success('User updated successfully!');
      } else if (updateUserThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to update user');
      }
      return result;
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteUserThunk(id));
      if (deleteUserThunk.fulfilled.match(result)) {
        toast.success('User deleted successfully!');
      } else if (deleteUserThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to delete user');
      }
      return result;
    },
    [dispatch]
  );

  return {
    users,
    currentUser,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
```

### 7. Components (`src/components/UserList.tsx`)

```typescript
import React, { useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import Table from './Table';
import LoadingSpinner from './LoadingSpinner';

const UserList: React.FC = () => {
  const { users, isLoading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return <Table data={users} columns={columns} />;
};

export default UserList;
```

### 8. Page (`src/pages/Users.tsx`)

```typescript
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useUsers } from '@/hooks/useUsers';
import UserList from '@/components/UserList';
import UserForm from '@/components/UserForm';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

const Users: React.FC = () => {
  const { t } = useTranslation();
  const { createUser, updateUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingUserId) {
        await updateUser(editingUserId, data);
      } else {
        await createUser(data);
      }
      setIsModalOpen(false);
      setEditingUserId(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Users - React Boilerplate</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('pages.users')}</h1>
          <Button onClick={handleCreate}>Create User</Button>
        </div>
        <UserList />
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUserId ? 'Edit User' : 'Create User'}
        >
          <UserForm
            userId={editingUserId}
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </>
  );
};

export default Users;
```

### 9. Route (`src/App.tsx`)

```typescript
const Users = React.lazy(() => import('@/pages/Users'));

// Trong Routes:
<Route
  path="users"
  element={
    <ProtectedRoute>
      <Users />
    </ProtectedRoute>
  }
/>
```

### 10. i18n (`src/constants/locales/en.json` và `vi.json`)

```json
// en.json
{
  "pages": {
    "users": "Users Management"
  }
}

// vi.json
{
  "pages": {
    "users": "Quản Lý Người Dùng"
  }
}
```

---

## ✅ Best Practices

### 1. **Type Safety**

- Luôn định nghĩa types trước khi code
- Sử dụng TypeScript strict mode
- Tránh `any`, sử dụng `unknown` nếu cần

### 2. **Error Handling**

- Handle errors ở thunks, không ở service
- **Xử lý toast notifications trong custom hooks** để hiển thị success/error messages
- Hiển thị user-friendly error messages
- Log errors để debug
- Sử dụng `react-hot-toast` cho toast notifications

### 3. **Code Organization**

- Một file = một responsibility
- Group related files trong cùng folder
- Sử dụng barrel exports (`index.ts`)

### 4. **Performance**

- Sử dụng lazy loading cho pages
- Sử dụng `useCallback` và `useMemo` khi cần
- Tránh unnecessary re-renders
- Với list APIs, ưu tiên cache ở Redux bằng `ttlMs` + `condition` thay vì gọi lại mỗi lần navigate
- Chỉ force fetch khi user chủ động refresh hoặc khi state đã bị invalidated

### 5. **Testing**

- Viết tests cho services và thunks
- Test components với user interactions
- Maintain test coverage > 80%

### 6. **Accessibility**

- Sử dụng semantic HTML
- Thêm ARIA labels khi cần
- Đảm bảo keyboard navigation

### 7. **i18n**

- Luôn sử dụng `useTranslation` cho text
- Không hardcode strings
- Support đầy đủ các languages

---

## 📋 Checklist

Khi implement một feature mới, đảm bảo:

- [ ] ✅ Đã định nghĩa types trong `src/types/`
- [ ] ✅ Đã export types trong `src/types/index.ts`
- [ ] ✅ Đã thêm API endpoints vào `src/constants/index.ts`
- [ ] ✅ Đã tạo service trong `src/services/`
- [ ] ✅ Đã tạo thunks trong `src/store/thunks/`
- [ ] ✅ Đã export thunks trong `src/store/thunks/index.ts`
- [ ] ✅ Đã tạo slice trong `src/store/slices/`
- [ ] ✅ Đã đăng ký slice trong `src/store/index.ts`
- [ ] ✅ Đã tạo custom hook (nếu cần) trong `src/hooks/`
- [ ] ✅ Đã tạo components trong `src/components/`
- [ ] ✅ Đã tạo page trong `src/pages/`
- [ ] ✅ Đã thêm route trong `src/App.tsx`
- [ ] ✅ Đã thêm i18n translations
- [ ] ✅ Đã test feature hoạt động đúng
- [ ] ✅ Đã handle loading và error states
- [ ] ✅ Code đã pass linting và type checking
- [ ] ✅ Thunk fetch list có args phân trang (`page`, `limit`)
- [ ] ✅ Thunk fetch list có cache control (`force`, `ttlMs`) và `condition`
- [ ] ✅ Slice có 4 field cache: `lastFetchedAt`, `lastParamsKey`, `ttlMs`, `isInvalidated`
- [ ] ✅ Mutation đã set `isInvalidated = true` cho list liên quan
- [ ] ✅ Hook không toast fail khi thunk bị skip do cache hit
- [ ] ✅ Đã test cache hit/miss: navigate trong TTL không gọi lại API

---

## 🔗 Tài Liệu Tham Khảo

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks Documentation](https://react.dev/reference/react)

---

**Lưu ý:** Workflow này có thể điều chỉnh tùy theo nhu cầu của project. Quan trọng là giữ consistency trong codebase.
