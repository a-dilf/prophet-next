import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FlashingHeaderProps {
  text?: string;
  href?: string;
}

const FlashingHeader: React.FC<FlashingHeaderProps> = ({ 
  text = "(((>>> BUY HERE <<<)))",
  href = "/prophet"
}) => {
  const [colorIndex, setColorIndex] = useState<number>(0);
  
  // Material Design color palette
  const colors: string[] = [
    'rgb(255, 87, 34)',  // Deep Orange
    'rgb(233, 30, 99)',  // Pink
    'rgb(33, 150, 243)', // Blue
    'rgb(76, 175, 80)',  // Green
    'rgb(255, 193, 7)'   // Amber
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 100); // Change color every second

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      <Link 
        href={href}
        className="no-underline block w-full"
      >
        <h1
          className="text-center text-4xl font-bold p-4 transition-colors duration-500"
          style={{ 
            color: colors[colorIndex],
            textShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
          }}
        >
          {text}
        </h1>
      </Link>
    </div>
  );
};

export default FlashingHeader;