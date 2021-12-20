import commands from "@smartface/styler/lib/commandsManager";
import merge from "@smartface/styler/lib/utils/merge";
import Screen from '@smartface/native/device/screen';
import System from '@smartface/native/device/system';
import isTablet from '../core/isTablet';
import fromSFComponent from "./fromSFComponent";
import { pageContextHooks } from "./pageContextHooks";
import { pageContextReducer } from "./pageContextReducer";

export var orientationState = "ended";

commands.addRuntimeCommandFactory(function pageContextRuntimeCommandFactory(type, error) {
	switch (type) {
		case '+Device':
			return function deviceRule(opts) {
				var Device = {
					screen: {
						width: Screen.width,
						height: Screen.height
					},
					os: System.OS,
					osVersion: System.OSVersion,
					type: isTablet ? "tablet" : "phone",
					orientation: Screen.width > Screen.height ? "landscape" : "portrait",
					language: System.language
				};

				opts = merge(opts);
				let isOK = false;

				try {
					isOK = eval(opts.args);
				}
				catch (e) {
					error && error(e);
					return {};
				}

				return isOK ? opts.value : {};
			};
	}
});
/**
 * Creates new page context boundry
 * 
 * @param {object} component - Root component of the context
 * @param {string} name - Root component ID
 * @param {function} reducers - Reducers function
 */
function createPageContext(component, name, reducers = null) {
	var styleContext = fromSFComponent(
		component,
		name,
		pageContextHooks
	);

	const _contextReducer = reducers ?
		function(context, action, target, state) {
			const newState = pageContextReducer(context, action, target, state);
			return reducers(context, action, target, newState || state);
		} :
		pageContextReducer;

	// creates an initial styling for the context
	// styleContext(styling, _contextReducer);

	return function setStyle(styling) {
		try {
			// const styling = styler(newStyles);
			// injects a new styling to the context
			styleContext(styling, _contextReducer);
		}
		catch (e) {
			throw e;
		}
	};
}

export default createPageContext;
