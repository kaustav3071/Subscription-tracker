import NavBar from './NavBar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
  <div className="app-grid-overlay noise-layer flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <NavBar />
      <main className="flex-1"> <Outlet /> </main>
      <Footer />
    </div>
  );
};

export default Layout;
