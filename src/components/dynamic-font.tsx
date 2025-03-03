'use client'
import { useEffect } from 'react';

interface DynamicFontProps {
  name: string;
  path: string;
  type?: string;
}

export default function DynamicFont({ name, path, type = 'woff2' }: DynamicFontProps) {
  useEffect(() => {
    // Create a style element for this specific font if it doesn't already exist
    if (!document.getElementById(name)) {
      const style = document.createElement('style');
      style.id = name;
      style.textContent = `
        @font-face {
          font-family: '${name}';
          src: url('${path}') format('${type}');
          font-weight: normal;
          font-style: normal;
        }
      `;
      document.head.appendChild(style);
    }
  }, [name, path, type]);

  return null;
}