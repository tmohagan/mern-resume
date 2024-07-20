import Project from "../Project";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import api from '../api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    api.get(`/project?page=${currentPage}&limit=10`)
      .then(response => {
        setProjects(response.data.projects);
        setTotalPages(Math.ceil(response.data.totalProjects / 10));
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
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