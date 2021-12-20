[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/smartface/smartface-modules/blob/main/packages/i18n/LICENSE)

# i18n

## Intro

This module implements multi language support for Smartface applications.

### Getting started

Create language files like below, for detailed instructions you can check out https://formatjs.io/docs/core-concepts/icu-syntax

en.ts

```js
export default { hello: 'Hi {name}' };
```

tr.ts

```js
export default { hello: 'Merhaba {name}' };
```

Initialize i18n instance

```js
import i18n from '@smartface/i18n';

import en from './en';
import tr from './tr';

new i18n({
	defaultLocale: 'en',
	languageFiles: [
		{
			locale: 'en',
			messages: en,
		},
		{
			locale: 'tr',
			messages: tr,
		},
	],
});

//You can get formatted string like this
i18n.instance.language.formatMessage({ id: 'hello' }, { name: 'Smartface' });

//Change the language without app reload, it updates the instance
i18n.instance.locale = 'tr';

//subscribe to locale changes
const unsubscribe = i18n.instance.onChange(() => {
	console.log('subscribe trigger');
});

//this will unsubscribe
unsubscribe();
```
