import SwipeViewAndroid from "@smartface/native/ui/swipeview/swipeview.android";
import Application from "@smartface/native/application";
import System from "@smartface/native/device/system";
import AndroidUnitConverter from "@smartface/native/util/Android/unitconverter";
import { ISwipeView } from "@smartface/native/ui/swipeview/swipeview";
import { IPage } from "@smartface/native/ui/page/page";

export default class RTLAndroidSwipeView extends SwipeViewAndroid {
  private callbackOnPageSelected: ISwipeView["onPageSelected"] = () => {};
  private callbackOnPageScrolled: ISwipeView["onPageScrolled"] = () => {};
  private isRTL = false;
  constructor(options?: Partial<ISwipeView>) {
    super(options);
    this.isRTL = Application.android.getLayoutDirection === Application.LayoutDirection.RIGHTTOLEFT;
  }
  private getIndex(position: number) {
    return this.isRTL ? this.pages.length - 1 - position : position;
  }

  private getOffsetPixels(offsetPixels: number) {
    return this.isRTL ? AndroidUnitConverter.pixelToDp(this.nativeObject.getWidth()) - offsetPixels : offsetPixels;
  }
  get pages(): IPage[] {
    //@ts-ignore _pages is private and will be converted to protected on later versions.
    return this._pages;
  }
  set pages(currentPages: IPage[]) {
    if (currentPages instanceof Array) {
      if (currentPages.length === 0) {
        throw TypeError("Array parameter cannot be empty.");
      }
      //@ts-ignore _pages is private and will be converted to protected on later versions.
      this._pages = currentPages;
      this.pagerAdapter.notifyDataSetChanged();
      this.swipeToIndex(0, false);
    }
  }
  get currentIndex(): number {
    return this.getIndex(this.nativeObject.getCurrentItem());
  }

  swipeToIndex(index: number, animated = false) {
    return this.nativeObject.setCurrentItem(this.getIndex(index), animated);
  }

  //@ts-ignore
  get onPageScrolled(): ISwipeView["onPageScrolled"] {
    return (position: number, offsetPixels: number) => {
      let rPosition = this.getIndex(position);
      //Re-look at here!
      let rOffsetPixels = this.getOffsetPixels(offsetPixels);
      this.callbackOnPageScrolled(rPosition, rOffsetPixels);
    };
  }
  set onPageScrolled(callback: ISwipeView["onPageScrolled"]) {
    this.callbackOnPageScrolled = callback;
  }

  get onPageSelected(): ISwipeView["onPageSelected"] {
    return (position: number, pageInstance: IPage) => {
      let rPosition = this.getIndex(position);
      this.callbackOnPageSelected(rPosition, this.getPageInstance(position));
    };
  }
  set onPageSelected(callback: ISwipeView["onPageSelected"]) {
    this.callbackOnPageSelected = callback;
  }

  protected getPageInstance(position: number): any {
    let rPosition = this.getIndex(position);
    //@ts-ignore
    let pageInstance = this._pageInstances[position];
    //@ts-ignore
    if (this.onPageCreate) {
      //@ts-ignore
      pageInstance = this.onPageCreate(rPosition);
    } else if (pageInstance) {
      /**
       * ToDo: Remaining conditions are implemented for backward compatibility. Remove if no longer backward supported
       */
      return pageInstance.nativeObject;
    } else {
      const pageClass: any = this.pages[rPosition];
      pageInstance = new pageClass({
        skipDefaults: true
      });
    }
    //@ts-ignore _pageInstances is private and will be converted to protected on later versions.
    this._pageInstances[position] = pageInstance;
    //@ts-ignore _pageInstances is private and will be converted to protected on later versions.
    this.bypassPageSpecificProperties(pageInstance);
    return pageInstance.nativeObject;
  }
}
