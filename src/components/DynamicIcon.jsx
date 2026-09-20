import React from 'react';
import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, className = "w-5 h-5", size, color }) {
  const IconComponent = Icons[name] || Icons.Code2 || Icons.Sparkles;
  return <IconComponent className={className} size={size} color={color} />;
}
