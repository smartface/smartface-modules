import { ConstructorOf } from "@smartface/native/core/constructorof";
import { ITabBarController } from "@smartface/native/ui/tabbarcontroller/tabbarcontroller";

/**
 * Smartface RTLTabBarController To Support RIGHT-TO-LEFT Languages
 * RTLTabBarController class is inherited from TabBarController. It manipulates
 * the index/array based functions/properties to support RTL languages. Such as,
 * in case of app direction is RTL, array & index values are reversed.
 *
 * Note: Returned indexes or arrays won't impact the logic.
 * @module RTLTabBarController
 * @copyright Smartface 2022
 * @example
 *```
 * import RTLTabBarController from '@smartface/rtl/tabbarcontroller';
 *
 * class MyTabBarController extends RTLTabBarController {
 *     constructor() {
 *         super();
 *         this.onPageCreate = (index) => {}
 *     }
 * }
 * ```
 */
const RTLTabBarController: ConstructorOf<ITabBarController, Partial<ITabBarController>> = require(`./tabbarcontroller.${Device.deviceOS.toLowerCase()}`).default;
type RTLTabBarController = ITabBarController;
export default RTLTabBarController;
