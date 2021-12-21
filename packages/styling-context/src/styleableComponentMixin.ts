import View = require("@smartface/native/ui/view");
import { Styleable } from "./Styleable";
import addContextChild from "./action/addChild";
import removeContextChild from "./action/removeChild";
import { ConstructorOf } from "./ConstructorOf";
import { MergeCtor } from "./mixin";

export function styleableContainerComponentMixin<T extends any>(ViewClass: T) {
  const Component =  class extends (ViewClass as any) implements Styleable {
    addChild(
      child: View<any>
    ): void {
        
      if(this.layout)
        this.layout?.addChild(child);
      else
        super.addChild(child);
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
    dispatch?: (action: { [key: string]: any }) => void;
  };

  return Component as unknown as MergeCtor<typeof Component, typeof ViewClass>;
}

export function styleableComponentMixin<
  T extends ConstructorOf<any> = ConstructorOf<any>
>(ViewClass: T) {
  return class extends (ViewClass as unknown as T) implements Styleable {
    dispatch?: (action: { [key: string]: any }) => void;
  };
}
