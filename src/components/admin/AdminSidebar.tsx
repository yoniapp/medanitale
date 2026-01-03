"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FileText, Hospital, Log, BellRing, BarChart3, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { name: 'Dashboard Overview', icon: LayoutDashboard, section: 'overview' },
  { name: 'User Management', icon: Users, section: 'users' },
  { name: 'Prescription Management', icon: FileText, section: 'prescriptions' },
  { name: 'Pharmacy Management', icon: Hospital, section: 'pharmacies' },
  { name: 'Audit & Logs', icon: Log, section: 'logs' }, // Enabled
  // { name: 'Notifications', icon: BellRing, section: 'notifications' }, // Future
  // { name: 'Analytics', icon: BarChart3, section: 'analytics' }, // Future
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground">
            <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
              <Link href="/admin-dashboard" className="flex items-center gap-2 font-semibold">
                <LayoutDashboard className="h-6 w-6" />
                <span className="">Admin Panel</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navItems.map((item) => (
                  <Button
                    key={item.section}
                    variant="ghost"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
                      activeSection === item.section && "bg-sidebar-accent text-sidebar-accent-foreground hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => onSectionChange(item.section)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin-dashboard" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-6 w-6" />
            <span className="">Admin Panel</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Button
                key={item.section}
                variant="ghost"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
                  activeSection === item.section && "bg-sidebar-accent text-sidebar-accent-foreground hover:text-sidebar-accent-foreground"
                )}
                onClick={() => onSectionChange(item.section)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;