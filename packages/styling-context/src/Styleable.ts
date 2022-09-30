import NavigationController from "@smartface/native/ui/navigationcontroller";
import View from "@smartface/native/ui/view";
import { StyleableDispatch } from "index";
import { ComponentStyleContext } from "./ComponentStyleContext";
import StyleActions from "./styleActions";

export declare abstract class Styleable {
  static $$styleContext: ComponentStyleContext;
  dispatch?: StyleableDispatch;
  style: StyleActions;
}

export type ViewType = View | NavigationController;

export interface ComponentWithNamedChildren {
  addChildByName(name: string, child: View): void;
}

export interface ComponentConstructor {
  new (params?: any): {};
}
