[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/smartface/smartface-modules/blob/main/packages/i18n/LICENSE)

# i18n

## Intro

This module implements multi language support for Smartface applications.

### Getting started

Create language files like below, for detailed instructions you can check out https://www.i18next.com/overview/getting-started#basic-sample

en.ts

```ts
export default {
  helloWorld: "Hello World",
  welcomeUser: "Welcome {{user}}",
  keyWithCount_one: "{{count}} key",
  keyWithCount_other: "{{count}} keys"
};
```

tr.ts

```ts
export default {
  helloWorld: "Merhaba Dünya",
  welcomeUser: "Hoşgeldin {{user}}",
  keyWithCount_one: "{{count}} anahtar",
  keyWithCount_other: "{{count}} anahtarlar"
};
```

Initialize i18n instance

```ts
import i18n from "@smartface/i18n";

import en from "./en";
import tr from "./tr";

new i18n({
  lng: Device.language,
  debug: !!isEmulator,
  resources: {
    en: {
      translation: en
    },
    tr: {
      translation: tr
    }
  },
  fallbackLng: "en"
  // many options available
  // https://www.i18next.com/overview/configuration-options
});

//You can get formatted string like this
i18n.instance.t("helloWorld");
i18n.instance.t("welcomeUser", { user: "Smartface" });
i18n.instance.t("keyWithCount", { count: 0 });
i18n.instance.t("keyWithCount", { count: 1 });
i18n.instance.t("keyWithCount", { count: 5 });

//Change the language without app reload, it updates the instance
i18n.changeLanguage("tr");

//subscribe to locale changes
const unsubscribe = i18n.onChange(() => {
  console.log("subscribe trigger");
});

//this will unsubscribe
unsubscribe();
```
