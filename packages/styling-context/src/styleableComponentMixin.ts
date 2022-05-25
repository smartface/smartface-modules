import View from "@smartface/native/ui/view";
import { Styleable } from "./Styleable";
import addContextChild from "./action/addChild";
import removeContextChild from "./action/removeChild";
import { MergeCtor } from "./mixin";
import { ConstructorOf } from "./ConstructorOf";
import type { StyleableDispatch } from ".";

export interface iStyleableContainer extends Styleable {
  // addChild(child: View<any>): void;
  addChild(child: View<any>, name?: string, classNames?: string, userProps?: { [key: string]: any }, defaultClassNames?: string): void;
  addStyleableChild(
    child: View<any>,
    name: string,
    classNames?: string,
    userProps?: { [key: string]: any },
    defaultClassNames?: string
  ): void;

  removeChild(view: View<any>): void;
  dispatch?: StyleableDispatch;
}

export function styleableContainerComponentMixin<T extends ConstructorOf<any>>(ViewClass: T) {
  const Component = class extends ViewClass implements iStyleableContainer {
    constructor(...args: any[]){
      super(...args);
    }

    addChild(child: View<any>, name?: string, classNames?: string, userProps?: { [key: string]: any }, defaultClassNames?: string): void {
      if (this.layout) {
        this.layout.addChild(child);
      } else {
        super.addChild(child);
      }
      if (name) {
        this.addStyleableChild(child, name, classNames, userProps, defaultClassNames);
      }
    }

    addStyleableChild(
      child: View<any>,
      name: string,
      classNames?: string,
      userProps?: { [key: string]: any },
      defaultClassNames?: string
    ): void {
      this.dispatch?.(
        addContextChild(name, child, classNames, userProps, defaultClassNames)
      );
    }

    removeChild(view: View<any>) {
      this.dispatch?.(removeContextChild());
      super.removeChild?.(view);
    }
    dispatch?: StyleableDispatch;
  };

  return Component
}

export function styleableComponentMixin<
  T extends ConstructorOf<any> = ConstructorOf<any>
>(ViewClass: T) {
  return class extends ViewClass implements Styleable {
    dispatch?: StyleableDispatch;
  };
}
