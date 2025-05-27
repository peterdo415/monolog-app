export const runtime = 'edge';           // Edge ランタイムで実行
export const dynamic = 'force-dynamic';  // SSR（サーバーサイドレンダリング）を強制

import Image, { type ImageProps } from "next/image";
import { Button } from "@/components/ui/button";
import { ModernButtonLinks } from "@/components/ModernButtonLinks";
import { ArrowUpRight, RocketIcon, BookOpenIcon } from "lucide-react";
import styles from "./page.module.css";
import { Footer } from './components/Footer'
import { LoginStatus } from './components/common/LoginStatus';
import { cookies } from 'next/headers';

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

export default async function Home() {
  // サーバーサイドでセッションからユーザーを取得（async/awaitでcookieストア取得）
  const cookieStore = await cookies();
  const session = cookieStore.get('monolog_auth_user');
  let user = null;
  if (session) {
    try {
      user = JSON.parse(decodeURIComponent(session.value));
    } catch {}
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-8">
      <main className="w-full max-w-xl flex flex-col items-center gap-12">
        <ThemeImage
          className="mx-auto"
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol className="text-sm leading-6 font-mono list-inside text-center">
          <li>
            Get started by editing <code>apps/web/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>
        <LoginStatus />
        <ModernButtonLinks />
        <Button variant="outline" className="w-full max-w-xs mt-8 mb-8 mx-auto block">
          Open alert
        </Button>
      </main>
      <Footer />
    </div>
  );
}
