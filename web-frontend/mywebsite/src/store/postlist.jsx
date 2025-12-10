import { createContext, useReducer, useEffect, useState } from "react";
import {
  getItemsFromServer,
  addItemToServer,
  deleteItemFromServer,
} from "../service/webservice.js";
const API_URL = import.meta.env.VITE_API_URL;
export const PostContext = createContext({
  posts: [],
  loading: null,
  setPage: null,
  addPost: () => {},
  deletePost: () => {},
});

const postsreducer = (initialposts, action) => {
  let finalposts = initialposts;

  if (action.type === "SET_POSTS") {
    const allPosts = [...initialposts, ...action.payload];
    const uniquePosts = Array.from(
      new Map(allPosts.map((post) => [post._id || post.id, post])).values()
    );
    finalposts = uniquePosts;
  } else if (action.type === "DELETE_POST") {
    finalposts = initialposts.filter((post) => post.id !== action.payload.id);
  } else if (action.type === "ADD_POST") {
    finalposts = [action.payload, ...initialposts];
  }

  return finalposts;
};

export const PostProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsreducer, []);

  const [loading, setLoading] = useState(false);
  const [initialloading, setinitialLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const serverPosts = await getItemsFromServer(page);
        dispatch({ type: "SET_POSTS", payload: serverPosts });
      } catch (err) {
      } finally {
        setLoading(false);
        setinitialLoading(false);
      }
    };
    loadPosts();
  }, [page]);

  const addPost = async (file, description) => {
    const post = await addItemToServer(file, description);
    dispatch({ type: "ADD_POST", payload: post });
  };

  const deletePost = async (id) => {
    await deleteItemFromServer(id);
    dispatch({ type: "DELETE_POST", payload: { id } });
  };
  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        setLoading,
        addPost,
        deletePost,
        setPage,
        initialloading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
