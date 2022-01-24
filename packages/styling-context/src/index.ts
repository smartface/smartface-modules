import type View from "@smartface/native/ui/view";

export { default as addChild } from "./action/addChild";
export { default as removeChild } from "./action/removeChild";
export { default as removeChildren } from "./action/removeChildren";
export { default as pageContext } from "./pageContext";
export { default as pageContextPatch } from "./pageContextPatch";
export { default as componentContextPatch } from "./componentContextPatch";
export { ThemeService } from "./ThemeService";

export interface IViewContainer {
    addChild(child: View): void;
    removeChild(child: View): void;
}

type Actions = {
    type: "addChild",
    name: string,
    component: any,
    classNames?: string[] | string,
    defaultClassNames?: string[] | string,
    userStyle?: { [key: string]: any }
} |
{
    type: "removeChild",
} |
{
    type: "removeChildren",
} |
{
    type: "updateComponent",
    component: any
} |
{
    type: "forceComponentUpdate",
    name: string
} |
{
    type: "invalidate"
} |
{
    type: "orientationStarted"
} |
{
    type: "orientationEnded"
} |
{
    type: "updatePageSafeArea",
    safeArea: {
        paddingLeft?: number;
        paddingRight?: number;
        paddingTop?: number;
        paddingBottom?: number;
    }
} | 
{
    type: "updateUserStyle",
    userStyle: { [key: string]: any }
}

export type StyleableDispatch = (action: Actions) => void;

export type StyleContextComponent = {
    dispatch?: StyleableDispatch;
};
export type StyleContextAddChild = {
    addStyleableChild(
        child: View,
        name?: string,
        classNames?: string,
        userProps?: { [key: string]: any },
        defaultClassNames?: string,
    ): void;
};
export type StyleContextContainerComponent = IViewContainer & StyleContextAddChild & StyleContextComponent;
export type StyleContextComponentType<T> = T &
    StyleContextAddChild &
    StyleContextComponent;
export type StyleContextComponentWithDispatch<T> = T & StyleContextComponent;
export type componentContextPatch = <T = any>(
    component: T,
    name: string,
) => StyleContextComponentType<T>;
