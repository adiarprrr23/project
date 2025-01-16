import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function BlogCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicId, setTopicId] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let selectedTopicId = topicId;
      
      if (newTopic) {
        const topicResponse = await axios.post(
          'http://localhost:5000/api/topics',
          { name: newTopic },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        selectedTopicId = topicResponse.data._id;
      }

      await axios.post(
        'http://localhost:5000/api/blogs',
        { title, content, topicId: selectedTopicId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      navigate('/blogs');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog</h2>
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input min-h-[200px]"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Select Existing Topic
              </label>
              <select
                id="topic"
                value={topicId}
                onChange={(e) => {
                  setTopicId(e.target.value);
                  setNewTopic('');
                }}
                className="input"
                disabled={newTopic}
              >
                <option value="">Select a topic</option>
                {topics.map(topic => (
                  <option key={topic._id} value={topic._id}>{topic.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="newTopic" className="block text-sm font-medium text-gray-700 mb-2">
                Or Create New Topic
              </label>
              <input
                id="newTopic"
                type="text"
                value={newTopic}
                onChange={(e) => {
                  setNewTopic(e.target.value);
                  setTopicId('');
                }}
                className="input"
                placeholder="Enter new topic name"
                disabled={topicId}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Create Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlogCreate;