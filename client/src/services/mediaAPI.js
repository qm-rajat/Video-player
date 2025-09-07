import api from './api';

const mediaAPI = {
  // Media CRUD
  getMedia: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/media?${queryString}`);
  },
  
  getMediaById: (id) => api.get(`/media/${id}`),
  
  uploadMedia: (formData) => {
    return api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateMedia: (id, data) => api.put(`/media/${id}`, data),
  
  deleteMedia: (id) => api.delete(`/media/${id}`),
  
  // Media interactions
  likeMedia: (id) => api.post(`/media/${id}/like`),
  
  unlikeMedia: (id) => api.delete(`/media/${id}/like`),
  
  addToFavorites: (id) => api.post(`/media/${id}/favorite`),
  
  removeFromFavorites: (id) => api.delete(`/media/${id}/favorite`),
  
  reportMedia: (id, reportData) => api.post(`/media/${id}/report`, reportData),
  
  recordView: (id) => api.post(`/media/${id}/view`),
  
  // Search and discovery
  searchMedia: (query, params = {}) => {
    const queryParams = { q: query, ...params };
    const queryString = new URLSearchParams(queryParams).toString();
    return api.get(`/media/search?${queryString}`);
  },
  
  getTrendingMedia: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/media/trending?${queryString}`);
  },
  
  getCreatorMedia: (creatorId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/media/creator/${creatorId}?${queryString}`);
  },
  
  // Comments
  getComments: (mediaId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/media/${mediaId}/comments?${queryString}`);
  },
  
  addComment: (mediaId, commentData) => api.post(`/media/${mediaId}/comments`, commentData),
  
  updateComment: (commentId, commentData) => api.put(`/media/comments/${commentId}`, commentData),
  
  deleteComment: (commentId) => api.delete(`/media/comments/${commentId}`),
};

export default mediaAPI;