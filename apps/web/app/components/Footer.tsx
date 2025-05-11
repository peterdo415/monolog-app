import Image from "next/image";
import styles from "../page.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/window.svg"
          alt="Window icon"
          width={16}
          height={16}
        />
        Examples
      </a>
      <a
        href="https://turborepo.com?utm_source=create-turbo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/globe.svg"
          alt="Globe icon"
          width={16}
          height={16}
        />
        Go to turborepo.com →
      </a>
    </footer>
  );
} 