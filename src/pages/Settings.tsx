
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Settings = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Settings" />
        <main className="flex-1 overflow-y-auto p-6 ml-16 md:ml-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">App Settings</h1>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">App Theme</label>
                    <select className="w-full rounded-md border border-input p-2">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <select className="w-full rounded-md border border-input p-2">
                      <option>English</option>
                      <option>Swahili</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Notifications</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
                <Button className="w-full mt-6">Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
