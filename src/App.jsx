import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Level from './pages/Level';
import LanguageSelect from './pages/LanguageSelect';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import SyntaxSorter from './pages/SyntaxSorter';
import ProtectedRoute from './components/ProtectedRoute';

// Admin imports
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminLevelForm from './pages/AdminLevelForm';

function App() {
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
    </Routes>
  );
}

export default App;
