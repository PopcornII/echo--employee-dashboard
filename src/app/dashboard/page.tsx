import DashboardLayout from '@/app/components/DashboardLayout';
import { defaultMaxListeners } from 'events';

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold">Welcome to the Dashboard</h2>
      <p>This is the home page.</p>
    </div>
  );
};

Dashboard.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
