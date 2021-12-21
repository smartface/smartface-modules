import createPageContext from "./pageContext";
import patchMethod from '../util/patchMethod';
import { ThemeService } from "./ThemeService";

const Application = require("@smartface/native/application");

export default function componentContextPatch(component, name) {
  component.themeContext = ThemeService.instance.addPage(createPageContext(component, name), name);

//   component.onShow = patchMethod(component, "onShow", onShow);

//   function onShow(superOnShow, params) {
//     superOnShow && superOnShow(params);
//   }
}
