const spi = require('spi-device');

function DAC(bus, device, referenceVoltage) {

    this.referenceVoltage = referenceVoltage;

    this.device = spi.openSync(bus, device, {
        "maxSpeed": 1000000,
        "bitsPerWord": 8,
    });

    this.currentVoltage = this.voltageToValue(0);
}

//based on the MCP4822 12bit DAC chip, also MCP4921
DAC.prototype.setRawValue = function( value ) {
    //write out the raw value
    let channel = 1; // the MSP4921 only has one channel
    this.currentVoltage = this.valueToVoltage(value);
    let lowByte = value & 0xff;
    let highByte = ((value >> 8) & 0xff) | (channel - 1) << 7 | 0x1 << 5 | 1 << 4;

    this.device.transferSync([{
        byteLength: 2,
        sendBuffer: Buffer.from([highByte, lowByte]),
    }]);
};

DAC.prototype.setVoltage = function( voltage ) {
    var val = this.voltageToValue(voltage);
    return this.setRawValue(val);
}

DAC.prototype.voltageToValue = function( voltage ) {
    return (voltage / this.referenceVoltage) * 4095;
}

DAC.prototype.valueToVoltage = function( value ) {
    //turn the worm around
    return (value / 4095) * this.referenceVoltage;
}

DAC.prototype.close = function() {
    this.device.closeSync();
}

module.exports.DAC = DAC;
