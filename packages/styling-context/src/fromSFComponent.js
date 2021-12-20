import hooks from '../core/hooks';
import * as StyleContext from '../styling/StyleContext';
import makeStylable from '../styling/Stylable';
import raiseErrorMaybe from '../core/util/raiseErrorMaybe';
import { createTreeItem } from './createTreeItem';
import { createActorName } from './createActorName';

function buildContextTree(component, name, root, rootName, defaultClassNames, acc) {

  if (acc[name] === undefined) {
    acc[name] = createTreeItem(component, name, rootName, root, defaultClassNames);
  }

  component.children &&
    Object.keys(component.children).forEach((child) => {
      const comp = component.children[child];
      try {
        if (comp.component !== undefined && comp.classNames !== undefined) {
          buildContextTree(comp.component, createActorName(name, child), root, rootName, "", acc);
        }
        else {
          buildContextTree(comp, createActorName(name, child), root, rootName, "", acc);
        }
      }
      catch (e) {
        e.message = "Error when component would be collected: " + child + ". " + e.message;
        raiseErrorMaybe(e, component.onError);
      }
    });
}

/**
 * Extract components tree from a SF Component
 * 
 * @param {Object} component - A @smartface/native component
 * @param {string} name - component name
 * @param {function} initialClassNameMap - classNames mapping with specified component and children
 * @param {?function} hookList - callback function to capture context's hooks
 * @param {?Object} acc [={}] - Initial Accumulator value
 * 
 * @return {function} - context helper
 */
export function extractTreeFromSFComponent(root, rootName, defaultClassNames, acc = {}) {
  buildContextTree(root, rootName, root, rootName, defaultClassNames, acc);
  return acc;
}

export default function fromSFComponent(root, rootName, hooksList = null, collection = {}) {
  const ctree = extractTreeFromSFComponent(root, rootName, null);

  Object.keys(ctree).forEach((name) => {
    const item = ctree[name];

    ctree[name] = collection[name] || makeStylable(item);
  });

  return StyleContext.createStyleContext(
    ctree,
    hooks(hooksList),
    function updateContextTree(contextElements = {}) {
      return fromSFComponent(root, rootName, hooksList, contextElements);
    }
  );
}


