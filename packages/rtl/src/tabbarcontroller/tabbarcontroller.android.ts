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

import Application from "@smartface/native/application";
import TabBarControllerAndroid from "@smartface/native/ui/tabbarcontroller/tabbarcontroller.android";
import RTLAndroidSwipeView from "../swipeview/swipeview.android";

const NativeRelativeLayout = requireClass("android.widget.RelativeLayout");

const GRAVITY_RIGHT = 5;
const MODE_SCROLLABLE = 0;
const MODE_FIXED = 1;
const WRAP_CONTENT = -2;
const MATCH_PARENT = -1;

class RTLAndroidTabBarController extends TabBarControllerAndroid {
  private isRTL: boolean;
  private onSelectedCallback: TabBarControllerAndroid["onSelected"] = () => {};
  private mScrollEnabled = false;
  constructor(options: ConstructorParameters<typeof TabBarControllerAndroid>) {
    super(options as any);
    this.swipeView = new RTLAndroidSwipeView({
      page: this,
      flexGrow: 1,
      onPageCreate: (position: number) => (this.onPageCreate ? this.onPageCreate(position) : null)
    });
    this.isRTL = Application.android.getLayoutDirection === Application.LayoutDirection.RIGHTTOLEFT;
  }
  private getArray(array: any[]): any[] {
    return this.isRTL ? array.reverse() : array;
  }
  private getIndex(position: number): number {
    return this.isRTL ? this.items.length - 1 - position : position;
  }
  //@ts-ignore
  get onSelected(): TabBarController["onSelected"] {
    return (position: number) => {
      const rPosition = this.getIndex(position);
      return this.onSelectedCallback(rPosition);
    };
  }

  set onSelected(value: TabBarControllerAndroid["onSelected"]) {
    this.onSelectedCallback = value;
  }

  set items(value: any[]) {
    this._items = value;
    const rItemArray = this.getArray(value);
    this.swipeView.pageCount = rItemArray.length;
    this.swipeView.pagerAdapter.notifyDataSetChanged();

    rItemArray.forEach(i => {
      const itemTitle = rItemArray[i].title;
      const itemIcon = rItemArray[i].icon;
      //@ts-ignore
      const tabItem = this.tabLayout.nativeObject.getTabAt(i);
      itemTitle && tabItem.setText(itemTitle);
      itemIcon && tabItem.setIcon(itemIcon.nativeObject);
    });
    if (!this.autoCapitalize) {
      //@ts-ignore
      this.setAllCaps(rItemArray, this.tabLayout.nativeObject);
    }
    this.setSelectedIndex(0, false);
  }
  get items() {
    return this._items;
  }

  set scrollEnabled(value: boolean) {
    this.mScrollEnabled = value;
    if (value) {
      this.tabLayout.nativeObject.setTabMode(MODE_SCROLLABLE);
      this.tabLayout.nativeObject.setLayoutParams(new NativeRelativeLayout.LayoutParams(WRAP_CONTENT, WRAP_CONTENT));
      this.alignByDirection(this.divider);
    } else {
      this.tabLayout.nativeObject.setTabMode(MODE_FIXED);
      this.tabLayout.nativeObject.setLayoutParams(new NativeRelativeLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT));
    }
  }

  get scrollEnabled(): boolean {
    return this.mScrollEnabled;
  }

  alignByDirection(pmDivider: any) {
    if (pmDivider != null && this.isRTL) {
      pmDivider.setGravity(GRAVITY_RIGHT);
    }
  }
}
