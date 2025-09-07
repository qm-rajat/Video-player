import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionAPI from '../../services/subscriptionAPI';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  subscriptions: [],
  plans: [],
  paymentHistory: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getSubscriptions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }
);

export const fetchSubscriptionPlans = createAsyncThunk(
  'subscriptions/fetchSubscriptionPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getPlans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.createSubscription(subscriptionData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create subscription';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscriptions/cancelSubscription',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.cancelSubscription(subscriptionId);
      toast.success('Subscription cancelled successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel subscription';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'subscriptions/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getPaymentHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment history');
    }
  }
);

// Slice
const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = action.payload.data;
        state.error = null;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Plans
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.plans = action.payload.data;
      })
      // Create Subscription
      .addCase(createSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle redirect to Stripe checkout
        if (action.payload.data.url) {
          window.location.href = action.payload.data.url;
        }
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel Subscription
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        const updatedSubscription = action.payload.data;
        const index = state.subscriptions.findIndex(sub => sub._id === updatedSubscription._id);
        if (index !== -1) {
          state.subscriptions[index] = updatedSubscription;
        }
      })
      // Fetch Payment History
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory = action.payload.data;
      });
  },
});

export const { clearError } = subscriptionSlice.actions;

// Selectors
export const selectSubscriptions = (state) => state.subscriptions;

export default subscriptionSlice.reducer;