import View from "@smartface/native/ui/view";
import { StyleContextComponent } from ".";
import StyleActions from "./styleActions";

export interface StyleablePage {
  readonly dispatch?: StyleContextComponent['dispatch'];
  readonly children?: { [key: string]: View };
  style: StyleActions;
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
