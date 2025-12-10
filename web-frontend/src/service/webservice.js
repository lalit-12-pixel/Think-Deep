export const addItemToServer = async (file, description) => {
  const formData = new FormData();
  if (file) {
    formData.append("image", file);
  }

  formData.append("description", description);
  const response = await fetch("http://localhost:3001/createpost", {
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
  const response = await fetch(
    `http://localhost:3001/posts?_limit=5&_page=${page}`
  );
  const items = await response.json();
  return items.map(mapServerItemToLocalItem);
};

export const deleteItemFromServer = async (id) => {
  await fetch(`http://localhost:3001/posts/${id}`, {
    method: "DELETE",
  });
  return id;
};

const mapServerItemToLocalItem = (serverItem) => {
  return {
    id: serverItem._id,
    description: serverItem.description,
    imageUrl: serverItem.imageUrl || "",
    likes: serverItem.likes || 0,
    dislikes: serverItem.dislikes || 0,
    comments: serverItem.comments || 0,
    shares: serverItem.shares || 0,
    name: serverItem.user?.name || "Unknown",
    username: serverItem.user?.username || "anonymous",
    user: serverItem.user,
    createdAt: serverItem.createdAt,
  };
};
