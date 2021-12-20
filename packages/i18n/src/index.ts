import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-listformat/polyfill';
import '@formatjs/intl-displaynames/polyfill';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/tr';
import '@formatjs/intl-datetimeformat/polyfill';

import { createIntl, createIntlCache, IntlShape } from '@formatjs/intl';
import { EventEmitter } from '@smartface/native/core/eventemitter';

export class i18n {
	private intlCache = createIntlCache();
	private emitter = new EventEmitter();
	private languageFiles: {
		locale: string;
		messages: Record<string, string>;
	}[];
	private defaultLocale = 'en';
	protected _language: IntlShape<string>;
	protected _onError: (...args: any[]) => void;
	static instance: i18n;
	constructor(props: {
		languageFiles: { locale: string; messages: Record<string, string> }[];
		defaultLocale: string;
	}) {
		if (i18n.instance) {
			throw new Error('Cannot be instantiated more');
		}
		this.languageFiles = props.languageFiles || [];
		this.defaultLocale = props?.defaultLocale || this.defaultLocale;
		this.locale = this.defaultLocale;
		i18n.instance = this;
	}
	onChange(callback: (...args: any[]) => void) {
		return this.emitter.on('change', callback);
	}
	set onError(value: (...args: any[]) => void) {
		this._onError = value;
	}
	get language(): IntlShape<string> {
		return this._language;
	}
	get locale(): string {
		return this._language.locale;
	}
	set locale(locale: string) {
		const messages = this.languageFiles.find(
			(lf) => lf.locale === locale
		)?.messages;
		if (messages) {
			this._language = createIntl(
				{
					defaultLocale: 'en',
					locale: locale,
					messages: messages,
					onError:
						this._onError ||
						function (err) {
							console.error(err);
						},
					fallbackOnEmptyString: true,
				},
				this.intlCache
			);
			this.emitter.emit('change');
		} else {
			throw new Error('Locale not found: ' + locale);
		}
	}
}
