adc-dac
=======

A quick library using fivdi/spi-device to talk to the MCP4821 12bit DAC chip.

It works...

```
var DAC = require('adc-dac').DAC;

// the device you have wired to Chip Select 1
// and a referance voltage to help with the conversion
dac = new DAC(0, 1, 3.3); // '/dev/spidev0.1'

let volts = 0;
while(true){
    volts += 0.1;

    if (volts > 3.3) {
        volts = 0;
    }

    dac.setVoltage(volts);
}
```