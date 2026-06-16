import React, { useEffect, useState } from 'react';
import { menuApi } from '../../utils/api';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    menuItems: 0,
    totalColumns: 0,
    totalImages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const menuRes = await menuApi.getAllMenuItems();
        const menuItems = menuRes.data || [];

        const totalColumns = menuItems.reduce((sum, item) => sum + (item.columns?.length || 0), 0);
        const totalImages = menuItems.reduce((sum, item) => sum + (item.images?.length || 0), 0);

        setStats({
          menuItems: menuItems.length,
          totalColumns,
          totalImages
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const statCards = [
    { label: 'Menu Items', value: stats.menuItems, color: 'bg-blue-500' },
    { label: 'Total Columns', value: stats.totalColumns, color: 'bg-green-500' },
    { label: 'Total Images', value: stats.totalImages, color: 'bg-purple-500' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${card.color} w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}>
                {card.value}
              </div>
              <div className="ml-4">
                <p className="text-gray-600">{card.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
        <ul className="space-y-3 text-gray-700">
          <li>✓ Google OAuth and Cloudinary are configured</li>
          <li>✓ Create menu items that will appear in the navbar</li>
          <li>✓ Add columns with links to each menu item</li>
          <li>✓ Upload images for the mega menu display</li>
          <li>✓ Preview your mega menu by hovering over navbar items</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
