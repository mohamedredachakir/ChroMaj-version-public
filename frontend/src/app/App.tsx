import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AdminPage } from './pages/AdminPage'
import { ArtistDetailPage } from './pages/ArtistDetailPage'
import { ArtistsPage } from './pages/ArtistsPage'
import { AuthPage } from './pages/AuthPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { EventsPage } from './pages/EventsPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StoryDetailPage } from './pages/StoryDetailPage'
import { StoriesPage } from './pages/StoriesPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen overflow-x-hidden bg-black text-white">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:id" element={<StoryDetailPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:id" element={<ArtistDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
