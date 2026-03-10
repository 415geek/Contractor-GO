"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo = ({ size = 'md', className, showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  };

  const textSizeClasses = {
    sm: 'text-[14px]',
    md: 'text-[18px]',
    lg: 'text-[22px]',
    xl: 'text-[28px]',
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Logo Icon - SVG version of the saw design */}
      <div className={cn(
        "bg-[#07C160] rounded-2xl flex items-center justify-center p-2",
        sizeClasses[size]
      )}>
        <svg 
          viewBox="0 0 100 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Saw handle */}
          <rect x="5" y="25" width="25" height="35" rx="5" stroke="white" strokeWidth="4" fill="none"/>
          <rect x="10" y="30" width="15" height="25" rx="3" stroke="white" strokeWidth="2" fill="none"/>
          
          {/* Saw blade */}
          <rect x="30" y="35" width="60" height="12" fill="white"/>
          
          {/* Saw teeth */}
          <path d="M90 47 L85 60 L80 47 L75 60 L70 47 L65 60 L60 47 L55 60 L50 47 L45 60 L40 47 L35 60 L30 47" 
                fill="white"/>
        </svg>
      </div>
      
      {showText && (
        <div className="mt-2 text-center">
          <h1 className={cn("font-bold text-[#191919]", textSizeClasses[size])}>
            Builder<span className="text-[#07C160]">+</span>
          </h1>
          <p className="text-[10px] text-[#888888] tracking-wider uppercase">Project Management</p>
        </div>
      )}
    </div>
  );
};

export default Logo;