[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/smartface/smartface-modules/blob/main/packages/security/LICENSE)

# Security

## Intro

This module provides security tools (e.g. GoogleSafetyNet) for Smartface applications.

## GooglePlayServices

Helper class for Google Play Services. Android relies on a security Provider to provide secure network communications.
However, from time to time, vulnerabilities are found in the default security provider.
To protect against these vulnerabilities, Google Play services provides a way to automatically
update a device's security provider to protect against known exploits. By calling Google Play services methods,
your app can ensure that it's running on a device that has the latest updates to protect against known exploits.

### Example Usage

```js
import { GooglePlayServices } from "@smartface/security";
if (System.OS === "Android") {
  GooglePlayServices.upgradeSecurityProvider()
    .then(() => {
      console.info(
        "Provider is up-to-date, app can make secure network calls."
      );
    })
    .catch((errorCode) => {
      console.error("Error code: ", errorCode);
    });
}
```

## GoogleSafetyNet

Helper class for Google's SafetyNet. SafetyNet provides a set of services and APIs that help protect your app against security threats, including device tampering, bad URLs, potentially harmful apps, and fake users.

### Example Usage

```js
import { GoogleSafetyNet } from "@smartface/security";
if (System.OS === System.OSType.ANDROID) {
  const googleSafetyNet = new GoogleSafetyNet({
    apiKey: "**********",
  });
  if (googleSafetyNet.isPlayServicesAvailable()) {
    let nonce = googleSafetyNet.generateNonce();
    // Nonce should be at least 16 bytes length
    googleSafetyNet
      .sendAttestationRequest(nonce)
      .then((jws) => {
        console.info(`JWS ${jws}`);
      })
      .catch((e) => {
        console.error(e);
      });
  } else {
    console.info(
      "Google Play services are not available. You cannot proceed further"
    );
  }
}
```
