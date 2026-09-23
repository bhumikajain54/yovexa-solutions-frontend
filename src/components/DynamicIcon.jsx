import React from 'react';
import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, className = "w-5 h-5", size, color }) {
  if (!name || typeof name !== 'string') return null;
  const IconComponent = Icons[name.trim()];
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} color={color} />;
}
