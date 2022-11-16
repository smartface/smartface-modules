import type View from "@smartface/native/ui/view";

type ReturnType = {
    type: "addChild",
    name: string,
    component: View,
    classNames?: string[] | string,
    defaultClassNames?: string[] | string,
    userStyle?: { [key: string]: any }
}

export default function addChild(name: string, component: View, classNames?: string, userStyle?: { [key: string]: any }, defaultClassNames?: string[] | string): ReturnType {
  return {
    type: "addChild",
    name,
    component,
    classNames,
    defaultClassNames,
    userStyle
  };
}
