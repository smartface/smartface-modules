//------------------------------------------------------------------------------
//
//     This code was auto generated.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
//
//------------------------------------------------------------------------------
import pageContextPatch from "@smartface/contx/lib/smartface/pageContextPatch";
import Page = require("@smartface/native/ui/page");
import type View = require("@smartface/native/ui/view");
import { ComponentStyleContext } from "../src/ComponentStyleContext";
import Button = require("@smartface/native/ui/button");
import { StyleContextComponentWithDispatch } from "../src/";
import { styleablePageMixin } from "../src//styleablePageMixin";
import { styleableComponentMixin, styleableContainerComponentMixin } from "../src/styleableComponentMixin";
import { extendOfViewGroup } from "../src/extendOfViewGroup";
import StatusBar = require("@smartface/native/application/statusbar");
import HeaderBar = require("@smartface/native/ui/headerbar");
import FlexLayout = require("@smartface/native/ui/flexlayout");


$Flex = styleableContainerComponentMixin(FlexLayout)

// if(extendOfViewGroup(FlexLayout)) {
//   FlexLayout.prototype.addChild
  
//   styleableContainerComponentMixin(FlexLayout)
// } else {
  styleableComponentMixin(FlexLayout);

// }


// const flex = new Flex();
// flex.addChild()

// cannot catch the type is container or not with class $$BtnNext
// therefore a variable is used
const $$BtnNext = class extends Button {
  static $$styleContext: ComponentStyleContext = {
    classNames: ".sf-button",
    defaultClassNames: ".default_common .default_button",
    userProps: {
      flexProps: { alignSelf: "AUTO", positionType: "RELATIVE" },
      width: null,
    }
  };

  constructor() {
    super({ text: "Next Page" });
  }
}
interface Children {
  btnNext: StyleContextComponentWithDispatch<Button>;
  statusBar?: StatusBar;
  headerBar?: HeaderBar;
  [key: string]: any;
};
const $BtnNext = (extendOfViewGroup($$BtnNext)
  ? styleableContainerComponentMixin($$BtnNext)
  : styleableComponentMixin($$BtnNext));

const but = new $BtnNext();
class $Page extends styleablePageMixin(Page) {
  private _children: Children;
  get children(): Readonly<Children> {
    return this._children;
  }

  static $$styleContext: ComponentStyleContext = {
    classNames: ".sf-page",
    defaultClassNames: " .default_page",
    userProps: {
      flexProps: { justifyContent: "SPACE_BETWEEN", alignItems: "STRETCH" },
      paddingBottom: 20,
      paddingLeft: 16,
      paddingRight: 16,
    },
    statusBar: {
      classNames: ".sf-statusBar",
      defaultClassNames: " .default_statusBar",
      userProps: { visible: true },
    },
    headerBar: {
      classNames: ".sf-headerBar",
      defaultClassNames: " .default_headerBar",
      userProps: { visible: true },
    },
  };

  btnNext: StyleContextComponentWithDispatch<Button>;

  constructor(props?: any) {
    super(
      Object.assign(
        {
          orientation: Page.Orientation.PORTRAIT,
        },
        props
      )
    );
    this.name = "page1";
    
    this.ios && (this.ios.safeAreaLayoutMode = true);
    this._children = {
      statusBar: this.statusBar,
      headerBar: this.headerBar,
      btnNext: new $BtnNext(),
    };
    this.btnNext = this.children.btnNext;

    this.addStyleableChild(this.btnNext, "btnNext");
    pageContextPatch(this, "page1");
    this.applyTestIDs("_Page1");
    this.onLoad();
    this.addChild(child, "asddf")
  }

  onLoad(): void {
    this.headerBar.title = "Page1";
  }

  addChildByName(child: View, name: string) {
    this._children[name] = child;
    this.addChild(child);
  }

  applyTestIDs(testId: string) {
    Object.keys(this.children).forEach((child) => {
      this.children[child].testId =
        testId + "_" + child.charAt(0).toUpperCase() + child.slice(1);
      if (this.children[child].applyTestIDs) {
        this.children[child].applyTestIDs(this.children[child].testId);
      }
    });
  }
}

export default $Page;
