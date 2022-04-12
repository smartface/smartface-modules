import { EventEmitter } from "@smartface/native/core/eventemitter";
import i18next, { i18n as nextI18N, InitOptions, Resource } from "i18next";

export class i18n {
  static emitter = new EventEmitter();
  static languageFiles: Resource;
  static defaultLocale = "en";
  public static instance: nextI18N;
  constructor(props?: InitOptions) {
    if (i18n.instance) {
      throw new Error("Cannot be instantiated more");
    }
    i18n.languageFiles = props?.resources || {};
    i18n.defaultLocale = props?.lng || i18n.defaultLocale;
    i18n.instance = i18next.createInstance(props);
    i18n.instance.init();
  }
  static onChange(callback: (...args: any[]) => void) {
    return i18n.emitter.on("change", callback);
  }
  static changeLanguage(locale: string, errorCallback: (error: any) => void = () => {}) {
    const localeExists = Object.keys(i18n.languageFiles).find(lang => lang === locale);
    if (localeExists) {
      i18n.instance.changeLanguage(locale, errorCallback).then(() => {
        i18n.emitter.emit("change");
      });
    } else {
      errorCallback("i18nError: Locale doesn't exists | " + locale);
    }
  }
}
