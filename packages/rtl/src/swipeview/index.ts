import { ConstructorOf } from "@smartface/native/core/constructorof";
import { ISwipeView } from "@smartface/native/ui/swipeview/swipeview";

/**
 * Smartface RTLSwipeView To Support RIGHT-TO-LEFT Languages
 * RTLSwipeView class is inherited from SwipeView. It manipulates the index/array
 * based functions/properties to support RTL languages. Such as, in case of app
 * direction is RTL, array & index values are reversed.
 *
 * Note: Returned indexes or arrays won't impact the logic.
 * @module RTLSwipeView
 * @copyright Smartface 2022
 * @example
 * ```
 * import RTLSwipeView from '@smartface/rtl/swipeview';
 *
 * var swipeView = new RTLSwipeView({
 *     page: currentPage,
 *     width: 300,
 *     maxHeight: 300,
 *     pages: [Page1, Page2, Page3, Page4]
 * });
 *
 * swipeView.onPageSelected = function(index, page) {
 *     console.info(`page index ${index}`);
 * };
 * ```
 */
const RTLSwipeView: ConstructorOf<ISwipeView, Partial<ISwipeView>> = require(`./swipeview.${Device.deviceOS.toLowerCase()}`).default;
type RTLSwipeView = ISwipeView;
export default RTLSwipeView;
