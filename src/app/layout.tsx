
import './styles/global.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="hover:text-gray-200">Home</a></li>
              <li><a href="/login" className="hover:text-gray-200">Login</a></li>
              <li><a href="/dashboard" className="hover:text-gray-200">Dashboard</a></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}