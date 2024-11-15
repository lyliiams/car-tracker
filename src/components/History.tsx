import React, { useMemo } from 'react';
import { Calendar, MapPin, Clock, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { CaptureData } from '../types';

interface HistoryProps {
  captures: CaptureData[];
  onDelete: (id: string) => void;
}

interface GroupedCaptures {
  [date: string]: CaptureData[];
}

export default function History({ captures, onDelete }: HistoryProps) {
  const [expandedDates, setExpandedDates] = React.useState<Set<string>>(new Set());

  const groupedCaptures = useMemo(() => {
    return captures.reduce((groups: GroupedCaptures, capture) => {
      const date = new Date(capture.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(capture);
      return groups;
    }, {});
  }, [captures]);

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (expandedDates.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Capture History</h2>
      <div className="space-y-4">
        {Object.entries(groupedCaptures).map(([date, dateCaptures]) => (
          <div key={date} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleDate(date)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{date}</span>
                <span className="text-sm text-gray-500">
                  ({dateCaptures.length} captures)
                </span>
              </div>
              {expandedDates.has(date) ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedDates.has(date) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {dateCaptures.map((capture) => (
                  <div
                    key={capture.id}
                    className="bg-gray-50 rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <div className="relative">
                      <img
                        src={capture.imageUrl}
                        alt={`Capture at ${formatTime(capture.timestamp)}`}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => onDelete(capture.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{formatTime(capture.timestamp)}</span>
                        </div>
                        {capture.location && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">
                              {capture.location.latitude.toFixed(6)}, 
                              {capture.location.longitude.toFixed(6)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {captures.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No captures yet. Start recording to see your history.</p>
          </div>
        )}
      </div>
    </div>
  );
}