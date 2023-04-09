import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', userId: '' });
  const [editPost, setEditPost] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleCreatePost = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/posts', newPost)
      .then(response => {
        setPosts(posts.concat(response.data));
        setNewPost({ title: '', content: '', userId: '' });
      })
      .catch(error => console.log(error));
  };

  const handleDeletePost = (postId) => {
    axios.delete(`http://localhost:3001/posts/${postId}`)
      .then(() => setPosts(posts.filter(p => p.id !== postId)))
      .catch(error => console.log(error));
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setNewPost({ title: post.title, content: post.content, userId: post.userId });
  };

  const handleUpdatePost = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:3001/posts/${editPost.id}`, newPost)
      .then(response => {
        const updatedPosts = posts.map(p => p.id === response.data.id ? response.data : p);
        setPosts(updatedPosts);
        setNewPost({ title: '', content: '', userId: '' });
        setEditPost(null);
      })
      .catch(error => console.log(error));
  };

  const handleLikePost = (post) => {
    axios.put(`http://localhost:3001/posts/${post.id}`, { ...post, likes: post.likes + 1 })
      .then(response => {
        const updatedPosts = posts.map(p => p.id === response.data.id ? response.data : p);
        setPosts(updatedPosts);
      })
      .catch(error => console.log(error));
  };

  const handleUnlikePost = (post) => {
    axios.put(`http://localhost:3001/posts/${post.id}`, { ...post, likes: post.likes - 1 })
      .then(response => {
        const updatedPosts = posts.map(p => p.id === response.data.id ? response.data : p);
        setPosts(updatedPosts);
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h2>Post List</h2>
      <ul>
        {posts.map(post =>
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Userid: {post.userId}</p>
            <p>Likes: {post.likes}</p>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            <button onClick={() => handleEditPost(post)}>Edit</button>
            <button onClick={() => handleLikePost(post)}>Like</button>
            <button onClick={() => handleUnlikePost(post)}>Unlike</button>
          </li>
        )}
      </ul>
      <form onSubmit={editPost ? handleUpdatePost : handleCreatePost}>
        <h3>{editPost ? 'Edit Post' : 'Create Post'}</h3>
        <label>Title: </label>
        <input type="text" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
        <br />
        <label>content: </label>
        <input type="text" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} />
        <br />
        <label>Userid: </label>
        <input type="text" value={newPost.userId} onChange={(e) => setNewPost({ ...newPost, userId: e.target.value })} />
        <br />
        <button type="submit">{editPost ? 'Update' : 'Create'}</button>
      </form>
      </div>
        );
    };
    
    export default PostList;