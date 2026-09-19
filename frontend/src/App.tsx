import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import Welcome from './pages/Welcome/Welcome'
import NewsLandingPage from './pages/news/LandingPage'
import CreateJobPostPage from './pages/jobs/CreateJobPostPage'
import JobDetailsPage from './pages/jobs/JobDetailsPage'
import MessagesPage from './pages/messages/MessagesPage'
import ToastViewport from './components/Toast/ToastViewport'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ToastViewport />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/jobs/create" element={<CreateJobPostPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/news" element={<NewsLandingPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:conversationId" element={<MessagesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
