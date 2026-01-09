'use client';

import React from 'react';

export function AnimatedBackground() {
  const orbs = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    width: Math.random() * 300 + 50,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: ['#a855f7', '#d946ef', '#8b5cf6', '#c084fc'][Math.floor(Math.random() * 4)],
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-0 left-0 w-full h-full">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              width: orb.width,
              height: orb.width,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              animationDuration: `${orb.duration}s`,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
