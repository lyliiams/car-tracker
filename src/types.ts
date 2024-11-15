export interface CaptureData {
  id: string;
  timestamp: number;
  imageUrl: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Settings {
  captureInterval: number;
  maxStorageSize: number;
  enableGPS: boolean;
  enableNotifications: boolean;
}