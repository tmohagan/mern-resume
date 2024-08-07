import 'react-quill/dist/quill.snow.css';
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import api from '../api';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await api.get('/project');
      const projectsData = response.data;
      setProjects(projectsData.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('projects', selectedProjects.join(','));
    if (files.length > 0) {
      data.set('file', files[0]);
    }
  
    try {
      await api.post('/post', data);
      setRedirect(true);
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
        multiple
        value={selectedProjects}
        onChange={ev => setSelectedProjects(Array.from(ev.target.selectedOptions, option => option.value))}
      >
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map(project => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))
        ) : (
          <option value="">No projects available</option>
        )}
      </select>
      <Editor value={content} onChange={setContent} />
      <button style={{marginTop:'5px'}}>Create Post</button>
    </form>
  );
}