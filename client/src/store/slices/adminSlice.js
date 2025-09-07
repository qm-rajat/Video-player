import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminAPI from '../../services/adminAPI';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  dashboard: {
    stats: null,
    isLoading: false,
  },
  reports: {
    data: [],
    pagination: null,
    isLoading: false,
  },
  users: {
    data: [],
    pagination: null,
    isLoading: false,
  },
  payments: {
    stats: null,
    isLoading: false,
  },
  logs: {
    data: [],
    isLoading: false,
  },
  error: null,
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchReportedContent = createAsyncThunk(
  'admin/fetchReportedContent',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getReportedContent(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reported content');
    }
  }
);

export const moderateContent = createAsyncThunk(
  'admin/moderateContent',
  async ({ type, id, action, notes }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.moderateContent(type, id, { action, notes });
      toast.success(`Content ${action}d successfully`);
      return { type, id, action, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Moderation action failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const suspendUser = createAsyncThunk(
  'admin/suspendUser',
  async ({ userId, reason, duration }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.suspendUser(userId, { reason, duration });
      toast.success('User suspended successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to suspend user';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const unsuspendUser = createAsyncThunk(
  'admin/unsuspendUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.unsuspendUser(userId);
      toast.success('User unsuspended successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to unsuspend user';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  'admin/fetchPaymentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getPaymentStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment stats');
    }
  }
);

export const fetchSystemLogs = createAsyncThunk(
  'admin/fetchSystemLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getSystemLogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system logs');
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReports: (state) => {
      state.reports.data = [];
      state.reports.pagination = null;
    },
    clearUsers: (state) => {
      state.users.data = [];
      state.users.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboard.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboard.isLoading = false;
        state.dashboard.stats = action.payload.data;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboard.isLoading = false;
        state.error = action.payload;
      })
      // Reported Content
      .addCase(fetchReportedContent.pending, (state) => {
        state.reports.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReportedContent.fulfilled, (state, action) => {
        state.reports.isLoading = false;
        state.reports.data = action.payload.data;
        state.reports.pagination = action.payload.pagination;
      })
      .addCase(fetchReportedContent.rejected, (state, action) => {
        state.reports.isLoading = false;
        state.error = action.payload;
      })
      // Moderate Content
      .addCase(moderateContent.fulfilled, (state, action) => {
        const { type, id, action: moderationAction } = action.payload;
        const reportIndex = state.reports.data.findIndex(report => 
          report.contentId === id && report.contentType === type
        );
        if (reportIndex !== -1) {
          state.reports.data[reportIndex].status = 'resolved';
          state.reports.data[reportIndex].moderationAction = moderationAction;
        }
      })
      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.users.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.isLoading = false;
        state.users.data = action.payload.data;
        state.users.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.isLoading = false;
        state.error = action.payload;
      })
      // Suspend User
      .addCase(suspendUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.data;
        const userIndex = state.users.data.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users.data[userIndex] = updatedUser;
        }
      })
      // Unsuspend User
      .addCase(unsuspendUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.data;
        const userIndex = state.users.data.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users.data[userIndex] = updatedUser;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.payload;
        state.users.data = state.users.data.filter(user => user._id !== deletedUserId);
      })
      // Payment Stats
      .addCase(fetchPaymentStats.pending, (state) => {
        state.payments.isLoading = true;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.payments.isLoading = false;
        state.payments.stats = action.payload.data;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.payments.isLoading = false;
        state.error = action.payload;
      })
      // System Logs
      .addCase(fetchSystemLogs.pending, (state) => {
        state.logs.isLoading = true;
      })
      .addCase(fetchSystemLogs.fulfilled, (state, action) => {
        state.logs.isLoading = false;
        state.logs.data = action.payload.data;
      })
      .addCase(fetchSystemLogs.rejected, (state, action) => {
        state.logs.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearReports, clearUsers } = adminSlice.actions;

// Selectors
export const selectAdmin = (state) => state.admin;
export const selectDashboardStats = (state) => state.admin.dashboard.stats;
export const selectReports = (state) => state.admin.reports;
export const selectUsers = (state) => state.admin.users;
export const selectPaymentStats = (state) => state.admin.payments.stats;
export const selectSystemLogs = (state) => state.admin.logs.data;

export default adminSlice.reducer;