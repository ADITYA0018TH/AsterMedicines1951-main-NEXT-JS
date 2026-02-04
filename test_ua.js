const { UAParser } = require('ua-parser-js');

const uas = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', // Modern Mac
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', // iPhone
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36', // Android
];

uas.forEach(ua => {
    const parser = new UAParser(ua);
    const result = parser.getResult();
    console.log('---');
    console.log('UA:', ua);
    console.log('Device:', result.device);
    console.log('OS:', result.os);
    console.log('Browser:', result.browser);
    console.log('CPU:', result.cpu);
});
