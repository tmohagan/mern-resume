// App.js
import './App.css';
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import { UserContextProvider } from "./UserContext";

// Lazy load components
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const PostsPage = lazy(() => import("./pages/PostsPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const EditPost = lazy(() => import("./pages/EditPost"));
const CreateProject = lazy(() => import("./pages/CreateProject"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const EditProject = lazy(() => import("./pages/EditProject"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const SentimentProject = lazy(() => import("./projects/SentimentProject"));
const ThumbnailProject = lazy(() => import("./projects/ThumbnailProject"));

// Loading fallback component
const LoadingFallback = () => <div>Loading...</div>;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route 
            path="/search" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SearchPage />
              </Suspense>
            } 
          />
          <Route 
            path="/posts_index" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PostsPage />
              </Suspense>
            } 
          />
          <Route 
            path="/create_post" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <CreatePost />
              </Suspense>
            } 
          />
          <Route 
            path="/post/:id" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PostPage />
              </Suspense>
            } 
          />
          <Route 
            path="/edit_post/:id" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <EditPost />
              </Suspense>
            } 
          />
          
          <Route 
            path="/projects_index" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ProjectsPage />
              </Suspense>
            } 
          />
          <Route 
            path="/create_project" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <CreateProject />
              </Suspense>
            } 
          />
          <Route 
            path="/project/:id" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ProjectPage />
              </Suspense>
            } 
          />
          <Route 
            path="/edit_project/:id" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <EditProject />
              </Suspense>
            } 
          />

          <Route 
            path="/contact" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ContactPage />
              </Suspense>
            } 
          />
          <Route 
            path="/account" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AccountPage />
              </Suspense>
            } 
          />
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <LoginPage />
              </Suspense>
            } 
          />
          <Route 
            path="/register" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <RegisterPage />
              </Suspense>
            } 
          />

          <Route 
            path="/projects/sentiment" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SentimentProject />
              </Suspense>
            } 
          />
          <Route 
            path="/projects/thumbnail" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ThumbnailProject />
              </Suspense>
            } 
          />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;