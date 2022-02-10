import { EventEmitter } from "@smartface/native/core/eventemitter";

const PROPERTY_CAPTURE_REGEXP = /[^{\}]+(?=})/g;

export class i18n {
  private emitter = new EventEmitter();
  private languageFiles: {
    locale: string;
    messages: Record<string, string>;
  }[];
  private defaultLocale = "en";
  private currentLocale = "en";
  protected _language: Record<string, string>;
  static instance: i18n;
  constructor(props: { languageFiles: { locale: string; messages: Record<string, string> }[]; defaultLocale: string }) {
    if (i18n.instance) {
      throw new Error("Cannot be instantiated more.");
    }
    this.languageFiles = props?.languageFiles || [];
    this.defaultLocale = props?.defaultLocale || this.defaultLocale;
    this.locale = this.defaultLocale;
    i18n.instance = this;
  }
  protected propsChecker(value: string, props: Record<string, string>) {
    const propsNeeded = value.match(PROPERTY_CAPTURE_REGEXP) || [];
    const propsGot = Object.keys(props);
    const propsGood = propsNeeded.every(p => propsGot.includes(p));
    return {
      propsNeeded,
      propsGot,
      propsGood
    };
  }
  onChange(callback: (...args: any[]) => void) {
    return this.emitter.on("change", callback);
  }
  getMessage(key: string, props?: Record<string, string>): string {
    const value = this._language[key];
    if (value) {
      if ((value.indexOf("{") > -1 || value.indexOf("}") > -1) && props) {
        const { propsNeeded, propsGot, propsGood } = this.propsChecker(value, props);
        if (propsGood) {
          return value.replace(PROPERTY_CAPTURE_REGEXP, p => props[p]);
        } else {
          throw new Error(`Correct props not given for key: ${key} | PropsNeeded: ${propsNeeded} | PropsGot: ${propsGot}.`);
        }
      }
      return value;
    } else {
      throw new Error(`No value found with key: ${key}.`);
    }
  }
  get locale(): string {
    return this.currentLocale;
  }
  set locale(locale: string) {
    const messages = this.languageFiles.find(lf => lf.locale === locale)?.messages;
    if (messages) {
      this._language = messages;
      this.currentLocale = locale;
    } else {
      throw new Error(`Locale not found: ' ${locale}.`);
    }
    this.emitter.emit("change");
  }
}
