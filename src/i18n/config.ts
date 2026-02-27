export const languages = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = languages[0];

export function getLanguageFromPath(pathname: string): Language {
  const langCode = pathname.split("/")[1];
  return languages.find((lang) => lang.code === langCode) || defaultLanguage;
}

import en from "./dictionaries/en.json";
import ar from "./dictionaries/ar.json";

export type Dictionary = typeof en;

export const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
};
