// components/BottomMenuBar.tsx
import React from 'react';
import Link from 'next/link';
import styles from './BottomMenuBar.module.css'; // Your CSS module for styling

const BottomMenuBar: React.FC = () => {
  return (
    <div className={styles.menuBar}>
      <Link href="/" legacyBehavior>
        <a className={styles.menuItem}>Home</a>
      </Link>
      <Link href="/tasks" legacyBehavior>
        <a className={styles.menuItem}>Tasks</a>
      </Link>
      <Link href="/profile" legacyBehavior>
        <a className={styles.menuItem}>Profile</a>
      </Link>
    </div>
  );
};

export default BottomMenuBar;
