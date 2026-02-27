import "server-only";
import { dictionaries } from "./config";

export const getDictionary = async (locale: string) => {
  const dictionary = locale in dictionaries ? locale : "en";
  return dictionaries[dictionary as keyof typeof dictionaries]();
};
