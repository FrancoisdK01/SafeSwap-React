import React from 'react';
import TaskList from '../components/tasks/TaskList';
import Header from '../components/Header';

export default function Tasks() {
  return (
    <div className="flex-1">
      <Header title="SafeTasks" />
      <main className="p-4">
        <TaskList />
      </main>
    </div>
  );
}