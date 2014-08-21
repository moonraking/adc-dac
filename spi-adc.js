var SPI = require('spi');



function ADC(device, referenceVoltage) {

    this.referenceVoltage = referenceVoltage;
    this.device = new SPI.Spi(device, {
        "mode": SPI.MODE['MODE_0'],
        "chipSelect": SPI.CS['low'],
        "maxSpeed": 1000000
    });
    this.device.open();

};

ADC.prototype.CHANNEL_1 = 1;
ADC.prototype.CHANNEL_2 = 2;

//based on the MCP3202 12bit ADC chip
//chanel is 1 or 2
ADC.prototype.getRawValue = function( channel ) {

    var txBuffer = new Buffer([
        0x01, // start bit
        (1+channel)<<6, // MSB first
        0 //some padding cause we can only read as we write cause the clock has to run
    ]);

    var rxBuffer = new Buffer([ 0x00, 0x00, 0x00 ]);

    this.device.transfer(txBuffer, rxBuffer, function(device, outBuffer) {
        var s = "";
        for (var i=0; i < outBuffer.length; i++)
            s = s + outBuffer[i] + " ";
      //  console.log(s + "\n");
    });
    //console.log(rxBuffer);
    return ((rxBuffer[1]&0x0F) << 8) + (rxBuffer[2]);

};

ADC.prototype.getVoltage = function( channel ){
    return this.valueToVoltage( this.getRawValue( channel ) );
}

ADC.prototype.voltageToValue = function( voltage ) {
    return (voltage / this.referenceVoltage) * 4095;
}

ADC.prototype.valueToVoltage = function( value ) {
    //turn the worm around
    return (value / 4095) * this.referenceVoltage;
}

ADC.prototype.close = function() {
    this.device.close();
}


module.exports.ADC = ADC;