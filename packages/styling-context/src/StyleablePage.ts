import HeaderBar = require("@smartface/native/ui/headerbar");
import View = require("@smartface/native/ui/view");
import { StyleContextComponent } from ".";

export interface StyleablePage {
  readonly dispatch?: StyleContextComponent['dispatch'];
  getName(): string;
  addChild(child: View<any>, name?: string, classNames?: string, userProps?: { [key: string]: any }, defaultClassNames?: string): void;
  addStyleableChild(
    child: View<any>,
    name: string,
    classNames?: string,
    userProps?: { [key: string]: any },
    defaultClassNames?: string
  ): void;
  removeChild(child: View<any>):void;
  removeChildren():void;
}
