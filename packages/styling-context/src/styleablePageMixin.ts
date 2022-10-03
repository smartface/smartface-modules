import View from "@smartface/native/ui/view";
import createPageContext from "./pageContext";
import { ThemeService } from "./ThemeService";
import { StyleContextComponent } from ".";
import { StyleablePage } from "./StyleablePage";
import addContextChild from "./action/addChild";
import removeContextChild from "./action/removeChild";
import removeContextChildren from "./action/removeChildren";
import Page from "@smartface/native/ui/page";
import { MergeCtor } from "./mixin";
import { instanceOfStyleContextComponentType } from "./instanceOfStyleContextComponentType";
import type { ConstructorOf } from "./ConstructorOf";
import StyleActions from "./styleActions";

export function styleablePageMixin<
  T extends typeof Page = typeof Page
>(Pg: T) {
  const StyleablePageClass = class extends (Pg as any) implements StyleablePage {
    dispatch?: StyleContextComponent["dispatch"];
    themeContext?: (action?: any) => void;
    headerBarUpdated: boolean = false;

    constructor(options?: any) {
      super(options);
      this.style = new StyleActions(this.layout);
      if (this.ios) {
        this.ios.onSafeAreaPaddingChange = this.onSafeAreaPaddingChange;
      }
    }

    getName(): string {
      throw new Error("Get Name is not implemented");
    }

    addChild(child: View<any>, name?: string, classNames?: string, userProps?: { [key: string]: any }, defaultClassNames?: string): void {
      if (this.layout) {
        this.layout.addChild(child);
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
      name &&
        this.dispatch?.(
          addContextChild(name, child, classNames, userProps, defaultClassNames)
        );
    }

    updateHeaderBar() {
      if (this.parentController &&
        this.parentController.headerBar &&
        this.headerBar.dispatch &&
        !this.headerBar.__isUpdated) {
        this.headerBar.__isUpdated = true;
        this.headerBar.dispatch({
          type: "updateComponent",
          component: this.parentController.headerBar
        });
      }
      this.headerBar.dispatch({
        type: "forceComponentUpdate",
      });
    }

    componentDidEnter(dispatcher: StyleContextComponent["dispatch"]) {
      this.dispatch = dispatcher;
    }

    onShow() {
      this.updateHeaderBar();
      this.dispatch?.({
        type: "invalidate",
      });
    };

    onOrientationChange({orientation}:{orientation: any}) {
      this.dispatch &&
        this.dispatch({
          type: "orientationStarted",
        });
      // @ts-ignore
      setTimeout(() => {
        this.dispatch &&
          this.dispatch({
            type: "orientationEnded",
          });
      }, 1);
    };

    removeChild(child: View<any>) {
      this.layout.removeChild(child);
      if(instanceOfStyleContextComponentType(child))
        child.dispatch && child.dispatch(removeContextChild());
    }

    removeChildren() {
      this.dispatch?.(removeContextChildren());
    }

    onLoad() {
      // this.themeContext = Application.theme(createPageContext(this, name, null, null), name);
      this.themeContext = ThemeService.instance?.addPage(
        createPageContext(this, this.getName()),
        this.getName()
      );
    }

    dispose() {
      this.removeChildren();
      this.themeContext?.(null);
    }

    onSafeAreaPaddingChange = (paddings: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    }) => {
      const style: {
        paddingLeft?: number;
        paddingRight?: number;
        paddingTop?: number;
        paddingBottom?: number;
      } = {};
      paddings.left != undefined && (style.paddingLeft = paddings.left);
      paddings.right != undefined && (style.paddingRight = paddings.right);
      paddings.top != undefined && (style.paddingTop = paddings.top);
      paddings.bottom != undefined && (style.paddingBottom = paddings.bottom);

      if (this.ios.safeAreaLayoutMode === true) {
        this.dispatch?.({
          type: "updatePageSafeArea",
          safeArea: style,
        });
      }
    }
  }

  return StyleablePageClass as unknown as MergeCtor<ConstructorOf<StyleablePage, ConstructorParameters<T>>, T>;
}
