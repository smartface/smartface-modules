import View = require("@smartface/native/ui/view");
import createPageContext from "./pageContext";
import { ThemeService } from "./ThemeService";
import { StyleContextComponentType, StyleContextComponent } from ".";
import { StyleablePage } from "./StyleablePage";
import addContextChild from "./action/addChild";
import removeContextChild from "./action/removeChild";
import removeContextChildren from "./action/removeChildren";
import Page = require("@smartface/native/ui/page");
import { MergeCtor } from "./mixin";

export function styleablePageMixin<
  T extends Page
>(Pg: T) {
  const StyleablePageClass = class extends (Pg as any) implements StyleablePage {
    dispatch?: StyleContextComponent["dispatch"];
    themeContext?: (action?: any) => void;
    headerBarUpdated: boolean = false;

    constructor(args: any) {
      super(args);
      if (this.ios) {
        this.ios.onSafeAreaPaddingChange = this.onSafeAreaPaddingChange;
      }
    }

    getName(): string {
      throw new Error("Get Name is not implemented");
    }

    addChild(
      child: View<any>
    ): void {
      if(this.layout)
        this.layout.addChild(child);
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
    }

    componentDidEnter(dispatcher: StyleContextComponent["dispatch"]) {
      this.dispatch = dispatcher;
    }

    onShow() {
      this.updateHeaderBar();
      this.dispatch?.({
        type: "invalidate",
      });
      this.dispatch?.({
        type: "forceComponentUpdate",
        name: "statusbar",
      });

      this.layout.applyLayout();
    };

    onOrientationChange({orientation}:{orientation: any}) {
      this.dispatch &&
        this.dispatch({
          type: "orientationStarted",
        });
      this.layout.applyLayout();
      // @ts-ignore
      setTimeout(() => {
        this.dispatch &&
          this.dispatch({
            type: "orientationEnded",
          });
        this.layout.applyLayout();
      }, 1);
    };

    removeChild(child: StyleContextComponentType<View>) {
      this.layout.removeChild(child);
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

        this.layout.applyLayout();
      }
    }
  }

  return StyleablePageClass as MergeCtor<typeof StyleablePageClass, T>;
}
