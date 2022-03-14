import Page from "@smartface/native/ui/page";
import View from "@smartface/native/ui/view";

export interface ContextPage extends Page {
  new(name: string, params: Page): ContextPage;
  addStyleableChild(
    child: View,
    name?: string,
    classNames?: string,
    userProps?: { [key: string]: any },
    defaultClassNames?: string
  ): void;
  // headerBar: StyleContextComponentType<HeaderBar>
  // statusBar: StyleContextComponentType<StatusBar>
}

export interface PageClass<T> {
  new (...args: any[]): ContextPage
}
