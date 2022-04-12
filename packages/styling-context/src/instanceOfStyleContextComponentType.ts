import View from "@smartface/native/ui/view";
import { StyleContextComponentType } from ".";

export function instanceOfStyleContextComponentType(view: any): view is StyleContextComponentType<View<any>> {
  return typeof view.dispatch === "function";
}
