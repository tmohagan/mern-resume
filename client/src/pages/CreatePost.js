import 'react-quill/dist/quill.snow.css';
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/project`, {
        credentials: 'include',
      });
      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);
      } else {
        console.error('Error fetching projects:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  async function createNewPost(ev) {
    ev.preventDefault();

    try {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('project', selectedProject);
      if (files.length > 0) {
        data.set('file', files[0]);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error('Error creating post:', response.statusText); 
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form onSubmit={createNewPost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <select 
        value={selectedProject} 
        onChange={ev => setSelectedProject(ev.target.value)}
      >
        <option value="">Select a project (optional)</option>
        {projects.map(project => (
          <option key={project._id} value={project._id}>
            {project.title}
          </option>
        ))}
      </select>
      <Editor value={content} onChange={setContent} />
      <button style={{marginTop:'5px'}}>create post</button>
    </form>
  );
}