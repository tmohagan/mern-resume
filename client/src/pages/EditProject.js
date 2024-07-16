import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";

export default function EditProject() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [demo, setDemo] = useState('');
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/project/`+id)
      .then(response => {
        response.json().then(projectInfo => {
          setTitle(projectInfo.title);
          setContent(projectInfo.content);
          setSummary(projectInfo.summary);
          setDemo(projectInfo.demo);
        });
      });
  }, [id]);

  async function updateProject(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('demo', demo);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/project`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
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
      <input
            type="text"
            placeholder="Demo"
            value={demo}
            onChange={(ev) => setDemo(ev.target.value)}/>
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update Project</button>
    </form>
  );
}