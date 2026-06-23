import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Redirect to login or dispatch event if unauthorized
      if (window.location.pathname !== '/login') {
        window.dispatchEvent(new Event('unauthorized-error'));
      }
    }
    return Promise.reject(error);
  }
);

export const getPublicClasses = async (params) => {
  const res = await api.get("/classes", { params });
  return res.data;
};

export const getClassById = async (id) => {
  const res = await api.get(`/classes/${id}`);
  return res.data;
};

export const createClass = async (data) => {
  const res = await api.post("/classes", data);
  return res.data;
};

export const getMyClasses = async () => {
  const res = await api.get(`/classes/trainer/my?t=${Date.now()}`);
  return res.data;
};

export const deleteMyClass = async (id) => {
  const res = await api.delete(`/classes/${id}`);
  return res.data;
};

export const createBooking = async (data) => {
  const res = await api.post("/bookings", data);
  return res.data;
};

export const getPosts = async (params) => {
  const res = await api.get("/posts", { params });
  return res.data;
};

export const getPostById = async (id) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

export const createPost = async (data) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const getMyPosts = async () => {
  const res = await api.get(`/posts/my?t=${Date.now()}`);
  return res.data;
};

export const deleteMyPost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const toggleLike = async (id) => {
  const res = await api.post(`/posts/${id}/like`);
  return res.data;
};

export const toggleDislike = async (id) => {
  const res = await api.post(`/posts/${id}/dislike`);
  return res.data;
};

export const addComment = async (data) => {
  const res = await api.post("/posts/comments", data);
  return res.data;
};

export const getMyComments = async () => {
  const res = await api.get(`/posts/comments/my?t=${Date.now()}`);
  return res.data;
};

export const toggleFavorite = async (classId) => {
  const res = await api.post("/favorites", { classId });
  return res.data;
};

export const getMyFavorites = async () => {
  const res = await api.get("/favorites/my");
  return res.data;
};

export const getMyBookings = async () => {
  const res = await api.get(`/bookings/my?t=${Date.now()}`);
  return res.data;
};

export const getMyTrainerApplication = async () => {
  const res = await api.get(`/trainer/my?t=${Date.now()}`);
  return res.data;
};

export const applyForTrainer = async (data) => {
  const res = await api.post("/trainer/apply", data);
  return res.data;
};

export const getTrainerBookings = async () => {
  const res = await api.get(`/bookings/trainer/my?t=${Date.now()}`);
  return res.data;
};

// --- Admin API ---
export const getAdminStats = async () => {
  const res = await api.get(`/admin/stats?t=${Date.now()}`);
  return res.data;
};

export const getAllUsersAdmin = async () => {
  const res = await api.get(`/admin/users?t=${Date.now()}`);
  return res.data;
};

export const getAllClassesAdmin = async () => {
  const res = await api.get(`/admin/classes?t=${Date.now()}`);
  return res.data;
};

export const getAllPostsAdmin = async () => {
  const res = await api.get(`/admin/posts?t=${Date.now()}`);
  return res.data;
};

export const getTransactionsAdmin = async () => {
  const res = await api.get(`/admin/transactions?t=${Date.now()}`);
  return res.data;
};

export const getTrainerApplicationsAdmin = async () => {
  const res = await api.get(`/trainer/applications?t=${Date.now()}`);
  return res.data;
};

export const updateUserRoleAdmin = async (id, role) => {
  const res = await api.patch(`/admin/update-role/${id}`, { role });
  return res.data;
};

export const toggleBlockUserAdmin = async (id, currentStatus) => {
  const endpoint =
    currentStatus === "active" ? `/admin/block-user/${id}` : `/admin/unblock-user/${id}`;
  const res = await api.post(endpoint);
  return res.data;
};

export const approveClassAdmin = async (id) => {
  const res = await api.patch(`/admin/approve-class/${id}`);
  return res.data;
};

export const rejectClassAdmin = async (id) => {
  const res = await api.patch(`/admin/reject-class/${id}`);
  return res.data;
};

export const deleteClassAdmin = async (id) => {
  const res = await api.delete(`/admin/classes/${id}`);
  return res.data;
};

export const deletePostAdmin = async (id) => {
  // We can just use the regular delete post endpoint or add one
  // ForumRoutes doesn't seem to have a delete post endpoint yet. I will add one if needed, or see if it's there.
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const approveTrainerAppAdmin = async (id) => {
  const res = await api.patch(`/trainer/approve/${id}`);
  return res.data;
};

export const rejectTrainerAppAdmin = async (id) => {
  const res = await api.patch(`/trainer/reject/${id}`);
  return res.data;
};
