"use client";

import "client-only";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type DelayedRedirectProps = {
  delay?: number;
  path: string;
};

export default function DelayedRedirect({
  delay = 1000,
  path,
}: DelayedRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(path);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, path, router]);

  return <div className="size-8" />;
}
