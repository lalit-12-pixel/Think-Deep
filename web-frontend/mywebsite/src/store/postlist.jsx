import { createContext, useReducer, useEffect, useState } from "react";
import {
  getItemsFromServer,
  addItemToServer,
  deleteItemFromServer,
} from "../service/webservice.js";

const API_URL = import.meta.env.VITE_API_URL;

export const PostContext = createContext({
  posts: [],
  loading: false,
  initialloading: true,
  addPost: () => {},
  deletePost: () => {},
  setPage: () => {},
});

// ⭐ Standardize post structure from backend → frontend
const mapServerPost = (post) => {
  return {
    id: post._id, //🔥 always use id on frontend
    description: post.description || "",
    imageUrl: post.imageUrl || "", //🔥 always imageUrl
    likes: post.likes ?? 0,
    dislikes: post.dislikes ?? 0,
    comments: post.comments ?? [],
    shares: post.shares ?? 0,
    createdAt: post.createdAt,
    user: {
      name: post.user?.name || "Unknown",
      username: post.user?.username || "anonymous",
      avatar: post.user?.avatar || "",
    },
  };
};

// ⭐ Reducer
const postsReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS": {
      const incoming = action.payload.map(mapServerPost);
      const merged = [...state, ...incoming];

      // Remove duplicates by id
      const unique = Array.from(new Map(merged.map(p => [p.id, p])).values());

      return unique;
    }

    case "ADD_POST":
      return [mapServerPost(action.payload), ...state];

    case "DELETE_POST":
      return state.filter((post) => post.id !== action.payload);

    default:
      return state;
  }
};

export const PostProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [loading, setLoading] = useState(false);
  const [initialloading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);

  // ⭐ Fetch paginated posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const rawPosts = await getItemsFromServer(page);
        dispatch({ type: "SET_POSTS", payload: rawPosts });
      } catch (err) {
        console.error("Post loading failed:", err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    loadPosts();
  }, [page]);

  // ⭐ Add new post
  const addPost = async (file, description) => {
    const post = await addItemToServer(file, description);
    dispatch({ type: "ADD_POST", payload: post });
  };

  // ⭐ Delete post
  const deletePost = async (id) => {
    await deleteItemFromServer(id);
    dispatch({ type: "DELETE_POST", payload: id });
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        initialloading,
        addPost,
        deletePost,
        setPage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
