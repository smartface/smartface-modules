import { createTreeItem } from 'createTreeItem';
import makeStylable from '../styling/Stylable';
import { extractTreeFromSFComponent, createName } from './fromSFComponent';


export function createActorTreeFromSFComponent(component, name, rootName, defaultClassNames) {

  if (component.addChild || component.layout) {
    const ctree = extractTreeFromSFComponent(component, name, defaultClassNames);
    const _ctree = {};
    Object.keys(ctree).forEach((name) => _ctree[createName(rootName, name)] = makeStylable(ctree[name]));
    return _ctree;
  }
  else {
    return {
      [createName(rootName, name)]: makeStylable(createTreeItem(component, name, rootName, component, defaultClassNames))
    };
  }
}
