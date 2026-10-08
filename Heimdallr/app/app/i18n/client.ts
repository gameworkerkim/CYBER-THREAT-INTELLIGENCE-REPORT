"use client";

import { useCallback, useState } from "react";
import {
  defaultLocale,
  dictionaries,
  type Dictionary,
  type Locale,
} from "./dictionaries";

const COOKIE = "heimdallr_locale";

function isLocale(v: string): v is Locale {
  return v in dictionaries;
}

function readLocale(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE}=([^;]*)`),
  );
  if (match && isLocale(match[1])) return match[1] as Locale;
  const nav = (navigator.language || defaultLocale).slice(0, 2).toLowerCase();
  return isLocale(nav) ? (nav as Locale) : defaultLocale;
}

export function useI18n(): {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
} {
  const [locale, setLocaleState] = useState<Locale>(readLocale);

  const setLocale = useCallback((next: Locale) => {
    document.cookie = `${COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setLocaleState(next);
  }, []);

  return { locale, t: dictionaries[locale], setLocale };
}
