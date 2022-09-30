import { Styleable, styleableComponentMixin } from ".";

type ClassName = string[] | string;

/**
 * This will be included in all of the components(within styleablecomponentmixin)
 * It will act as a wrapper with context dispatch actions.
 */
export default class StyleActions<T extends Styleable = any> {
  constructor(private component: T) {}
  /**
   * updateUserStyle
   * @param userProps props to apply. Must be context compatible.
   */
  apply(userProps: Record<string, any>): void {
    this.component.dispatch?.({
      type: "updateUserStyle",
      userStyle: userProps
    });
  }
  /**
   * pushClassNames
   * @param className Class name to add. Will do nothing if the class already exists in the component or class doesn't exist at all/
   */
  addClass(className: ClassName): void {
    this.component.dispatch?.({
      type: "pushClassNames",
      classNames: className
    });
  }
  /**
   * removeClassName
   * @param className Class name to remove. Will do nothing if the class already exists in the component or class doesn't exist at all/
   */
  removeClass(className: ClassName): void {
    this.component.dispatch?.({
      type: "removeClassName",
      className: className
    });
  }
  /**
   * ivalidate
   * Will re-render the component context wise. For advanced usage only.
   */
  invalidate(): void {
    this.component.dispatch?.({
      type: "invalidate"
    });
  }
}
