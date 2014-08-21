var SPI = require('spi');


function ADC(device, referenceVoltage) {

    this.referenceVoltage = referenceVoltage;
    this.device = new SPI.Spi({
        "mode": SPI.MODE[0],
        "chipSelect": SPI.CS['low'],
        "maxSpeed": 1000000
    });
    this.currentValue = 0;
    this.currentVoltage = this.voltageToValue( this.currentValue );    

};

//based on the MCP3202 12bit ADC chip
//chanel is 0 or 1
ADC.prototype.getRawValue = function( value, channel ) {
    //write out the raw value
    this.currentValue = value;
    this.currentVoltage = this.valueToVoltage( value );
    var buffer = new Buffer([
        0x01, // start bit
        (1+channel)<<6, // not sure this is correct
        0 //some padding cause we can only read as we write cause the clock has to run
    ]);

    this.device.read(buffer, function(device, outBuffer) {
        var s = "";
        for (var i=0; i < outBuffer.length; i++)
            s = s + outBuffer[i] + " ";
        console.log(s + "\n");
    });

};

ADC.prototype.voltageToValue = function( voltage ) {
    return (voltage / this.referenceVoltage) * 4096;
}

ADC.prototype.valueToVoltage = function( value ) {
    //turn the worm around
    return (value / 4096) * this.referenceVoltage;
}

ADC.prototype.close = function() {
    this.device.close();
}


module.exports.ADC = ADC;