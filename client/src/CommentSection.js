import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "./UserContext";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://comment-service-w7ayogaiya-uc.a.run.app/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
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
          postId,
          userId: userInfo.id,
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

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p><strong>{comment.username}</strong>: {comment.content}</p>
        </div>
      ))}
      {userInfo && (
        <form onSubmit={handleSubmit}>
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