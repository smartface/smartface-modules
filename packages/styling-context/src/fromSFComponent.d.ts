import View from "@smartface/native/ui/view";

declare function buildContextTree(component: View, name: string, root: any, rootName: string, defaultClassNames: string[] | string, acc: { [key: string]: any }): void;

export default function fromSFComponent(root: View, rootName: string, hooksList: any, collection: { [key: string]: any }): () => any;
