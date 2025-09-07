import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  darkMode: true, // Adult content platforms typically use dark themes
  sidebarOpen: false,
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  toast: {
    isVisible: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  },
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        notification => notification.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    showToast: (state, action) => {
      state.toast = {
        isVisible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  showToast,
  hideToast,
} = uiSlice.actions;

// Selectors
export const selectUI = (state) => state.ui;
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModal = (state) => state.ui.modal;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(notification => !notification.read);
export const selectToast = (state) => state.ui.toast;

export default uiSlice.reducer;