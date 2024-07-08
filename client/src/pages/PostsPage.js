import Post from "../Post";
import {useEffect, useState, useContext} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function PostsPage() {
  const [posts,setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
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
    </>
  );
}