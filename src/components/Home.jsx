import React, { useState, useRef } from 'react';

export default function Home() {
  const [mode, setMode] = useState(null);
  const [message, setMessage] = useState('');
  const [showFeed, setShowFeed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const countdownRef = useRef(null); // store interval ID here

  const sendAction = async (endpoint) => {
    const res = await fetch(`http://localhost:5000/${endpoint}`);
    const text = await res.text();

    if (endpoint === 'calibrate') {
      setMode('calibration');
      setShowFeed(true);
      let timeLeft = 15;

      countdownRef.current = setInterval(() => {
        setMessage(`🧪 Calibrating... ${timeLeft}s remaining`);
        timeLeft--;
        if (timeLeft < 0) {
          clearInterval(countdownRef.current);
          setMode(null);
          setShowFeed(false);
          setMessage('✅ Calibration completed successfully!');
        }
      }, 1000);
    }

    else if (endpoint === 'monitor') {
      clearInterval(countdownRef.current); // in case calibration was running
      setMode('monitor');
      setShowFeed(true);
      setMessage('🟢 Monitoring started.');
    }

    else if (endpoint === 'stop') {
      clearInterval(countdownRef.current);
      setMode(null);
      setShowFeed(false);
      setMessage('⏹️ Monitoring stopped.');
    }

    else if (endpoint === 'reset') {
      clearInterval(countdownRef.current);
      setMode(null);
      setShowFeed(false);
      setMessage('');
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-sky-100 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col items-center px-4 py-10 transition-all duration-300">

        {/* Header */}
        <div className="w-full flex justify-between items-center max-w-4xl mb-6">
          <img src="/ddu.jpg" alt="DDU Logo" className="w-24 h-24 object-contain" />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-white px-5 py-2.5 rounded-full transition"
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Safe Drive AI</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Stay alert. Stay safe.</p>

        {/* Status Message */}
        {message && (
          <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-3 px-5 text-lg mb-6 border-l-4 border-blue-500 dark:border-blue-400">
            {message}
          </div>
        )}

        {/* Video Feed */}
        {showFeed && (
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-xl overflow-hidden border border-gray-300 dark:border-gray-600 w-full max-w-md mb-8">
            <img
              src="http://localhost:5000/video_feed"
              alt="Video Feed"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => sendAction('calibrate')}
            className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 text-lg rounded-full shadow transition duration-200"
          >
            Calibrate
          </button>
          <button
            onClick={() => sendAction('monitor')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-7 py-3 text-lg rounded-full shadow transition duration-200"
          >
            Start Monitoring
          </button>
          <button
            onClick={() => sendAction('stop')}
            className="bg-red-600 hover:bg-red-700 text-white px-7 py-3 text-lg rounded-full shadow transition duration-200"
          >
            Stop
          </button>
          <button
            onClick={() => sendAction('reset')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 text-lg rounded-full shadow transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
