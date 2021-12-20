import View = require("@smartface/native/ui/view");
import createPageContext from "pageContext";
import { ThemeService } from "./ThemeService";
import { StyleContextComponentType, StyleContextComponent } from ".";
import { StyleablePage } from "./StyleablePage";
import addContextChild from "./action/addChild";
import removeContextChild from "./action/removeChild";
import removeContextChildren from "./action/removeChildren";
import { ContextPage } from "./PageClass";
import { ConstructorOf } from "ConstructorOf";

export function styleablePageMixin<
  T extends new(...args: any[])=>any = new(...args: any[])=>any
>(Pg: T) {
  
  const StyleablePageClass = class extends (Pg as unknown as T) implements StyleablePage {
    dispatch?: StyleContextComponent["dispatch"];
    themeContext?: (action?: any) => void;
    headerBarUpdated: boolean = false;
    name: string;

    constructor(...args: any[]) {
      super(args[1]);
      this.name = args[0];
    }

    addChild(
      child: View,
      name?: string,
      classNames?: string,
      userProps?: { [key: string]: any },
      defaultClassNames?: string
    ): void {
      if(name)
        this.addStyleableChild(child, name, classNames, userProps, defaultClassNames);
      else if(this.layout)
        this.layout.addChild(child);
    }

    addStyleableChild(
      child: View<any>,
      name?: string,
      classNames?: string,
      userProps?: { [key: string]: any },
      defaultClassNames?: string
    ): void {
      name &&
        this.dispatch?.(
          addContextChild(name, child, classNames, userProps, defaultClassNames)
        );
      this.layout.addChild(child);
    }

    updateHeaderBar() {
      if (
        this.parentController &&
        this.parentController.headerBar &&
        !this.headerBarUpdated
      ) {
        this.headerBarUpdated = true;
        this.dispatch?.({
          type: "updateComponent",
          component: this.parentController.headerBar,
        });
      }
    }

    componentDidEnter(dispatcher: StyleContextComponent["dispatch"]) {
      this.dispatch = dispatcher;
    }

    onShow = () => {
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

    onOrientationChange = ({orientation}:{orientation: any}) => {
      this.dispatch &&
        this.dispatch({
          type: "orientationStarted",
        });
      this.layout.applyLayout();
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
        createPageContext(this, this.name),
        this.name
      );
      this.updateHeaderBar();
    }

    dispose() {
      this.removeChildren();
      this.themeContext?.(null);
    }

    onSafeAreaPaddingChange(paddings: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    }) {
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

  return StyleablePageClass;
}
