// Setting up UART for Wi-Fi
PrimarySerial.setup(115200);

// Setting up I2C for RTC
PrimaryI2C.setup({sda: SDA, scl: SCL, bitrate: 100000});

// Setting up I2C1 for barometer
I2C1.setup({sda: SDA, scl: SCL, bitrate: 400000});

// Wi-Fi network credentials
var SSID = 'YOUR_SSID';
var PSWD = 'YOUR_PSWD';

// Sensors initialization
var barometer = require('@amperka/barometer').connect({i2c: I2C1});
var thermometer = require('@amperka/thermometer').connect(A1);
var rtc = require('@amperka/rtc').connect(PrimaryI2C);
var http = require('http');
barometer.init();

// Connetction to Wi-Fi network
var wifi = require('@amperka/wifi').setup(PrimarySerial, function(err) {
  wifi.connect(SSID, PSWD, function(err) {
    print('Connected to Wi-Fi');

    // Callback
    getTime();
  });
});

// Yandex API call to get UNIX TimeStamp
var getTime = function() {
  http.get('https://yandex.com/time/sync.json?geo=213', function(res) {
    var response = '';

    res.on('data', function(d) {
      response += d;
    });

    res.on('close', function() {

      // Yandex time data processing
      var timeResponse = Math.floor((JSON.parse(response).time + 10800000) / 1000);

      // Setting uo starting time for RTC sensor
      rtc.setTime(timeResponse);
      print('UNIX TimeStamp: ' + timeResponse);

      // Callback
      printSensors(timeResponse);
    });
  });
};

// Parameters of sensors and console output
var printSensors = function(timeResponse) {
  var timerId = setInterval(function() {

    // Sensors calling and parameters
    var printRtc = rtc.getTime('iso');
    var printThermometer = Math.round((thermometer.read('C') * 10)) / 10 + ' °C';
    var printBarometer = Math.round((barometer.read('mmHg') * 10)) / 10 + ' mmHg';

    // Console output
    print(printRtc + '  ' + printThermometer + '  ' + printBarometer);

    // Function iteration repeat time: 1 second
  }, 1000);
};
