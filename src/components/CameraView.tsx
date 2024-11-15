import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Pause, Play, AlertCircle, Camera as CameraIcon } from 'lucide-react';
import { useScreenshot } from '../hooks/useScreenshot';

interface CameraViewProps {
  onCapture: (blob: Blob) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export default function CameraView({ onCapture, isRecording, onToggleRecording }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [useFallback, setUseFallback] = useState(false);
  const { captureScreen } = useScreenshot();

  const captureImage = useCallback(async () => {
    if (useFallback) {
      try {
        const blob = await captureScreen();
        onCapture(blob);
      } catch (err) {
        console.error('Screenshot error:', err);
        setError('Failed to capture screenshot');
      }
      return;
    }

    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) onCapture(blob);
    }, 'image/jpeg', 0.95);
  }, [onCapture, useFallback, captureScreen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(captureImage, 3000);
    }
    return () => clearInterval(interval);
  }, [isRecording, captureImage]);

  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        } else {
          setUseFallback(true);
        }
      } catch (err) {
        console.error('Error enumerating devices:', err);
        setUseFallback(true);
      }
    }

    getDevices();
  }, []);

  useEffect(() => {
    if (useFallback) return;

    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        if (!selectedDevice) {
          setError('No camera device selected.');
          return;
        }

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDevice,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError('');
      } catch (err) {
        console.error('Camera error:', err);
        setUseFallback(true);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDevice, useFallback]);

  if (useFallback) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <CameraIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Screenshot Mode</h3>
          <p className="text-gray-600 mb-6">Camera not available. Using screenshot capture instead.</p>
          <button
            onClick={onToggleRecording}
            className={`px-6 py-3 rounded-full flex items-center space-x-2 mx-auto ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors`}
          >
            {isRecording ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Stop Capturing</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Capturing</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Camera Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          {devices.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Camera
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full max-w-xs mx-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative rounded-lg overflow-hidden shadow-xl bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Live Feed</span>
            </div>
            <div className="flex items-center space-x-4">
              {devices.length > 1 && (
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-black/30 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={onToggleRecording}
                className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white transition-colors`}
              >
                {isRecording ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isRecording && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full text-white">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-medium">Recording</span>
          </div>
        </div>
      )}
    </div>
  );
}