import React from 'react';
import { FaTruck, FaCreditCard } from 'react-icons/fa';

interface Task {
  id: string;
  title: string;
  type: string;
  icon: 'delivery' | 'payment';
}

export default function TaskList() {
  const tasks: Task[] = [
    { id: '1', title: 'Toolbox', type: 'Deliver', icon: 'delivery' },
    { id: '2', title: 'Toolbox', type: 'Payment', icon: 'payment' },
  ];

  const getIcon = (type: Task['icon']) => {
    switch (type) {
      case 'delivery':
        return <FaTruck className="text-blue-500" size={20} />;
      case 'payment':
        return <FaCreditCard className="text-green-500" size={20} />;
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <button
          key={task.id}
          className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              {getIcon(task.icon)}
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-800">{task.title}</div>
              <div className="text-sm text-gray-500">{task.type}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}