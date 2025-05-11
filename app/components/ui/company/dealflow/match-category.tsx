"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { MatchCategoryProps, MatchCategoryType } from './types';

const categoryStyles: Record<MatchCategoryType, { base: string, active: string }> = {
  all: {
    base: 'bg-gray-100 text-gray-800',
    active: 'bg-gray-200 ring-2 ring-gray-300'
  },
  ultimate: {
    base: 'bg-purple-100 text-purple-800',
    active: 'bg-purple-200 ring-2 ring-purple-300'
  },
  super: {
    base: 'bg-indigo-100 text-indigo-800',
    active: 'bg-indigo-200 ring-2 ring-indigo-300'
  },
  strong: {
    base: 'bg-blue-100 text-blue-800',
    active: 'bg-blue-200 ring-2 ring-blue-300'
  },
  match: {
    base: 'bg-green-100 text-green-800',
    active: 'bg-green-200 ring-2 ring-green-300'
  }
};

const categoryLabels: Record<MatchCategoryType, string> = {
  all: 'All',
  ultimate: 'Ultimate Match',
  super: 'Super Match',
  strong: 'Strong Match',
  match: 'Match'
};

export default function MatchCategory({ 
  category, 
  count, 
  isActive, 
  onClick 
}: MatchCategoryProps) {
  const styles = categoryStyles[category];
  
  return (
    <button
      onClick={() => onClick(category)}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        styles.base,
        isActive && styles.active
      )}
    >
      {categoryLabels[category]} ({count})
    </button>
  );
} 