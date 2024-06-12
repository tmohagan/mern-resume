import Project from "../Project";
import {useEffect, useState} from "react";

export default function ProjectsPage() {
  const [projects,setProjects] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/project`).then(response => {
      response.json().then(projects => {
        setProjects(projects);
      });
    });
  }, []);
  return (
    <>
      {projects.length > 0 && projects.map(project => (
        <Project key={project._id} {...project} />
      ))}
    </>
  );
}