import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminMessages from './pages/admin/AdminMessages';
import AdminProgress from './pages/admin/AdminProgress';
import AdminSettings from './pages/admin/AdminSettings';

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl font-bold text-benin-bright">404</p>
      <p className="text-fog">Cette page n'existe pas ou a été déplacée.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/projets" element={<Projects />} />
        <Route path="/competences" element={<Skills />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Administration — URL discrète */}
      <Route path="/eudes/-/admin/login" element={<Login />} />
      <Route
        path="/eudes/-/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projets" element={<AdminProjects />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="progression" element={<AdminProgress />} />
        <Route path="reglages" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
