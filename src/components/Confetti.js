import React, { useRef, useEffect } from 'react';

const getRandomColor = () => {
  const colors = ['blue', 'pink', 'cyan', 'purple'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomSize = () => 5 + Math.random() * 15;

const generateParticle = (x, y) => {
    const angle = Math.random() * 2 * Math.PI;
    const speed = 2 + Math.random() * 4;
  
    return {
      x,
      y,
      size: getRandomSize(),
      color: getRandomColor(),
      velocityX: speed * Math.cos(angle),
      velocityY: speed * Math.sin(angle),
      rotation: Math.random() * 2 * Math.PI, // random rotation in radians
      age: 0,
    };
  };
  

const Confetti = ({ isActive, origin }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationRef = useRef();  // Reference to store the animation frame ID
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
  
      const drawFrame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        particlesRef.current.forEach(p => {
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.age++;
        
            ctx.save(); // Save the current context state
            ctx.translate(p.x, p.y); // Move the drawing origin to the particle's position
            ctx.rotate(p.rotation); // Rotate the context
            ctx.fillStyle = p.color;
        
            // Now, draw the square relative to its new origin (0, 0 after translation)
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        
            ctx.restore(); // Restore to the previous context state
        });
        
    
        // Clean up old particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            if (particlesRef.current[i].age > 100) {
                particlesRef.current.splice(i, 1);
            }
        }
    
        animationRef.current = requestAnimationFrame(drawFrame);  // Store the ID
    };
    
  
      drawFrame();
  
      // Cancel the animation frame when the component unmounts
      return () => {
        cancelAnimationFrame(animationRef.current);
      };
    }, []);  // Empty dependency array to ensure this effect runs only once
  
    useEffect(() => {
      if (isActive) {
        triggerConfettiEffect();
      }
    }, [isActive]);
  
    const triggerConfettiEffect = () => {
      const x = origin.x;
      const y = origin.y;
  
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push(generateParticle(x, y));
      }
    };
  
    return (
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    );
  };
  
  export default Confetti;
  
