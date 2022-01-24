import { createThemeContextBound } from '@smartface/contx/lib/styling/ThemeContext';
import { pageContext } from '.';
import { StylingBoundry } from './StylingBoundry';
import buildProps from './sfCorePropFactory';

type ThemeListener = (themeName: string) => void;
const themeListenerKeys: {}[] = [];
export class ThemeService {
    private themeListeners = new WeakMap<{}, ThemeListener>();
    private currentTheme = this.themeSources.find(theme => theme.isDefault === true);

    private themeBoundry: (page?: any, name?: string) => (param?: any) => any = createThemeContextBound(this.themeSources);
    static instance: ThemeService;

    constructor(private themeSources: {
        name: string;
        rawStyles: {
            [key: string]: any;
        };
        isDefault: boolean;
    }[]) {
        if (ThemeService.instance) {
            throw new Error("ThemeService cannot be instantiated more than one time.");
        }

        ThemeService.instance = this;
    }

    addPage(page: StylingBoundry, name: string) {
        return this.themeBoundry(page, name);
    }

    addGlobalComponent(component: StylingBoundry, name: string) {
        return this.addPage(pageContext(component, name), name);
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

    getStyle(className: string) {
        return this.themeBoundry()(className);
    }

    getNativeStyle(className: string) {
        return buildProps(this.themeBoundry()(className) || {})
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
