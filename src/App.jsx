import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Level from './pages/Level';
import LanguageSelect from './pages/LanguageSelect';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import SyntaxSorter from './pages/SyntaxSorter';
import PixelPath from './pages/PixelPath';
import MiniGames from './pages/MiniGames';
import VariableVault from './pages/VariableVault';
import SyntaxRacer from './pages/SyntaxRacer';
import BugHunt from './pages/BugHunt';
import ProtectedRoute from './components/ProtectedRoute';

// Admin imports
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminLevelForm from './pages/AdminLevelForm';

function App() {
  const [splash, setSplash] = useState(true);

  const handleSplashDone = () => {
    setSplash(false);
  };

  if (splash) return <SplashScreen onDone={handleSplashDone} />;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/level/new" element={<AdminLevelForm />} />
      <Route path="/admin/level/edit/:id" element={<AdminLevelForm />} />

      {/* Protected Student Routes */}
      <Route path="/select-language" element={
        <ProtectedRoute>
          <LanguageSelect />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/level/:id" element={
        <ProtectedRoute>
          <Level />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/shop" element={
        <ProtectedRoute>
          <Shop />
        </ProtectedRoute>
      } />
      <Route path="/syntax-sorter" element={
        <ProtectedRoute>
          <SyntaxSorter />
        </ProtectedRoute>
      } />
      <Route path="/pixel-path" element={
        <ProtectedRoute>
          <PixelPath />
        </ProtectedRoute>
      } />
      <Route path="/mini-games" element={
        <ProtectedRoute>
          <MiniGames />
        </ProtectedRoute>
      } />
      <Route path="/variable-vault" element={
        <ProtectedRoute>
          <VariableVault />
        </ProtectedRoute>
      } />
      <Route path="/syntax-racer" element={
        <ProtectedRoute>
          <SyntaxRacer />
        </ProtectedRoute>
      } />
      <Route path="/bug-hunt" element={
        <ProtectedRoute>
          <BugHunt />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
