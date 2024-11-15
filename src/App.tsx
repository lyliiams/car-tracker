import React, { useState, useEffect } from 'react';
import { Camera, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';
import CameraView from './components/CameraView';
import History from './components/History';
import Settings from './components/Settings';
import { Settings as SettingsType } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useFirestore } from './hooks/useFirestore';

const SETTINGS_KEY = 'carTrackerSettings';

const defaultSettings: SettingsType = {
  captureInterval: 3,
  maxStorageSize: 1000,
  enableGPS: true,
  enableNotifications: true,
};

function App() {
  const [activeTab, setActiveTab] = useState<'camera' | 'history' | 'settings'>('camera');
  const [isRecording, setIsRecording] = useState(false);
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const location = useGeolocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { captures, loading, error, addCapture, deleteCapture } = useFirestore();

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleCapture = async (blob: Blob) => {
    try {
      await addCapture(blob, settings.enableGPS ? location : undefined);

      if (settings.enableNotifications) {
        try {
          new Notification('Capture Saved', {
            body: 'A new capture has been saved to your history.'
          });
        } catch (e) {
          console.log('Notifications not supported');
        }
      }
    } catch (err) {
      console.error('Failed to save capture:', err);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    try {
      await deleteCapture(id, storagePath);
    } catch (err) {
      console.error('Failed to delete capture:', err);
    }
  };

  const handleSaveSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    if (newSettings.enableNotifications) {
      Notification.requestPermission();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-red-700 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!isMobile && (
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Camera className="w-8 h-8 text-blue-500" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">Car Tracker</h1>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isMobile ? 'pb-20' : 'py-8'}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'camera' && (
              <CameraView
                onCapture={handleCapture}
                isRecording={isRecording}
                onToggleRecording={() => setIsRecording(!isRecording)}
              />
            )}
            {activeTab === 'history' && (
              <History captures={captures} onDelete={handleDelete} />
            )}
            {activeTab === 'settings' && (
              <Settings settings={settings} onSave={handleSaveSettings} />
            )}
          </>
        )}
      </main>

      <nav className={`${isMobile ? 'fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex ${isMobile ? 'justify-around py-3' : 'space-x-4'}`}>
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex flex-col items-center px-3 py-2 text-sm font-medium ${
                activeTab === 'camera'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Camera className="w-6 h-6" />
              <span className="mt-1">Camera</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center px-3 py-2 text-sm font-medium ${
                activeTab === 'history'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HistoryIcon className="w-6 h-6" />
              <span className="mt-1">History</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center px-3 py-2 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <SettingsIcon className="w-6 h-6" />
              <span className="mt-1">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;