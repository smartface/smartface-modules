import { MergeCtor } from "@smartface/core";
import System from "@smartface/native/device/system";
import Color from "@smartface/native/ui/color";
import HeaderBarItem from "@smartface/native/ui/headerbaritem";
import Image from "@smartface/native/ui/image";
import Page from "@smartface/native/ui/page";
import { NativeStackRouter } from "@smartface/router";
import Router from "@smartface/router/lib/router/Router";

const closeButtonImage: Image = Image.createFromFile("images://close_icon.png");
declare const global:any;
/**
 * Dismiss button mixin for modal-pages
 */
export function withDismissButton<T extends new (...params: any[]) => Page = new (...params: any[]) => Page>(PageClass: T) {
    const klass = class extends (PageClass as any) {
        /**
         * Initializes a dismiss button if the router is modal and in the first page
         * 
         * @param router 
         * @param options 
         */
         public initDismissButton(router: Router, options: DismissOptions = {}) {
            options.text ||= global.lang.done || 'Done';
            options.position ||= System.OS === System.OSType.IOS ? "left" : "right";
            options.image ||= closeButtonImage;

            if (router instanceof NativeStackRouter) {
                this.initDismissButtononAndroid(router, options);
                this.initDismissButtononiOS(router, options);
            }
        }

        public initDismissButtononAndroid(router: NativeStackRouter, options?: DismissOptions) {
            if (System.OS === System.OSType.ANDROID && router.isModal() && !router.canGoBack(-1)) {
                const hbi = new HeaderBarItem({
                    color: options?.color || null,
                    image: options?.image || null,
                    title: options?.text || null,
                    onPress: () => {
                        router.goBack();
                    }
                });
                if (options?.position === "left") {
                    this.headerBar.setLeftItem(hbi);
                    this.headerBar.leftItemEnabled = true;
                } else {
                    this.headerBar.setItems([hbi]);
                    this.headerBar.leftItemEnabled = false;
                }
            }
        }

        public initDismissButtononiOS(router: NativeStackRouter, options?: DismissOptions) {
            if (System.OS === System.OSType.IOS && router.isModal() && !router.canGoBack(-1)) {
                const hbi = new HeaderBarItem({
                    color: options?.color || null,
                    image: options?.image || null,
                    title: options?.text || null,
                    onPress: () => {
                        router.goBack();
                    },
                });
                this.headerBar.setLeftItem(hbi);
                this.headerBar.leftItemEnabled = true;
            }
        }
    }
    
    return klass as unknown as MergeCtor<typeof klass, typeof PageClass>;
}

type DismissOptions = {
    image?: Image;
    position?: "left" | "right";
    color?: Color;
    text?: string;
};
