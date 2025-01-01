'use client';

import './styles/global.css';
import { useRouter } from 'next/navigation';
import { getToken } from './utils/storeToken';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleDashboardClick = () => {
    const token = getToken();
    if (token) {
      // If user is logged in, navigate to dashboard
      router.push('/dashboard');
    } else {
      // If not logged in, navigate to login
      router.push('/auth/login');
    }
  };

  const handleHomeClick = () => {};

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="text-xl font-bold">LOGO</div>
          <nav className="space-x-4">
            <a href="/" className="text-gray-700 hover:text-black">
              Home
            </a>
            <a href="/community" className="text-gray-700 hover:text-black">
              Community
            </a>
            <a href="/contact" className="text-gray-700 hover:text-black">
              Contact
            </a>
            <button
              onClick={handleDashboardClick}
              className="text-gray-700 hover:text-black"
            >
              Dashboard
            </button>
          </nav>
        </header>
        <main className="container mx-auto py-8">{children}</main>
        <footer className="bg-white py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="text-lg font-bold mb-2">Page</div>
              <ul className="space-y-2">
                <li>Hello</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Explore</h4>
              <ul className="space-y-2">
                <li>Hello</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Resources</h4>
              <ul className="space-y-2">
                <li>Hello</li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
