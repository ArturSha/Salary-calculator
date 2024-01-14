import { useEffect, useState } from 'react';

export const useMousePosition = () => {
  const [mouseY, setMouseY] = useState(0);
  const [direction, setDirection] = useState('');

  const handleMouseMove = (event: React.MouseEvent) => {
    setMouseY(event.clientY);
  };

  useEffect(() => {
    const calculateDirection = () => {
      const availableSpace = {
        top: mouseY,
        bottom: window.innerHeight - mouseY,
      };

      let popupDirection = '';

      if (availableSpace.bottom > availableSpace.top) {
        popupDirection += 'top';
      } else {
        popupDirection += 'bottom';
      }

      setDirection(popupDirection);
    };

    calculateDirection();
  }, [mouseY]);

  return { mouseY, direction, handleMouseMove };
};
