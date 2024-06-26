// App.js
import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import {UserContextProvider} from "./UserContext";

import CreatePost from "./pages/CreatePost";
import PostsPage from "./pages/PostsPage";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

import CreateProject from "./pages/CreateProject";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import EditProject from "./pages/EditProject";

import ContactPage from "./pages/ContactPage";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import SentimentProject from "./projects/SentimentProject";
import ThumbnailProject from "./projects/ThumbnailProject";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/posts_index" element={<PostsPage />} />
          <Route path="/create_post" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit_post/:id" element={<EditPost />} />
          
          <Route path="/projects_index" element={<ProjectsPage />} />
          <Route path="/create_project" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/edit_project/:id" element={<EditProject />} />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/projects/sentiment" element={<SentimentProject />} />
          <Route path="/projects/thumbnail" element={<ThumbnailProject />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
