import type View from "@smartface/native/ui/view";

type ReturnType = {
    type: "removeChild",
    component: View
}

export default function removeChild(component: View): ReturnType {
  return {
    type: "removeChild",
    component
  };
}
