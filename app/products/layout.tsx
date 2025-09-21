'use client';

import React from 'react';
import AdminSidebar from '@/components/AdminSidebar/SideBar';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        {children}
      </div>
    </div>
  );
}