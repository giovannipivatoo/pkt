import { defaultLocale } from "./locales.ts";

export type LocalizedText = { language: string; value?: string }[];

// Empty translations fall back too, including whitespace-only editor input.
export function localizedText(
  values: LocalizedText | undefined,
  language = defaultLocale,
) {
  return (
    values?.find((item) => item.language === language)?.value?.trim() ||
    values?.find((item) => item.language === defaultLocale)?.value?.trim() ||
    ""
  );
}
