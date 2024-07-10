import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    fetchPost();
    fetchProjects();
  }, [id]);

  async function fetchPost() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/post/${id}`);
    if (response.ok) {
      const postInfo = await response.json();
      setTitle(postInfo.title);
      setContent(postInfo.content);
      setSummary(postInfo.summary);
      setSelectedProjects(postInfo.projects ? postInfo.projects.map(project => project._id) : []);

    }
  }

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

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    data.set('projects', selectedProjects.join(','));
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
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
  {projects.length > 0 ? (
    projects.map(project => (
      <option key={project._id} value={project._id}>
        {project.title}
      </option>
    ))
  ) : (
    <option value="">No projects available</option>
  )}
</select>
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}