var SPI = require('spi');


function DAC(device, referenceVoltage) {

    this.referenceVoltage = referenceVoltage;
    this.device = new SPI.Spi({
        "mode": SPI.MODE[0],
        "chipSelect": SPI.CS['low'],
        "maxSpeed": 1000000
    });
    
    this.currentValue = 0;
    this.currentVoltage = this.voltageToValue( this.currentValue );

};


//based on the MCP4822 12bit DAC chip, also MCP4921
DAC.prototype.setRawValue = function( value ) {
    //write out the raw value
    this.currentValue = value;
    this.currentVoltage = this.valueToVoltage( value );
    var lowByte = value & 0xff;
    var highByte = ((value >> 8) & 0xff) | (channel - 1) << 7 | 0x1 << 5 | 1 << 4;
    var buffer = new Buffer( [highByte, lowByte] );
    this.device.write( buffer );
};


DAC.prototype.setVoltage = function( voltage ) {
    return this.setRawValue( this.voltageToValue(voltage) );
}

DAC.prototype.voltageToValue = function( voltage ) {
    return (voltage / this.referenceVoltage) * 4096;
}

DAC.prototype.valueToVoltage = function( value ) {
    //turn the worm around
    return (value / 4096) * this.referenceVoltage;
}

DAC.prototype.close = function() {
    this.device.close();
}


module.exports.DAC = DAC;