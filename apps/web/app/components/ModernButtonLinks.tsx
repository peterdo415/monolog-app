"use client";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight, RocketIcon, BookOpenIcon, ListChecks, Globe2 } from "lucide-react";

export function ModernButtonLinks() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-xl justify-center">
      <a
        href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fapi&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "lg", className: "gap-2 flex items-center rounded-2xl px-6 py-4 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 shadow-md hover:underline underline-offset-4 transition-all duration-200 w-full" })}
      >
        <RocketIcon className="w-5 h-5" />
        Deploy now
        <ArrowUpRight className="w-4 h-4" />
      </a>
      <a
        href="https://turborepo.com/api?utm_source"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "secondary", size: "lg", className: "gap-2 flex items-center rounded-2xl px-6 py-4 bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 shadow-md hover:underline underline-offset-4 transition-all duration-200 w-full" })}
      >
        <BookOpenIcon className="w-5 h-5" />
        Read our api
        <ArrowUpRight className="w-4 h-4" />
      </a>
      <a
        href="#examples"
        className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2 flex items-center rounded-2xl px-6 py-4 bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 shadow-md hover:underline underline-offset-4 transition-all duration-200 w-full" })}
      >
        <ListChecks className="w-5 h-5" />
        Examples
        <ArrowUpRight className="w-4 h-4" />
      </a>
      <a
        href="https://turborepo.com"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "ghost", size: "lg", className: "gap-2 flex items-center rounded-2xl px-6 py-4 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-md hover:underline underline-offset-4 transition-all duration-200 w-full" })}
      >
        <Globe2 className="w-5 h-5" />
        Go to turborepo.com
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
} 