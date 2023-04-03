import AndroidConfig from "@smartface/native/util/Android/androidconfig";
//@ts-ignore
const NativeFile = requireClass('java.io.File');

export default class RootDetectionUtilAndroid {
    public checkAppPackages = (pNames: string[]): boolean => {
      for (const pName of pNames) {
        try {
          AndroidConfig.activity.getPackageManager().getPackageInfo(pName, 0);
          return true;
        } catch {
          continue;
        }
      }
      return false;
    };
  
    public checkSuBinaryExistance = (suAbsBinaryPaths: string[]): boolean => {
      for (const suAbsBinaryPath of suAbsBinaryPaths) {
        if (new NativeFile(suAbsBinaryPath, 'su').exists()) {
          return true;
        }
      }
      return false;
    };
  
    public checkRootAccessGained = (systemPaths: string[]): boolean => {
      for (const systemPath of systemPaths) {
        if (new NativeFile(systemPath).canWrite()) {
          return true;
        }
      }
      return false;
    };
  }