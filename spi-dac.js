var SPI = require('spi');


function DAC(device, referenceVoltage) {

    this.referenceVoltage = referenceVoltage;
    this.device = new SPI.Spi(device, {
        "mode": SPI.MODE['MODE_0'],
        "chipSelect": SPI.CS['low'],
        "maxSpeed": 1000000
    });
    this.device.bitsPerWord = 8;
    this.device.halfDuplex = true;
    this.device.open();
    this.currentValue = 0;
    this.currentVoltage = this.voltageToValue( this.currentValue );

};


//based on the MCP4822 12bit DAC chip, also MCP4921
DAC.prototype.setRawValue = function( value ) {
    //write out the raw value
    var channel = 1; // the MSP4921 only has one channel
    this.currentValue = value;
    this.currentVoltage = this.valueToVoltage( value );
    var lowByte = value & 0xff;
    var highByte = ((value >> 8) & 0xff) | (channel - 1) << 7 | 0x1 << 5 | 1 << 4;
    var buffer = new Buffer( [ highByte, lowByte] );
    this.device.write( buffer );
};


DAC.prototype.setVoltage = function( voltage ) {
    var val = this.voltageToValue(voltage);
    return this.setRawValue( val );
}

DAC.prototype.voltageToValue = function( voltage ) {
    return (voltage / this.referenceVoltage) * 4095;
}

DAC.prototype.valueToVoltage = function( value ) {
    //turn the worm around
    return (value / 4095) * this.referenceVoltage;
}

DAC.prototype.close = function() {
    this.device.close();
}


module.exports.DAC = DAC;