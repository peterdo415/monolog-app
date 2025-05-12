export const runtime = 'edge';           // Edge ランタイムで実行
export const dynamic = 'force-dynamic';  // SSR（サーバーサイドレンダリング）を強制

import Image, { type ImageProps } from "next/image";
import { Button } from "@monolog/ui";
import styles from "./page.module.css";
import { Footer } from './components/Footer'
import { NavBar } from './components/NavBar'
import { LoginStatus } from './components/LoginStatus';

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

type User = {
  id: number;
  name: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main} style={{ marginTop: '64px' }}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>apps/web/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>
        <LoginStatus />
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fapi&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://turborepo.com/api?utm_source"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our api
          </a>
        </div>
        <Button className={styles.secondary}>
          Open alert
        </Button>
      </main>
      <Footer />
    </div>
  );
}
