import { createActorTreeFromSFComponent } from "./createActorTreeFromSFComponent";
import { orientationState } from "./pageContext";

export function pageContextReducer(context, action, target, state) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case "updateUserStyle":
      context
        .find(target, {
          updateUserStyle: () => {
            throw new TypeError(`Target ${target} component cannot be found.`);
          }
        })
        .updateUserStyle(action.userStyle);

      return newState;
    case "changeUserStyle":
      context
        .find(target, {
          setUserStyle: () => {
            throw new TypeError(`Target ${target} component cannot be found.`);
          }
        })
        .setUserStyle(action.userStyle);

      return newState;
    case "updatePageSafeArea":
      context
        .find(target, {
          setSafeArea: () => {
            throw new TypeError(`Target ${target} component cannot be found.`);
          }
        })
        .setSafeArea(Object.assign({}, action.safeArea));

      return newState;
    case "invalidate":
      context.map(function(actor) {
        actor.setDirty(true);
      });

      return newState;
    case "addChild":
      const rootName = target + "_" + action.name;
      const ctree = createActorTreeFromSFComponent(action.component, action.name, target, action.defaultClassNames);

      /*if(action.classNames && typeof action.classNames !== 'string' && !Array.isArray(action.classNames)){
					throw new Error(action.classNames+" classNames must be String or Array");
			}*/
      ctree[target + "_" + action.name] && action.classNames && ctree[rootName].pushClassNames(action.classNames);

      action.userStyle && ctree[rootName].setUserStyle(action.userStyle);
      context.addTree(ctree);

      return newState;
    case "removeChild":
      context.map(actor => {
        const component = actor.getComponent();
        if (component === action.component) {
          context.remove(actor.getInstanceID());
        }
      });
      return newState;
    case "removeChildren":
      context.removeChildren(target);

      return newState;
    case "pushClassNames":
      if (!action.classNames) throw new Error("Classnames must not be null or undefined");
      context.find(target).pushClassNames(action.classNames);

      return newState;
    case "removeClassName":
      context.find(target).removeClassName(action.className);

      return newState;
    case "orientationStarted":
      context.map(function(actor) {
        actor.setDirty(true);
      });

      orientationState = "started";
      return newState;
    case "orientationEnded":
      context.map(function(actor) {
        actor.setDirty(true);
      });

      orientationState = "ended";
      return newState;
    case "updateComponent":
      let stylable = context.find(target);
      stylable.updateComponent(action.component);
      stylable.applyStyles(true);
      return newState;
    case "forceComponentUpdate":
      const actor = context.find(target);
      actor && actor.reset();
      return newState;
  }

  return state;
}
