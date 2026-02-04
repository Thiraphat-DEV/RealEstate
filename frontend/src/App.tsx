import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import { HomePage, AuthCallbackPage, SignupPage, FavouritePage, ViewHistoryPage, PropertyDetailPage } from './pages'
import LoginPage from './pages/LoginPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ChatAgent } from './components/chatAgent'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/favourites" element={<FavouritePage />} />
            <Route path="/view-history" element={<ViewHistoryPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* <ChatAgent className="md:right-72" /> */}
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App