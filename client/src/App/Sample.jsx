import React, { useEffect, useState } from 'react';

function AnimatedProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white px-4">
      <div className="w-full max-w-md h-6 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-700">{progress}%</p>
    </div>
  );
}

export default AnimatedProgressBar;
