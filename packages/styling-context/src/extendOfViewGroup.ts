import ViewGroup = require("@smartface/native/ui/viewgroup");
import { ConstructorOf } from "./ConstructorOf";


export function extendOfViewGroup<
  T extends any = any
>(klass: ConstructorOf<T>): klass is ConstructorOf<T & ViewGroup> {
  return typeof klass.prototype.addChild === "function";
}
