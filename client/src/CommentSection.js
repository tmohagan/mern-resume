import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "./UserContext";
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ postID }) => {
  const [comments, setComments] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetchComments();
  }, [postID]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://comment-service-w7ayogaiya-uc.a.run.app/comments/${postID}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data || []);
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
    try {
      const response = await fetch('https://comment-service-w7ayogaiya-uc.a.run.app/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postID: postID,
          userID: userInfo.id, // This is the ObjectId from the main site
          username: userInfo.username,
          content: newComment
        }),
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
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
    try {
      const response = await fetch(`https://comment-service-w7ayogaiya-uc.a.run.app/comments/${editingComment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          userID: userInfo.id, // Include this for verification on the server side
        }),
      });
      if (response.ok) {
        fetchComments();
        setEditingComment(null);
        setEditedContent('');
      } else {
        console.error('Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await fetch(`https://comment-service-w7ayogaiya-uc.a.run.app/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userInfo.id, // Include this for verification on the server side
          }),
        });
        if (response.ok) {
          fetchComments();
        } else {
          console.error('Failed to delete comment');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const isCommentOwner = (comment) => {
    return userInfo && userInfo.id && comment.userID === userInfo.id;
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {isLoading ? (
        <p>Loading comments...</p>
      ) : comments && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span className="comment-author">{comment.username}</span>
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