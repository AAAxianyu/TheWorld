
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import AchievementsPage from './pages/AchievementsPage'
import EventPage from './pages/EventPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SocialPage from './pages/SocialPage'
import LoginPage from './pages/Login'
import WestLakePoetryTestPage from './pages/WestLakePoetryTestPage'
import Layout from './components/Layout'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-amber-800 font-serif">正在加载古风世界...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    )
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/west-lake-poetry" element={<WestLakePoetryTestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" />
    </Router>
  )
}

export default App
