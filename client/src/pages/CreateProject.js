import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../Editor";
import api from '../api';

export default function CreateProject() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [demo, setDemo] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  async function createNewProject(ev) {
    ev.preventDefault();
  
    try {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('demo', demo);
      if (files.length > 0) {
        data.set('file', files[0]);
      }
  
      await api.post('/project', data);
      setRedirect(true);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form onSubmit={createNewProject}>
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
      <input
            type="text"
            placeholder="Demo"
            value={demo}
            onChange={(ev) => setDemo(ev.target.value)}
    />
      <Editor value={content} onChange={setContent} />
      <button style={{marginTop:'5px'}}>Create Project</button>
    </form>
  );
}