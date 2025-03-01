import Link from "next/link";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        <li><Link href="/dashboard/profile">Profile</Link></li>
        <li><Link href="/dashboard/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
