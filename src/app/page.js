import Image from 'next/image'
import Link from 'next/link'
import styles from './Home.module.css'

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>NEXT CDN</h1>
        <p className={styles.subtitle}>Hosting File Gratis</p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <h2 className={styles.featureTitle}>Penyimpanan File</h2>
            <p className={styles.featureDescription}>Unggah dan simpan file Anda dengan aman di jaringan kami yang tersebar secara global.</p>
          </div>
          
          <div className={styles.feature}>
            <h2 className={styles.featureTitle}>Pengiriman Cepat</h2>
            <p className={styles.featureDescription}>Kirimkan konten Anda dengan cepat ke pengguna di seluruh dunia menggunakan jaringan edge kami.</p>
          </div>
          
          <div className={styles.feature}>
            <h2 className={styles.featureTitle}>Keamanan Tinggi</h2>
            <p className={styles.featureDescription}>Lindungi aset digital Anda dengan enkripsi tingkat lanjut dan kontrol akses yang ketat.</p>
          </div>
        </div>
        
        <div className={styles.ctaContainer}>
          <Link href="/cdn" className={styles.ctaButton}>
            Mulai Sekarang
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Made with <span className={styles.heart}>❤️</span> in Indonesia</p>
        <p>&copy; 2023 Simpan Siko CDN</p>
      </footer>
    </>
  )
}