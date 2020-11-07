// Delete all comments before using
// v 0.2.2

// Setting up UART for Wi-Fi
PrimarySerial.setup(115200);

// Setting up I2C for RTC
PrimaryI2C.setup({ sda: SDA, scl: SCL, bitrate: 100000 });

// Setting up I2C1 for barometer
I2C1.setup({ sda: SDA, scl: SCL, bitrate: 400000 });

// Set up the Wi-Fi connection
var SSID = 'YOUR_SSID';
var PSWD = 'YOUR_PSWD';

// Sensors initialization
var wifi = require('Wifi');
var barometer = require('@amperka/barometer').connect({ i2c: I2C1 });
var thermometer = require('@amperka/thermometer').connect(A1);
var rtc = require('@amperka/rtc').connect(PrimaryI2C);
var http = require('http');
barometer.init();

// Connetction to Wi-Fi network
function wifiConnect() {
  wifi.connect(SSID, {password:PSWD}, function(err) {
    if(err){
      print(err);
      setTimeout(wifiConnect, 2*60*1000);
    }
    else{
      print('Connected to Wi-Fi');
      
      // Callback returning current time
      getTime();
    }
  });
}

wifi.on('disconnected', function(details){
    print('Wifi disconnected, reason: ' + details.reason);
    wifiConnect();
});

wifiConnect();

// Yandex API call to get UNIX TimeStamp
  var getTime = function() {

    // Get Moscow time
    http.get('https://yandex.com/time/sync.json?geo=213', function(res) {
      var response = '';

      res.on('data', function(d) {
        response += d;
      });

      res.on('close', function() {

        // Yandex time data processing
        var timeResponse = Math.floor((JSON.parse(response).time + 10800000) / 1000);

        // Setting up starting time for RTC sensor
        rtc.setTime(timeResponse);
        print('UNIX TimeStamp: ' + timeResponse);
        print('Follow me on Telegram channel: http://t.me/semeonboboshko');

        // Callback
        setTimeout(sendData, 60000);
      });
    });
  };

// Poll sensors and sending data to server API
function sendData() {

  // Poll sensors
  var sensorsData = JSON.stringify({
    station_id: 0,
    date_count: rtc.getTime('unixtime'),
    temperature: Math.round((thermometer.read('C') * 10)) / 10,
    pressure: Math.round((barometer.read('mmHg') * 10)) / 10
  });

  // Connect to API server
  // Set up: host, port, path, and authorization
  var options = {
    host: '000.00.00.000',
    port: '3012',
    path: '/zarya/add',
    protocol: 'http:',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': sensorsData.length,
      'Accept-encoding': 'gzip, deflate',

      // Encode your login and password to Base64
      'Authorization': 'Basic LoginAndPasswordCodedInBase64',
      'Connection': 'keep-alive',
      'Cache-control': 'no-cache'
    }};

  // POST-request
  var request = http.request(options, function(res) {
    var response = '';

    res.on('data', function(d) {
      response += d;
    });

    res.on('close', function() {
    });
  });

  // Send data to API server
  request.end(sensorsData);

 // Endless Callback with 60s timeout
  setTimeout(sendData, 60000);
}
