'use client';

import { Sidebar } from '@/components/ui/Sidebar';
import { RightSidebar } from '@/components/ui/RightSidebar';
import { LivePreview } from '@/components/ui/LivePreview';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Sidebar />
      <div className={styles.content}>
        <LivePreview />
      </div>
      <RightSidebar />
    </main>
  );
}
