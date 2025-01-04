const AdminDashboard = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Welcome to Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="font-semibold mb-2">Total Users</h3>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="font-semibold mb-2">Active Mentors</h3>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="font-semibold mb-2">Total Participants</h3>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;