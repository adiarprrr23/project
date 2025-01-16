import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchBlogs();
    fetchTopics();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const filteredBlogs = selectedTopic
    ? blogs.filter(blog => blog.topic._id === selectedTopic)
    : blogs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Blogs</h2>
        <Link to="/blogs/create" className="btn btn-primary inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Blog
        </Link>
      </div>

      <div className="mb-8">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All Topics</option>
          {topics.map(topic => (
            <option key={topic._id} value={topic._id}>{topic.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map(blog => (
          <article key={blog._id} className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {blog.topic.name}
              </span>
              <span className="text-sm text-gray-500">
                by {blog.author.username}
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                {blog.updatedAt !== blog.createdAt
                  ? `Updated ${new Date(blog.updatedAt).toLocaleDateString()}`
                  : `Created ${new Date(blog.createdAt).toLocaleDateString()}`}
              </span>
              <div className="flex gap-2">
                <Link
                  to={`/blogs/edit/${blog._id}`}
                  className="btn btn-secondary py-1 px-3"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="btn btn-danger py-1 px-3"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blogs found</p>
        </div>
      )}
    </div>
  );
}

export default BlogList;