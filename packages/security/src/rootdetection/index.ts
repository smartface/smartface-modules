/**
 * Smartface RootDetection Module
 * @module rootdetection
 * @type {object}
 * @author Dogan Ekici <dogan.ekici@smartface.io>
 * @author Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2022
 */

import System from "@smartface/native/device/system";
import AndroidRootConfig from "./rootconfig.json";
import iOSJailBreakConfig from "./jailbreakpaths.json";

/**
 * Includes a few established methods to capture whether device is
 * rooted or not. To know if the device is rooted, we look for potentially dangerous
 * app packages/paths, system folder accessibility and su binaries&schemas.
 * @public
 * @class
 * @singleton
 */
class RootDetectionClass {
  private rootDetectionNative: any;
  constructor() {
    if (System.OS === System.OSType.IOS) {
      //@ts-ignore
      this.rootDetectionNative = new __SF_RootDetection();
    } else {
      const RootDetectionUtilAndroid = require("./rootdetectionutil.android").default;
      this.rootDetectionNative = new RootDetectionUtilAndroid();
    }
  }

  private checkPathsForIOS(): boolean {
    this.rootDetectionNative.pathsToCheck = iOSJailBreakConfig.pathsToCheck;
    return this.rootDetectionNative.checkPaths();
  }
  private checkPathsForAndroid(): boolean {
    const knownRootAppPackages = AndroidRootConfig.knownRootAppPackages;
    return this.rootDetectionNative.checkAppPackages(knownRootAppPackages);
  }
  private checkSchemes(): boolean {
    this.rootDetectionNative.schemesToCheck = iOSJailBreakConfig.schemesToCheck;
    return this.rootDetectionNative.checkSchemes();
  }
  private checkRootAccessGainedForIOS(): boolean {
    return this.rootDetectionNative.canViolateSandbox();
  }
  private checkRootAccessGainedForAndroid(): boolean {
    const pathThatShouldNotWritable = AndroidRootConfig.knownRootAppPackages;
    return this.rootDetectionNative.checkRootAccessGained(pathThatShouldNotWritable);
  }

  /**
   * Checks the device either rooted or not.
   * @method
   * @return {boolean} - returns true in case of device rooted. Otherwise returns false.
   * @public
   * @static
   * @example
   *```
   * import { RootDetection } from '@smartface/security;
   *
   * if (RootDetection.isRooted()) {
   *     console.log("Attention! Your device is rooted/jailbroken!");
   * } else {
   *     console.log("Your device is not rooted/jailbroken");
   * }
   *```
   */
  isRooted(): boolean {
    if (System.OS === System.OSType.IOS) {
      return this.checkPathsForIOS() || this.checkSchemes() || this.checkRootAccessGainedForIOS();
    } else {
      return this.checkPathsForAndroid() || this.checkSuBinaryExistance() || this.checkRootAccessGainedForAndroid();
    }
  }

  private checkSuBinaryExistance(): boolean {
    const suBinaryPaths = AndroidRootConfig.suBinaryPaths;
    return this.rootDetectionNative.checkSuBinaryExistance(suBinaryPaths);
  }
}

// Create singleton
const rootDetection = new RootDetectionClass();
export default rootDetection;
