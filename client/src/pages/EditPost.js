import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import api from '../api';

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchProjects();
  }, [id]);

  useEffect(() => {
    console.log('Projects:', projects);
  }, [projects]);


  async function fetchPost() {
    try {
      const response = await api.get(`/post/${id}`);
      const postInfo = response.data;
      setTitle(postInfo.title);
      setContent(postInfo.content);
      setSummary(postInfo.summary);
      setSelectedProjects(postInfo.projects ? postInfo.projects.map(project => project._id) : []);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }

  async function fetchProjects() {
    setIsLoading(true);
    try {
      const response = await api.get('/project');
      const projectsData = response.data;
      console.log('Fetched projects:', projectsData);
      setProjects(projectsData.projects || projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
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
      data.set('file', files[0]);
    }
    try {
      await api.put('/post', data);
      setRedirect(true);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
      <input 
        type="title"
        placeholder={'Title'}
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input 
        type="summary"
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      <input 
        type="file"
        onChange={ev => setFiles(ev.target.files)}
      />
      <select 
        multiple
        value={selectedProjects}
        onChange={ev => setSelectedProjects(Array.from(ev.target.selectedOptions, option => option.value))}
      >
        {isLoading ? (
          <option>Loading projects...</option>
        ) : projects.length > 0 ? (
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
      <button style={{marginTop:'5px'}}>Update Post</button>
    </form>
  );
}