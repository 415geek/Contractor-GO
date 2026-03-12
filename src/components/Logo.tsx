"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo = ({ size = 'md', className, showText = false }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-12 w-auto',
    md: 'h-16 w-auto',
    lg: 'h-20 w-auto',
    xl: 'h-28 w-auto',
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img
              src="/logo.png"
              alt="Builder+"
              className={cn(sizeClasses[size], "object-contain")}
            />
    </div>
  );
};

export default Logo;