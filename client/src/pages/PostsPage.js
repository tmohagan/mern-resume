import Post from "../Post";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post?page=${currentPage}&limit=10`)
      .then(response => response.json())
      .then(data => {
        setPosts(data.posts);
        setTotalPages(Math.ceil(data.totalPosts / 10));
      });
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
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}