import Post from "../Post";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import api from '../api';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/post?page=${currentPage}&limit=10`);
        setPosts(response.data.posts);
        setTotalPages(Math.ceil(response.data.totalPosts / 10));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [currentPage]);

  return (
    <>
      {userInfo && (
        <div className="create-post-link">
          <Link to="/create_post">Create a new skill</Link>
        </div>
      )}
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post} />
      ))}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt; Prev
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &gt;
        </button>
      </div>
    </>
  );
}