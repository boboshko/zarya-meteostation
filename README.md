![Version](https://img.shields.io/badge/version-0.2.1-brightgreen.svg?style=flat-square)
[![Community Chat](https://img.shields.io/badge/Community-Chat-blueChat?style=flat-square&logo=telegram)](https://t.me/codeque)

# Zarya Meteostation

A homebrew meteo-station based on [Iskra JS](http://wiki.amperka.ru/js:iskra_js) (in Russian) shield, able of collecting weather data and sending it to server. Works with a [specific API](https://github.com/boboshko/Meteostations-API).

💫 Chasing [a dream](https://www.facebook.com/onlysemeon/posts/582696555261097).

## Preparations

Buy and build a station from the list below. [Update its firmware](http://wiki.amperka.ru/js:ide#обновление_прошивки) with a help of [Espruino Web IDE](https://www.espruino.com/ide/).

### Components
| Component                                                                                                                       |   Cost in rubles   |
|:--------------------------------------------------------------------------------------------------------------------------------|:-------------------|
| [Iskra JS](http://amperka.ru/product/iskra-js)                                                                                  | 1 490 ₽            |
| [Slot Shield](http://amperka.ru/product/arduino-troyka-slot-shield)                                                             | 580 ₽              |
| [Wi-Fi (ESP8266)](http://amperka.ru/product/troyka-wi-fi)                                                                       | 850 ₽              |
| [Analog thermometer (TMP36)](http://amperka.ru/product/troyka-temperature-sensor)                                               | 310 ₽              |
| [Real-time clock (DS1307)](http://amperka.ru/product/troyka-rtc) + [Battery (CR1225)](http://amperka.ru/product/battery-cr1225) | 470 ₽ + 90 ₽       |
| [Barometer (LPS331AP)](http://amperka.ru/product/troyka-barometer)                                                              | 840 ₽              |
| **Total**                                                                                                                       | **4 630 ₽**        |


## Quick start

Launch [Espruino Web IDE](https://chrome.google.com/webstore/detail/espruino-web-ide/bleoifhkdalbjfbobjackfdifdneehpo) и and copy all the `sketch.js` contents. Config the firmware as described below. Delete all the unnecessary comments and upload it to Iskra JS.

Use the *table of values* at the end of this readme if you have trouble understanding the key-value pairs.

### Connecting to Wi-Fi

Change your Wi-Fi network settings in `SSID` и `PSWD` keys.

### API requests

#### Authorizing

Change `host`, `port` и `path` parameters in `options` to connect to the API server. Use `Base64`-encoded login and password in `Authorization`.

Unencoded login and password:

```
Login:Password
```

Encoded login and password (`Base64`):

```
TG9naW46UGFzc3dvcmQ=
```
A list of services that can help to encode in `Base64`:

* [base64encode.net](https://www.base64encode.net/)
* [base64encode.org](https://www.base64encode.org/)
* [utilities-online.info](http://www.utilities-online.info/base64/)

#### Geolocation

Geolocation is set up manually once when setting up the weather station in `sensorsData` with `City` and `Street` parameters. They are automatically replaced with `NULL` if being omitted.

### Data exchange frequency

The weather station sends request once a minute (60000 ms) and redirects received data to API server immidiately. This can be changed in `setTimeout` which is used twice in firmware code (strings 57 and 110). It’s recommended to use same value in both places.

## Table of parameters

This table explains what the main variables from `sketch.js` actually are.

| Key             | Value                                              |
|:----------------|:---------------------------------------------------|
| `SSID`          | Wi-Fi network id                                   |
| `PSWD`          | Wi-Fi password                                     |
| `host`          | IP or URL of an API server                         |
| `port`          | API server’s port                                  |
| `path`          | URL of an API request                              |
| `Authorization` | Login and password to access API server (`Base64`) |
| `City`          | Station’s home town                                |
| `Street`        | Street address                                     |
