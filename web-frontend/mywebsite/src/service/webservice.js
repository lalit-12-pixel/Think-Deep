const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const addItemToServer = async (file, description) => {
  const formData = new FormData();
  if (file) formData.append("image", file);
  formData.append("description", description || "");

  const response = await fetch(`${API_URL}/createpost`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok || !result.post) {
    throw new Error(result.error || "Post creation failed");
  }
  return mapServerItemToLocalItem(result.post);
};

export const getItemsFromServer = async (page) => {
  const response = await fetch(`${API_URL}/posts?_limit=5&_page=${page}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const items = await response.json();
  return items.map(mapServerItemToLocalItem);
};

export const deleteItemFromServer = async (id) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Delete failed");
  return id;
};

const mapServerItemToLocalItem = (serverItem) => {
  return {
    id: serverItem._id,
    description: serverItem.description,
    // note: leave image field as provided by backend
    image: serverItem.imageUrl || serverItem.image || "",
    likes: serverItem.likes || 0,
    dislikes: serverItem.dislikes || 0,
    comments: serverItem.comments || [],
    shares: serverItem.shares || 0,
    name: serverItem.user?.name || "Unknown",
    username: serverItem.user?.username || "anonymous",
    user: serverItem.user,
    createdAt: serverItem.createdAt,
  };
};
