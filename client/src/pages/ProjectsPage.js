import Project from "../Project";
import {useEffect, useState, useContext}  from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function ProjectsPage() {
  const [projects,setProjects] = useState([]);
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/project`).then(response => {
      response.json().then(projects => {
        setProjects(projects);
      });
    });
  }, []);
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
    </>
  );
}