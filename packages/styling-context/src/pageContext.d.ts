import Page from "@smartface/contx/lib/smartface/PageWithContx";
import { ContextPage, PageClass } from "mock/PageClass";
import { Style } from "./Style";
import { StylingBoundry } from "./StylingBoundry";

/**
 * Creates new page context boundry
 *
 * @param {object} component - Root component of the context
 * @param {string} name - Root component ID
 * @param {function} reducers - Reducers function
 */
export default function createPageContext(
  component: ContextPage,
  name: string,
  reducers?: null | (() => any)
): StylingBoundry;

declare function contextReducer(
  context: any[],
  action: string,
  target: any,
  state: any
): (styling: Style) => void;
