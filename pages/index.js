// pages/index.js

import Head from 'next/head';
import PDFUploader from '../components/PDFUploader';
import styles from './index.module.css'; // Import CSS module for styling

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>PDF Uploader</title>
        <meta name="description" content="Upload PDF files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>PDF Uploader</h1>
        <PDFUploader />
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
