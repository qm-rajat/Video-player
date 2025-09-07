import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mediaAPI from '../../services/mediaAPI';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  media: [],
  currentMedia: null,
  trending: [],
  searchResults: [],
  comments: [],
  favorites: [],
  watchHistory: [],
  isLoading: false,
  isUploading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  },
  filters: {
    category: '',
    sort: 'newest',
    search: '',
  },
};

// Async thunks
export const fetchMedia = createAsyncThunk(
  'media/fetchMedia',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().media;
      const queryParams = {
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        category: params.category || filters.category,
        sort: params.sort || filters.sort,
        ...params,
      };
      
      const response = await mediaAPI.getMedia(queryParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch media');
    }
  }
);

export const fetchMediaById = createAsyncThunk(
  'media/fetchMediaById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.getMediaById(id);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch media';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const uploadMedia = createAsyncThunk(
  'media/uploadMedia',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.uploadMedia(formData);
      toast.success('Media uploaded successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateMedia = createAsyncThunk(
  'media/updateMedia',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.updateMedia(id, data);
      toast.success('Media updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async (id, { rejectWithValue }) => {
    try {
      await mediaAPI.deleteMedia(id);
      toast.success('Media deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Delete failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const likeMedia = createAsyncThunk(
  'media/likeMedia',
  async (id, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.likeMedia(id);
      return { id, likeCount: response.data.likeCount };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to like media';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const unlikeMedia = createAsyncThunk(
  'media/unlikeMedia',
  async (id, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.unlikeMedia(id);
      return { id, likeCount: response.data.likeCount };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to unlike media';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'media/addToFavorites',
  async (id, { rejectWithValue }) => {
    try {
      await mediaAPI.addToFavorites(id);
      toast.success('Added to favorites!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to favorites';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'media/removeFromFavorites',
  async (id, { rejectWithValue }) => {
    try {
      await mediaAPI.removeFromFavorites(id);
      toast.success('Removed from favorites!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from favorites';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const reportMedia = createAsyncThunk(
  'media/reportMedia',
  async ({ id, reason, description }, { rejectWithValue }) => {
    try {
      await mediaAPI.reportMedia(id, { reason, description });
      toast.success('Media reported successfully');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to report media';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const recordView = createAsyncThunk(
  'media/recordView',
  async (id, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.recordView(id);
      return { id, views: response.data.views };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record view');
    }
  }
);

export const searchMedia = createAsyncThunk(
  'media/searchMedia',
  async (query, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.searchMedia(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchTrendingMedia = createAsyncThunk(
  'media/fetchTrendingMedia',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.getTrendingMedia();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending media');
    }
  }
);

export const fetchComments = createAsyncThunk(
  'media/fetchComments',
  async ({ mediaId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.getComments(mediaId, { page });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'media/addComment',
  async ({ mediaId, content, parentComment, timestamp }, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.addComment(mediaId, {
        content,
        parentComment,
        timestamp,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Slice
const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMedia: (state) => {
      state.media = [];
      state.pagination.page = 1;
    },
    clearCurrentMedia: (state) => {
      state.currentMedia = null;
      state.comments = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    updateMediaInList: (state, action) => {
      const { id, updates } = action.payload;
      const mediaIndex = state.media.findIndex(item => item._id === id);
      if (mediaIndex !== -1) {
        state.media[mediaIndex] = { ...state.media[mediaIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Media
      .addCase(fetchMedia.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, pagination } = action.payload;
        
        if (pagination.page === 1) {
          state.media = data;
        } else {
          state.media = [...state.media, ...data];
        }
        
        state.pagination = pagination;
        state.error = null;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Media By ID
      .addCase(fetchMediaById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMediaById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMedia = action.payload.data;
        state.error = null;
      })
      .addCase(fetchMediaById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upload Media
      .addCase(uploadMedia.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.isUploading = false;
        state.media = [action.payload.data, ...state.media];
        state.error = null;
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
      })
      // Update Media
      .addCase(updateMedia.fulfilled, (state, action) => {
        const updatedMedia = action.payload.data;
        const index = state.media.findIndex(item => item._id === updatedMedia._id);
        if (index !== -1) {
          state.media[index] = updatedMedia;
        }
        if (state.currentMedia?._id === updatedMedia._id) {
          state.currentMedia = updatedMedia;
        }
      })
      // Delete Media
      .addCase(deleteMedia.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.media = state.media.filter(item => item._id !== deletedId);
        if (state.currentMedia?._id === deletedId) {
          state.currentMedia = null;
        }
      })
      // Like/Unlike Media
      .addCase(likeMedia.fulfilled, (state, action) => {
        const { id, likeCount } = action.payload;
        const mediaItem = state.media.find(item => item._id === id);
        if (mediaItem) {
          mediaItem.likeCount = likeCount;
        }
        if (state.currentMedia?._id === id) {
          state.currentMedia.likeCount = likeCount;
        }
      })
      .addCase(unlikeMedia.fulfilled, (state, action) => {
        const { id, likeCount } = action.payload;
        const mediaItem = state.media.find(item => item._id === id);
        if (mediaItem) {
          mediaItem.likeCount = likeCount;
        }
        if (state.currentMedia?._id === id) {
          state.currentMedia.likeCount = likeCount;
        }
      })
      // Record View
      .addCase(recordView.fulfilled, (state, action) => {
        const { id, views } = action.payload;
        const mediaItem = state.media.find(item => item._id === id);
        if (mediaItem) {
          mediaItem.views = views;
        }
        if (state.currentMedia?._id === id) {
          state.currentMedia.views = views;
        }
      })
      // Search Media
      .addCase(searchMedia.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Trending
      .addCase(fetchTrendingMedia.fulfilled, (state, action) => {
        state.trending = action.payload.data;
      })
      // Fetch Comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        if (pagination.page === 1) {
          state.comments = data;
        } else {
          state.comments = [...state.comments, ...data];
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments = [action.payload.data, ...state.comments];
      });
  },
});

export const {
  clearError,
  setFilters,
  clearMedia,
  clearCurrentMedia,
  clearSearchResults,
  updateMediaInList,
} = mediaSlice.actions;

// Selectors
export const selectMedia = (state) => state.media;
export const selectCurrentMedia = (state) => state.media.currentMedia;
export const selectMediaList = (state) => state.media.media;
export const selectTrendingMedia = (state) => state.media.trending;
export const selectSearchResults = (state) => state.media.searchResults;
export const selectComments = (state) => state.media.comments;
export const selectMediaLoading = (state) => state.media.isLoading;
export const selectMediaUploading = (state) => state.media.isUploading;

export default mediaSlice.reducer;