// src/app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <aside>
          <nav>
            <ul>
              <li><a href="/dashboard">Home</a></li>
              <li><a href="/dashboard/profile">Profile</a></li>
              <li><a href="/dashboard/documents">Profile</a></li>
            </ul>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    );
  }
  