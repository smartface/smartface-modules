import { MergeCtor } from '@smartface/core';
import System from '@smartface/native/device/system';
import Color from '@smartface/native/ui/color';
import HeaderBarItem from '@smartface/native/ui/headerbaritem';
import Image from '@smartface/native/ui/image';
import Page from '@smartface/native/ui/page';
import { NativeStackRouter } from '@smartface/router';
import Router from '@smartface/router/lib/router/Router';

const closeButtonImage: Image = Image.createFromFile('images://close_icon.png');
const backButtonImage: Image = Image.createFromFile('images://arrow_back.png');
/**
 * Dismiss and back button mixin for modal-pages
 */

export function withDismissAndBackButton<T extends new (...params: any[]) => Page = new (...params: any[]) => Page>(PageClass: T) {
  const klass = class extends (PageClass as any) {
    /**
     * Initializes a dismiss button if the router is modal and in the first page
     *
     * @param router
     * @param options
     */
    public initDismissButton(router: Router, options: DismissOptions = {}) {
      options.position ||= 'left';
      options.image ||= closeButtonImage;
      options.color ||= Color.WHITE;

      if (router instanceof NativeStackRouter) {
        this.initDismissButtononAndroid(router, options);
        this.initDismissButtononiOS(router, options);
      }
    }
    /**
     * Initializes a back button if the router is not on the first page on the stack
     *
     * @param router
     * @param options
     */
    public initBackButton(router: Router, options: DismissOptions = {}) {
      options.position ||= 'left';
      options.image ||= backButtonImage;
      options.color ||= Color.WHITE;

      if (router instanceof NativeStackRouter) {
        this.initBackButtononAndroid(router, options);
        this.initBackButtononiOS(router, options);
      }
    }

    public initDismissButtononAndroid(router: NativeStackRouter, options?: DismissOptions) {
      if (System.OS !== System.OSType.ANDROID) {
        return;
      }
      /** Look for first page in modal */
      if(!router.isModal() || router.canGoBack(-1)) {
        return;
      }
      const closeButtonHbi = new HeaderBarItem({
        color: options?.color || null,
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
        closeButtonHbi.image = options?.image || null;
      }
      
      if (options?.position === 'left') {
        this.headerBar.setLeftItem(closeButtonHbi);
        this.headerBar.leftItemEnabled = true;
      } else {
        /** Inner pages in modal, basically same with normal stack */
        this.headerBar.setItems([closeButtonHbi]);
        this.headerBar.leftItemEnabled = false;
      }
    }

    public initDismissButtononiOS(router: NativeStackRouter, options?: DismissOptions) {
      if (System.OS !== System.OSType.IOS) {
        return;
      }
      /** Look for first page in modal */
      if(!router.isModal() || router.canGoBack(-1)) {
        return;
      }
      const hbi = new HeaderBarItem({
        color: options?.color || null,
        image: options?.image || null,
        onPress: () => {
          router.goBack();
        }
      });
      /**
       * This check is written due to usage on Android. 
       * Also, on iOS title and image cannot be set at the same time as well.
       */
      if(options?.text) {
        hbi.title = options.text;
      }
      else {
        hbi.image = options?.image || null;
      }
      
      /** First page in modal */
      this.headerBar.setLeftItem(hbi);
      this.headerBar.leftItemEnabled = true;
    }

    public initBackButtononiOS(router: NativeStackRouter, options: DismissOptions) {
      if (System.OS !== System.OSType.IOS && !router.canGoBack(-1)) {
        return;
      }
      const hbi = new HeaderBarItem({
        color: options?.color || null,
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
        hbi.image = options?.image || null;
      }

      if (options?.position === 'left') {
        this.headerBar.setLeftItem(hbi);
        this.headerBar.leftItemEnabled = true;
      } else {
        this.headerBar.setItems([hbi]);
        this.headerBar.leftItemEnabled = false;
      }
    }

    public initBackButtononAndroid(router: NativeStackRouter, options: DismissOptions) {
      if (System.OS !== System.OSType.ANDROID && !router.canGoBack(-1)) {
        return;
      }
      const hbi = new HeaderBarItem({
        color: options?.color || null,
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
        hbi.image = options?.image || null;
      }
      if (options?.position === 'left') {
        this.headerBar.setLeftItem(hbi);
        this.headerBar.leftItemEnabled = true;
      } else {
        this.headerBar.setItems([hbi]);
        this.headerBar.leftItemEnabled = false;
      }
    }
  };
  return klass as unknown as MergeCtor<typeof klass, typeof PageClass>;
}

type DismissOptions = {
  image?: Image;
  position?: 'left' | 'right';
  color?: Color;
  text?: string;
};
