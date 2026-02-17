
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GROUP_NAMES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Hash, ShoppingBag } from 'lucide-react';
import { GroupName } from '../types';

const DashboardPage: React.FC = () => {
  const { orders } = useApp();

  const salesData = useMemo(() => {
    const dataByGroup = GROUP_NAMES.reduce((acc, groupName) => {
      acc[groupName] = { name: groupName.split('(')[0].trim(), sales: 0, orders: 0 };
      return acc;
    }, {} as Record<GroupName, {name: string, sales: number, orders: number}>);

    orders.forEach(order => {
      if (dataByGroup[order.assignedGroup]) {
        dataByGroup[order.assignedGroup].sales += order.totalPrice;
        dataByGroup[order.assignedGroup].orders += 1;
      }
    });

    return Object.values(dataByGroup);
  }, [orders]);

  const totalSales = salesData.reduce((sum, group) => sum + group.sales, 0);
  const totalOrders = salesData.reduce((sum, group) => sum + group.orders, 0);

  const StatCard = ({ icon, title, value, color }: {icon: React.ReactNode, title: string, value: string | number, color: string}) => (
    <div className="bg-white p-6 rounded-xl shadow-md border flex items-start">
        <div className={`mr-4 p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-brand-green">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green font-serif text-center">Fundraiser Dashboard</h1>
        <p className="text-center text-brand-brown mt-2">An overview of our fundraising progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            icon={<DollarSign className="h-6 w-6 text-green-800"/>} 
            title="Total Revenue" 
            value={`$${totalSales.toFixed(2)}`}
            color="bg-green-100"
        />
        <StatCard 
            icon={<ShoppingBag className="h-6 w-6 text-blue-800"/>} 
            title="Total Orders" 
            value={totalOrders}
            color="bg-blue-100"
        />
        <StatCard 
            icon={<Hash className="h-6 w-6 text-orange-800"/>} 
            title="Avg. Order Value" 
            value={totalOrders > 0 ? `$${(totalSales / totalOrders).toFixed(2)}` : '$0.00'}
            color="bg-orange-100"
        />
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-brand-light-green/50">
        <h2 className="text-2xl font-bold text-brand-green font-serif mb-4">Sales by Group</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={salesData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="sales" fill="#E07A5F" name="Sales Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
