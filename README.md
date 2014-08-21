adc-dac
=======

A quick library using RussTheAerialist/node-spi to talk to the MCP4821 12bit DAC chip and the MCP3202 12bit ADC chip.

It works...


```
var DAC = require('adc-dac').DAC;
var ADC = require('adc-dac').ADC;

// the device you have wired to Chip Select 1
// and a referance voltage to help with the conversion
dac = new DAC( '/dev/spidev0.1', 3.3 );

// the device you have wired to Chip Select 0
adc = new ADC( '/dev/spidev0.0', 3.3 );


while(true){
    //wire your pot to channel 1 on the ADC chip and your LED to channel 0 on your
    dac.setVoltage( adc.getVoltage( adc.CHANNEL_0 ) );
}
```