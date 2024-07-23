// Post.js
import React from 'react';
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import Image from "./Image.jsx";

const Post = React.memo(function Post({ _id, title, summary, cover, createdAt, author }) {
  return (
    <div className="post">
      <div className="image">
        {cover && ( 
          <Link to={`/post/${_id}`}>
            <Image src={cover} alt="" />
          </Link>
        )}
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <span className="author">{author.username}</span>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
});

export default Post;