import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { formatDistanceToNow } from 'date-fns';
import { commentApi } from './api';

const CommentSection = ({ parentID, parentType }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (isValidObjectId(parentID)) {
      fetchComments();
    } else {
      console.error('Invalid parentID');
      setComments([]);
      setIsLoading(false);
    }
  }, [parentID, parentType]);

  const isValidObjectId = (id) => {
    if(id == null) return false;
    if(typeof id !== 'string') return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const getEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '😄';
      case 'negative':
        return '😔';
      case 'neutral':
        return '😐';
      default:
        return '❓';
    }
  };

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await commentApi.get(`/api/comments/${parentType}/${parentID}`);
      if (response.status === 200) {
        setComments(response.data || []);
      } else {
        console.error('Failed to fetch comments');
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      alert('You must be logged in to comment.');
      return;
    }
    if (!isValidObjectId(parentID)) {
      console.error('Invalid parentID');
      return;
    }
    try {
      const commentData = {
        userID: userInfo.id,
        username: userInfo.username,
        content: newComment
      };
      const response = await commentApi.post(`/api/comments/${parentType}/${parentID}`, commentData);
      if (response.status === 201) {
        setNewComment('');
        fetchComments();
      } else {
        console.error('Failed to post comment', response);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditedContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedContent('');
  };

  const handleSaveEdit = async () => {
    if (!isValidObjectId(editingComment.id)) {
      console.error('Invalid comment ID');
      return;
    }
    try {
      const response = await commentApi.put(`/api/comments/${parentType}/${editingComment.id}`, {
        content: editedContent,
        userID: userInfo.id,
      });
      if (response.status === 200) {
        fetchComments();
        setEditingComment(null);
        setEditedContent('');
      } else {
        console.error('Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      if (error.response && error.response.status === 403) {
        alert('You are not authorized to edit this comment.');
      }
    }
  };
  
  const handleDelete = async (commentId) => {
    if (!isValidObjectId(commentId)) {
      console.error('Invalid comment ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await commentApi.delete(`/api/comments/${parentType}/${commentId}`, {
          headers: { 'User-ID': userInfo.id }
        });
        if (response.status === 204) {
          fetchComments();
        } else {
          console.error('Failed to delete comment');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        if (error.response && error.response.status === 403) {
          alert('You are not authorized to delete this comment.');
        }
      }
    }
  };

  const isCommentOwner = (comment) => {
    return userInfo && userInfo.id && comment.userID === userInfo.id;
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {!userInfo && <Link to="/login">Please log in/register to leave a comment.</Link>}
      {isLoading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span className="comment-author">
                {comment.username} {' '}{getEmoji(comment.sentiment)}
              </span>
              <span className="comment-date">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="comment-content">
              {editingComment && editingComment.id === comment.id ? (
                <textarea
                  className="comment-edit-area"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                comment.content
              )}
            </div>
            {isCommentOwner(comment) && (
              <div className="comment-actions">
                {editingComment && editingComment.id === comment.id ? (
                  <>
                    <span className="comment-action save" onClick={handleSaveEdit}>Save</span>
                    <span className="comment-action cancel" onClick={handleCancelEdit}>Cancel</span>
                  </>
                ) : (
                  <>
                    <span className="comment-action" onClick={() => handleEdit(comment)}>Edit</span>
                    <span className="comment-action" onClick={() => handleDelete(comment.id)}>Delete</span>
                  </>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      {userInfo && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;