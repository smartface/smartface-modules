import { ConstructorOf, MergeCtor } from '@smartface/core';
import System from '@smartface/native/device/system';
import Color from '@smartface/native/ui/color';
import HeaderBarItem from '@smartface/native/ui/headerbaritem';
import Image from '@smartface/native/ui/image';
import { IImage } from '@smartface/native/ui/image/image';
import Page from '@smartface/native/ui/page';
import { NativeStackRouter, Router } from '@smartface/router';

const closeButtonImage = Image.createFromFile('images://close_icon.png') || undefined;
const backButtonImage = Image.createFromFile('images://arrow_back.png') || undefined;

type DismissOptions = {
  /**
   * Default image values are described in the function description.
   */
  image?: IImage;
  /**
   * Position of the headerbar icon.
   * Assigning left will invoke setLeftItem, assigning right will invoke setItems method.
   * @default "left"
   */
  position?: 'left' | 'right';
  /**
   * Tint color of the headerbar icon. If given, the selected tint will be applied.
   * If not, it will take whatever headerbar value is set on theme.f
   */
  color?: Color;
  /**
   * If needed, you can also assign a text instead of a button.
   * Assigning this will override image variable, so only use this if you don't want to set an image.
   */
  text?: string
};

interface iDismissBackbutton {
  initDismissButton(router: Router, options?: DismissOptions): void;
  initBackButton(router: Router, options?: DismissOptions): void;
  initDismissButtononAndroid(router: NativeStackRouter, options?: DismissOptions): void;
  initDismissButtononiOS(router: NativeStackRouter, options?: DismissOptions): void;
  initBackButtononiOS(router: NativeStackRouter, options?: DismissOptions): void;
  initBackButtononAndroid(router: NativeStackRouter, options?: DismissOptions): void;
}
export function withDismissAndBackButton<T extends new (...params: any[]) => Page = new (...params: any[]) => Page>(PageClass: T) {
  const klass = class extends (PageClass as any) implements iDismissBackbutton {
    /**
     * Dismiss and back button mixin for modal-pages
     * When no parameter is given, the default image of images://close_icon.png will be used.
     * Assigning text will remove the image. You cannot use both at the same time.
     * If you want to use a different image on all across the project, you can change the image itself to an image you desired.
     * @param router
     * @param options
     */
    initDismissButton(router: Router, options: DismissOptions = {}) {
      options.position ||= 'left';
      options.image ||= closeButtonImage;

      if (router instanceof NativeStackRouter) {
        this.initDismissButtononAndroid(router, options);
        this.initDismissButtononiOS(router, options);
      }
    }
    /**
     * Initializes a back button if the router is not on the first page on the stack.
     * If the current page is on the first page on the router stack, setLeftItem=false will be invoked for Android.
     * When no parameter is given, the default image of images://arrow_back.png will be used.
     * Assigning text will remove the image. You cannot use both at the same time.
     * If you want to use a different image on all across the project, you can change the image itself to an image you desired.
     * @param router
     * @param options
     */
    initBackButton(router: Router, options: DismissOptions = {}) {
      options.position ||= 'left';
      options.image ||= backButtonImage;

      if (router instanceof NativeStackRouter) {
        this.initBackButtononAndroid(router, options);
        this.initBackButtononiOS(router, options);
      }
    }

    initDismissButtononAndroid(router: NativeStackRouter, options?: DismissOptions) {
      if (System.OS !== System.OSType.ANDROID) {
        return;
      }
      /** Look for first page in modal */
      if(!router.isModal() || router.canGoBack(-1)) {
        return;
      }
      const closeButtonHbi = new HeaderBarItem({
        onPress: () => router.goBack()
      });
      /**
       * This check is written because on Android, 
       * when title is set after image, it throws an error. When it is set before image, the image is ignored.
       */
      if(options?.text) {
        closeButtonHbi.title = options.text;
      }
      else {
        closeButtonHbi.image = options?.image || closeButtonImage || null;
      }
      if(options?.color) {
        closeButtonHbi.color = options.color;
      }
      
      if (options?.position === 'left') {
        this.headerBar.leftItemEnabled = false;
        this.headerBar.setLeftItem(closeButtonHbi);
        this.headerBar.leftItemEnabled = true;
      } else {
        /** Inner pages in modal, basically same with normal stack */
        this.headerBar.setItems([closeButtonHbi]);
        this.headerBar.leftItemEnabled = false;
      }
    }

    initDismissButtononiOS(router: NativeStackRouter, options?: DismissOptions) {
      if (System.OS !== System.OSType.IOS) {
        return;
      }
      /** Look for first page in modal */
      if(!router.isModal() || router.canGoBack(-1)) {
        return;
      }
      const hbi = new HeaderBarItem({
        onPress: () => {
          router.goBack();
        }
      });
      /**
       * This check is written due to usage on Android. 
       * Also on iOS title and image cannot be set at the same time as well.
       */
      if(options?.text) {
        hbi.title = options.text;
      }
      else {
        hbi.image = options?.image || closeButtonImage || null;
      }
      if (options?.color) {
        hbi.color = options.color;
      }
      
      /** First page in modal */
      this.headerBar.leftItemEnabled = false;
      this.headerBar.setLeftItem(hbi);
      this.headerBar.leftItemEnabled = true;
    }

    initBackButtononiOS(router: NativeStackRouter, options: DismissOptions) {
      if (System.OS !== System.OSType.IOS) {
        return;
      }
      if (!router.canGoBack(-1)) {
        // Look if it's the firt page
        return;
      }
      const hbi = new HeaderBarItem({
        onPress: () => router.goBack(),
      });
      /**
       * This check is written due to usage on Android. 
       * Also, on iOS title and image cannot be set at the same time as well.
       */
      if(options?.text) {
        hbi.title = options.text;
      }
      else {
        hbi.image = options?.image || backButtonImage || null;
      }

      if (options?.color) {
        hbi.color = options.color;
      }
      
      if (options?.position === 'left') {
        this.headerBar.leftItemEnabled = false;
        this.headerBar.setLeftItem(hbi);
        this.headerBar.leftItemEnabled = true;
      } else {
        this.headerBar.setItems([hbi]);
        this.headerBar.leftItemEnabled = false;
      }
    }

    initBackButtononAndroid(router: NativeStackRouter, options: DismissOptions) {
      if (System.OS !== System.OSType.ANDROID) {
        return;
      }
      if (!router.canGoBack(-1)) {
        this.headerBar.leftItemEnabled = false; //Fixes Android leaving a back button image on the first page by itself
        return;
      }
      const hbi = new HeaderBarItem({
        onPress: () => router.goBack(),
      });

      /**
       * This check is written because on Android, 
       * when title is set after image, it throws an error. When it is set before image, the image is ignored.
       */
       if(options?.text) {
        hbi.title = options.text;
      }
      else {
        hbi.image = options?.image || backButtonImage || null;
      }
      if(options?.color) {
        hbi.color = options.color;
      }

      if (options?.position === 'left') {
        this.headerBar.leftItemEnabled = false;
        this.headerBar.setLeftItem(hbi);
        this.headerBar.leftItemEnabled = true;
      } else {
        this.headerBar.setItems([hbi]);
        this.headerBar.leftItemEnabled = false;
      }
    }
  };
  return klass as unknown as MergeCtor<ConstructorOf<iDismissBackbutton>, typeof PageClass>;
}