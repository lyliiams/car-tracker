import React from 'react';
import { Settings as SettingsType } from '../types';
import { Save, RefreshCw, Bell, Map } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
}

export default function Settings({ settings, onSave }: SettingsProps) {
  const [formData, setFormData] = React.useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-gray-700 mb-2">
              <RefreshCw className="w-4 h-4" />
              <span>Capture Interval (seconds)</span>
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={formData.captureInterval}
              onChange={(e) => setFormData({
                ...formData,
                captureInterval: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-gray-700 mb-2">
              <Save className="w-4 h-4" />
              <span>Max Storage Size (MB)</span>
            </label>
            <input
              type="number"
              min="100"
              max="5000"
              value={formData.maxStorageSize}
              onChange={(e) => setFormData({
                ...formData,
                maxStorageSize: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Map className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Enable GPS Tracking</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableGPS}
                onChange={(e) => setFormData({
                  ...formData,
                  enableGPS: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Enable Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableNotifications}
                onChange={(e) => setFormData({
                  ...formData,
                  enableNotifications: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </form>
    </div>
  );
}