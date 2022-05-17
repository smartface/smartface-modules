import StatusBar = require("@smartface/native/application/statusbar");
import HeaderBar = require("@smartface/native/ui/headerbar");
import Page = require("@smartface/native/ui/page");
import View = require("@smartface/native/ui/view");
import { StyleContextComponentType } from "index";

export interface ContextPage extends Page {
  new(name: string, params: ConstructorParameters<typeof Page>): ContextPage;
  addStyleableChild(
    child: View<any>,
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
