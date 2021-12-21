import { createTreeItem } from './createTreeItem';
import makeStylable from '@smartface/contx/lib/styling/Stylable';
import { extractTreeFromSFComponent } from './fromSFComponent';
import { createActorName } from "./createActorName";

export function createActorTreeFromSFComponent(component, name, rootName, defaultClassNames) {
  if (component.addChild || component.layout) {
    const ctree = extractTreeFromSFComponent(component, name, defaultClassNames);
    const _ctree = {};
    Object.keys(ctree).forEach((name) => _ctree[createActorName(rootName, name)] = makeStylable(ctree[name]));
    return _ctree;
  }
  else {
    return {
      [createActorName(rootName, name)]: makeStylable(createTreeItem(component, name, rootName, component, defaultClassNames))
    };
  }
}
