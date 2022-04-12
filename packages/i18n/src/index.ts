import { EventEmitter } from "@smartface/native/core/eventemitter";
import i18next, { i18n as nextI18N, InitOptions, Resource } from "i18next";

export class i18n {
  private emitter = new EventEmitter();
  private languageFiles: Resource;
  private defaultLocale = "en";
  static instance: nextI18N;
  constructor(props?: InitOptions) {
    if (i18n.instance) {
      throw new Error("Cannot be instantiated more");
    }
    this.languageFiles = props?.resources || {};
    this.defaultLocale = props?.lng || this.defaultLocale;
    i18n.instance = i18next.createInstance(props);
    i18n.instance.init();
  }
  get instance(): nextI18N {
    return i18n.instance;
  }
  changeLanguage(locale: string, errorCallback: (error: any) => void = () => {}) {
    const localeExists = Object.keys(this.languageFiles).find(lang => lang === locale);
    if (localeExists) {
      i18n.instance.changeLanguage(locale, errorCallback).then(() => {
        this.emitter.emit("change");
      });
    } else {
      errorCallback("i18nError: Locale doesn't exists | " + locale);
    }
  }
}
