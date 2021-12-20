import Data from '@smartface/native/global/data';
import { createThemeContextBound } from '@smartface/contx/lib/styling/ThemeContext';
import { StylingBoundry } from 'StylingBoundry';

type ThemeListener = (themeName: string) => void;
const themeListenerKeys: {}[] = [];
export class ThemeService {
  private themeListeners = new WeakMap<{}, ThemeListener>();
  private themeConfig = this.config.theme;
  private currentTheme = Data.getStringVariable('currentTheme') || this.themeConfig.currentTheme;
  private themeSources = this.themeConfig.themes.map((name: string) => ({
    name,
    // @ts-ignore
    rawStyles: require(`./generated/themes/${name}`),
    isDefault: this.currentTheme === name,
  }));
  private themeBoundry = createThemeContextBound(this.themeSources) as any;
  static instance: ThemeService;
  
  constructor(private config: Record<any, any>) {
    if(ThemeService.instance){
      throw new Error("ThemeService cannot be instantiated one more");
    }

    ThemeService.instance = this;
  }

  addPage(page: StylingBoundry, name: string){
    return this.themeBoundry(page, name);
  }

  onChange(listener: ThemeListener) {
    const key = {};
    themeListenerKeys.push(key);
    this.themeListeners.set(key, listener);
    const deletionIndex = themeListenerKeys.length - 1;

    return () => {
      if (this.themeListeners.has(key)) {
        this.themeListeners.delete(key);
        themeListenerKeys.splice(deletionIndex, 1);
      }
    };
  }
  
  getStyle(className: string){
    console.log("class name : ", className, this.themeBoundry.toString());
    return this.themeBoundry()(className);
  }

  changeTheme(name: string) {
    this.themeBoundry()({
      type: 'changeTheme',
      theme: name,
    });
    themeListenerKeys.forEach((key) => {
        if (this.themeListeners.has(key)) {
          this.themeListeners.get(key)?.(name);
        }
    });
  }
};
