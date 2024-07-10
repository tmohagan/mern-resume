import Project from "../Project";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/project?page=${currentPage}&limit=10`)
      .then(response => response.json())
      .then(data => {
        setProjects(data.projects);
        setTotalPages(Math.ceil(data.totalProjects / 10));
      });
  }, [currentPage]);

  return (
    <>
      {userInfo && (
        <div className="create-post-link">
          <Link to="/create_project">Create a new project</Link>
        </div>
      )}
      {projects.length > 0 && projects.map(project => (
        <Project key={project._id} {...project} />
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