import { createContext, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext.jsx";
import { getMyFavorites, getMyBookings, toggleFavorite as apiToggleFavorite } from "../lib/api.js";
import toast from "react-hot-toast";
import {
  classes as seedClasses,
  forumPosts as seedPosts,
  seedBookings,
  seedComments,
} from "../data/mockData.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favData } = useQuery({
    queryKey: ['favorites', user?.id || user?._id],
    queryFn: getMyFavorites,
    enabled: !!user
  });

  const { data: bookData } = useQuery({
    queryKey: ['bookings', user?.id || user?._id],
    queryFn: getMyBookings,
    enabled: !!user
  });

  const api = useMemo(() => {
    // Reconstruct favorites dictionary for the old format: { [userId]: [classId1, classId2] }
    const favoritesObj = {};
    if (user && favData?.favorites) {
      favoritesObj[user.id || user._id] = favData.favorites.map(f => f.classId?._id || f.classId);
    }

    const myBookings = bookData?.bookings || [];

    return {
      classes: seedClasses,
      posts: seedPosts,
      comments: seedComments,
      bookings: seedBookings,
      favorites: favoritesObj,
      reactions: {},
      trainerApps: [],

      // classes
      addClass: () => {},
      updateClass: () => {},
      deleteClass: () => {},

      // bookings
      isBooked: (userId, classId) => myBookings.some((b) => (b.classId?._id || b.classId) === classId),
      addBooking: () => {},

      // favorites
      isFavorite: (userId, classId) => Boolean(favoritesObj?.[userId]?.includes(classId)),
      toggleFavorite: async (userId, classId) => {
        try {
          await apiToggleFavorite(classId);
          queryClient.invalidateQueries(['favorites', userId]);
        } catch(e) {
          toast.error("Failed to update favorites");
        }
      },

      // posts
      addPost: () => {},
      deletePost: () => {},

      // comments
      addComment: () => {},
      deleteComment: () => {},
      updateComment: () => {},

      // reactions
      react: () => {},
      hasReacted: () => false,

      // trainer applications
      applyTrainer: () => {},
      decideTrainerApp: () => {},
    };
  }, [favData, bookData, user, queryClient]);

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
};
