import * as React from 'react';

// Simple provider wrapper (blockchain functionality removed for Emergent deployment)
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}