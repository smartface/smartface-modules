import View from "@smartface/native/ui/view";
import { Styleable } from "./Styleable";
import addContextChild from "./action/addChild";
import removeContextChild from "./action/removeChild";
import { ConstructorOf } from "./ConstructorOf";
import { StyleableDispatch } from ".";
import StyleActions from "./styleActions";
import { IViewGroup } from "@smartface/native/ui/viewgroup/viewgroup";
import { IFlexLayout } from "@smartface/native/ui/flexlayout/flexlayout";
import { IView } from "@smartface/native/ui/view/view";
import { ISliderDrawer } from "@smartface/native/ui/sliderdrawer/sliderdrawer";
import { IShimmerFlexLayout } from "@smartface/native/ui/shimmerflexlayout/shimmerflexlayout";
import SwipeItem from "@smartface/native/ui/swipeitem";

export interface iStyleableContainer extends Styleable {
  // addChild(child: View<any>): void;
  addChild(child: View<any>, name?: string, classNames?: string, userProps?: { [key: string]: any }, defaultClassNames?: string): void;
  addStyleableChild(child: View<any>, name: string, classNames?: string, userProps?: { [key: string]: any }, defaultClassNames?: string): void;

  removeChild(view: View<any>): void;
  dispatch?: StyleableDispatch;
}

export function styleableContainerComponentMixin<T extends ConstructorOf<IViewGroup> | ConstructorOf<ISliderDrawer> | ConstructorOf<IShimmerFlexLayout>>(ViewClass: T) {
  const Component = class extends ViewClass implements iStyleableContainer {
    dispatch?: StyleableDispatch;
    style: StyleActions;
    layout?: IFlexLayout;
    constructor(...args: any[]) {
      super(...args);
      this.style = new StyleActions<typeof this>((this as any).layout || this);
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

    addStyleableChild(child: View<any>, name: string, classNames?: string, userProps?: { [key: string]: any }, defaultClassNames?: string): void {
      this.dispatch?.(addContextChild(name, child, classNames, userProps, defaultClassNames));
    }

    removeChild(view: View<any>) {
      this.dispatch?.(removeContextChild(view));
      super.removeChild?.(view);
    }
  };

  return Component;
}

export function styleableComponentMixin<T extends ConstructorOf<IView> | ConstructorOf<SwipeItem>>(ViewClass: T) {
  return class extends ViewClass implements Styleable {
    dispatch?: StyleableDispatch;
    style: StyleActions;
    constructor(...args: any[]) {
      super(...args);
      this.style = new StyleActions<typeof this>(this);
    }
  };
}
