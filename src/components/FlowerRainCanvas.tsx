import React, { useEffect, useRef } from 'react';

export type RainIntensity = 'gentle' | 'normal' | 'storm';

interface FlowerRainCanvasProps {
  intensity?: RainIntensity;
  windForce?: number;
  interactiveWind?: boolean;
}

interface FlowerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'sunflower' | 'daisy' | 'petal' | 'sparkle';
  rotation: number;
  rotSpeed: number;
  pitch: number; // 3D flip angle
  pitchSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmplitude: number;
  opacity: number;
  colorVariation: string; // e.g. gold, lemon, amber
  depth: number; // 0.4 to 1.2
}

export const FlowerRainCanvas: React.FC<FlowerRainCanvasProps> = ({
  intensity = 'normal',
  windForce = 0.4,
  interactiveWind = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; vx: number; vy: number; active: boolean }>({
    x: -100,
    y: -100,
    vx: 0,
    vy: 0,
    active: false,
  });

  const particlesRef = useRef<FlowerParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  const getTargetCount = (int: RainIntensity, width: number) => {
    const base = width < 768 ? 45 : 85;
    if (int === 'gentle') return Math.floor(base * 0.6);
    if (int === 'storm') return Math.floor(base * 1.8);
    return base;
  };

  const createParticle = (width: number, height: number, startAtTop = false): FlowerParticle => {
    const types: FlowerParticle['type'][] = ['petal', 'petal', 'petal', 'sunflower', 'daisy', 'sparkle'];
    const type = types[Math.floor(Math.random() * types.length)];
    const depth = 0.5 + Math.random() * 0.7; // parallax depth

    let size = 18;
    if (type === 'petal') size = 12 + Math.random() * 14;
    else if (type === 'sunflower') size = 22 + Math.random() * 16;
    else if (type === 'daisy') size = 16 + Math.random() * 12;
    else if (type === 'sparkle') size = 4 + Math.random() * 4;

    size *= depth;

    // Palette: golden yellows, warm ambers, bright lemons
    const colors = ['#FACC15', '#F59E0B', '#FDE047', '#FEF08A', '#EAB308'];
    const colorVariation = colors[Math.floor(Math.random() * colors.length)];

    return {
      x: Math.random() * width,
      y: startAtTop ? -size - Math.random() * 80 : Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (1.2 + Math.random() * 1.8) * depth,
      size,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      pitch: Math.random() * Math.PI,
      pitchSpeed: 0.02 + Math.random() * 0.03,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.025,
      swayAmplitude: (1.2 + Math.random() * 2.2) * depth,
      opacity: 0.75 + Math.random() * 0.25,
      colorVariation,
      depth,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize particles
    const targetCount = getTargetCount(intensity, width);
    particlesRef.current = Array.from({ length: targetCount }, () =>
      createParticle(width, height, false)
    );

    let lastTime = performance.now();

    // Render helper for single petal with 3D curvature
    const drawPetal = (
      c: CanvasRenderingContext2D,
      p: FlowerParticle
    ) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      // 3D pitch tumble effect: compress height via pitch
      const scaleY = Math.cos(p.pitch);
      c.scale(1, Math.max(0.15, Math.abs(scaleY)));

      c.beginPath();
      // Organic tear/oval petal
      c.moveTo(0, -p.size);
      c.bezierCurveTo(p.size * 0.8, -p.size * 0.4, p.size * 0.6, p.size * 0.8, 0, p.size);
      c.bezierCurveTo(-p.size * 0.6, p.size * 0.8, -p.size * 0.8, -p.size * 0.4, 0, -p.size);

      // Gradient for rich glowing yellow petal
      const grad = c.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, '#FEF08A');
      grad.addColorStop(0.5, p.colorVariation);
      grad.addColorStop(1, '#D97706');

      c.fillStyle = grad;
      c.shadowColor = 'rgba(245, 158, 11, 0.45)';
      c.shadowBlur = 8 * p.depth;
      c.fill();

      // Subtle petal central vein
      c.beginPath();
      c.moveTo(0, -p.size * 0.7);
      c.lineTo(0, p.size * 0.6);
      c.strokeStyle = 'rgba(217, 119, 6, 0.35)';
      c.lineWidth = 1;
      c.stroke();

      c.restore();
    };

    // Render sunflower with rotating layered petals and seed core
    const drawSunflower = (
      c: CanvasRenderingContext2D,
      p: FlowerParticle
    ) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      const scaleY = Math.cos(p.pitch * 0.7);
      c.scale(1, Math.max(0.3, Math.abs(scaleY)));

      const petalCount = 14;
      const radius = p.size * 0.85;

      // Outer golden petals
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * (Math.PI * 2)) / petalCount;
        c.save();
        c.rotate(angle);
        c.beginPath();
        c.moveTo(0, 0);
        c.quadraticCurveTo(radius * 0.28, -radius * 0.6, 0, -radius);
        c.quadraticCurveTo(-radius * 0.28, -radius * 0.6, 0, 0);

        const pGrad = c.createLinearGradient(0, 0, 0, -radius);
        pGrad.addColorStop(0, '#F59E0B');
        pGrad.addColorStop(0.6, '#FDE047');
        pGrad.addColorStop(1, '#FEF08A');

        c.fillStyle = pGrad;
        c.fill();
        c.restore();
      }

      // Inner floral center / disc floret
      c.beginPath();
      c.arc(0, 0, radius * 0.38, 0, Math.PI * 2);
      const centerGrad = c.createRadialGradient(0, 0, 1, 0, 0, radius * 0.38);
      centerGrad.addColorStop(0, '#78350F');
      centerGrad.addColorStop(0.7, '#451A03');
      centerGrad.addColorStop(1, '#92400E');
      c.fillStyle = centerGrad;
      c.fill();

      // Golden pollen ring
      c.beginPath();
      c.arc(0, 0, radius * 0.42, 0, Math.PI * 2);
      c.strokeStyle = 'rgba(253, 224, 71, 0.7)';
      c.lineWidth = 1.5;
      c.setLineDash([2, 2]);
      c.stroke();
      c.setLineDash([]);

      c.restore();
    };

    // Render yellow daisy / margarita
    const drawDaisy = (
      c: CanvasRenderingContext2D,
      p: FlowerParticle
    ) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      const scaleY = Math.cos(p.pitch * 0.6);
      c.scale(1, Math.max(0.3, Math.abs(scaleY)));

      const petalCount = 10;
      const radius = p.size * 0.75;

      for (let i = 0; i < petalCount; i++) {
        const angle = (i * (Math.PI * 2)) / petalCount;
        c.save();
        c.rotate(angle);
        c.beginPath();
        c.ellipse(0, -radius * 0.6, radius * 0.22, radius * 0.55, 0, 0, Math.PI * 2);
        c.fillStyle = p.colorVariation;
        c.fill();
        c.restore();
      }

      // Center
      c.beginPath();
      c.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
      c.fillStyle = '#D97706';
      c.fill();

      c.restore();
    };

    // Render golden fairy sparkle
    const drawSparkle = (
      c: CanvasRenderingContext2D,
      p: FlowerParticle
    ) => {
      c.save();
      c.translate(p.x, p.y);
      const glow = (Math.sin(p.swayPhase * 3) + 1) * 0.5;
      c.beginPath();
      c.arc(0, 0, p.size * (0.8 + glow * 0.4), 0, Math.PI * 2);
      c.fillStyle = 'rgba(254, 240, 138, 0.9)';
      c.shadowColor = '#F59E0B';
      c.shadowBlur = 12;
      c.fill();
      c.restore();
    };

    // Animation Loop
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Adjust particle count if target changed
      const currentTarget = getTargetCount(intensity, width);
      const currentParticles = particlesRef.current;

      while (currentParticles.length < currentTarget) {
        currentParticles.push(createParticle(width, height, true));
      }
      if (currentParticles.length > currentTarget) {
        currentParticles.splice(currentTarget);
      }

      // Mouse displacement calculation
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mActive = mouseRef.current.active;

      for (let i = 0; i < currentParticles.length; i++) {
        const p = currentParticles[i];

        // Sway progression
        p.swayPhase += p.swaySpeed;
        const swayX = Math.sin(p.swayPhase) * p.swayAmplitude;

        // Apply wind and gravity
        p.y += p.vy * (60 * dt);
        p.x += (p.vx + windForce * 1.2 + swayX) * (60 * dt);

        p.rotation += p.rotSpeed * (60 * dt);
        p.pitch += p.pitchSpeed * (60 * dt);

        // Interactive wind displacement around mouse cursor
        if (mActive && interactiveWind) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.hypot(dx, dy);
          const pushRadius = 130;
          if (dist < pushRadius && dist > 0) {
            const force = (1 - dist / pushRadius) * 4;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force + mouseRef.current.vy * 0.1;
            p.rotation += 0.08;
          }
        }

        // Draw particle based on type
        if (p.type === 'sunflower') {
          drawSunflower(ctx, p);
        } else if (p.type === 'daisy') {
          drawDaisy(ctx, p);
        } else if (p.type === 'sparkle') {
          drawSparkle(ctx, p);
        } else {
          drawPetal(ctx, p);
        }

        // Wrap around when falling past bottom or side
        if (p.y > height + p.size + 40) {
          currentParticles[i] = createParticle(width, height, true);
        } else if (p.x < -p.size - 50) {
          p.x = width + p.size;
        } else if (p.x > width + p.size + 50) {
          p.x = -p.size;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [intensity, windForce, interactiveWind]);

  // Mouse & Touch interaction tracking with ethereal golden pollen trail
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const prevX = mouseRef.current.x;
    const prevY = mouseRef.current.y;
    const vx = e.clientX - prevX;
    const vy = e.clientY - prevY;
    const speed = Math.hypot(vx, vy);

    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      vx,
      vy,
      active: true,
    };

    // Ethereal pollen trail when cursor glides
    if (speed > 4 && particlesRef.current.length < 160 && Math.random() < 0.65) {
      particlesRef.current.push({
        x: e.clientX + (Math.random() - 0.5) * 16,
        y: e.clientY + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -0.8 - Math.random() * 1.4, // float upwards gently like fairy dust
        size: 3 + Math.random() * 4,
        type: 'sparkle',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 0.05,
        pitch: 0,
        pitchSpeed: 0,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.04,
        swayAmplitude: 1.5,
        opacity: 0.95,
        colorVariation: '#FEF08A',
        depth: 1.1,
      });
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      mouseRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        vx: touch.clientX - prevX,
        vy: touch.clientY - prevY,
        active: true,
      };
    }
  };

  // Click to trigger a blossom burst of petals right at touch point!
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Burst 12 new petals outwards
    const burstCount = 14;
    for (let i = 0; i < burstCount; i++) {
      const angle = (i * Math.PI * 2) / burstCount + (Math.random() - 0.5);
      const speed = 2.5 + Math.random() * 4;
      const depth = 0.8 + Math.random() * 0.4;
      const colors = ['#FACC15', '#F59E0B', '#FDE047', '#FEF08A'];

      particlesRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 16 * depth,
        type: i % 3 === 0 ? 'sunflower' : 'petal',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        pitch: Math.random() * Math.PI,
        pitchSpeed: 0.05,
        swayPhase: Math.random() * Math.PI,
        swaySpeed: 0.03,
        swayAmplitude: 2,
        opacity: 1,
        colorVariation: colors[i % colors.length],
        depth,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-auto -z-10 cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
