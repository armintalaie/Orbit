'use client';

import React from 'react';
import AuthContextProvider from '@/lib/context/AuthProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
