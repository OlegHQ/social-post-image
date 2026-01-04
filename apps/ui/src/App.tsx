import React from 'react';
import { DesignProvider } from './context/DesignContext';
import { Sidebar } from './components/Sidebar';
import { LivePreview } from './components/LivePreview';
import styles from './App.module.css';

export function App() {
  return (
    <DesignProvider>
      <div className={styles.app}>
        <Sidebar />
        <main className={styles.main}>
          <LivePreview />
        </main>
      </div>
    </DesignProvider>
  );
}
