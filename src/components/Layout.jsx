import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      <Navbar />
      <main className="fade-in">
        <Outlet />
      </main>
    </div>
  );
}
