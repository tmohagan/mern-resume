import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";
import api from '../api';

export default function EditProject() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    api.get(`/project/${id}`)
      .then(response => {
        const projectInfo = response.data;
        setTitle(projectInfo.title);
        setContent(projectInfo.content);
        setSummary(projectInfo.summary);
      })
      .catch(error => {
        console.error('Error fetching project:', error);
      });
  }, [id]);

  async function updateProject(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    try {
      await api.put('/project', data);
      setRedirect(true);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/project/'+id} />
  }

  return (
    <form onSubmit={updateProject}>
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
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update Project</button>
    </form>
  );
}