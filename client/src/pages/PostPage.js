import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import Image from "../Image.jsx";
import CommentSection from "../CommentSection"; 
import api from '../api';

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/post/${id}`)
      .then(response => {
        setPostInfo(response.data);
      })
      .catch(error => {
        console.error('Error fetching post:', error);
      });
  }, [id]);

  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        await api.delete(`/post/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  }

  if (!postInfo) return '';

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo?.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit_post/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit this Post
          </Link>
          <Link className="edit-btn" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Delete this Post
          </Link>
        </div>
      )}
      <div className="image">
        <Image src={postInfo.cover} alt="" />
      </div>
      {postInfo.projects && postInfo.projects.length > 0 && (
        <div className="project-links">
          <p>Projects using this skill:</p>
          <ul>
            {postInfo.projects.map((project, index) => (
              <li key={project._id}>
                <Link to={`/project/${project._id}`}>{project.title}</Link>
                {index < postInfo.projects.length - 1 ? ', ' : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      <CommentSection parentID={id} parentType="post" />
    </div>
  );
}