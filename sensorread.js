var groveSensor = require('jsupm_grove');
var sensorModule = require('jsupm_ttp223');
var sensorModulePiezo = require('jsupm_ldt0028');
var digitalAccelerometer = require('jsupm_mma7660');

//Static values for piezo
var NUMBER_OF_SECONDS = 10;
var MILLISECONDS_PER_SECOND = 1000;
var SAMPLES_PER_SECOND = 50;
var THRESHOLD = 100;

var piezo = new sensorModulePiezo.LDT0028(3);


var touch = new sensorModule.TTP223(3);  
var led = new groveSensor.GroveLed(2);
var tempSensor = new groveSensor.GroveTemp(1);
var light = new groveSensor.GroveLight(0);

var myDigitalAccelerometer = new digitalAccelerometer.MMA7660(
					digitalAccelerometer.MMA7660_I2C_BUS, 
					digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);

// Print the name
console.log(led.name());
console.log(touch.name());
console.log(tempSensor.name());
console.log(light.name());

function readSensorValue() { 

    if (touch.isPressed()) {
        led.on();
        readPiezo();
    } else {     
        led.off();
    }                                                                                                                                                  
}                          
setInterval(readSensorValue, 2000); 


function readTempandLight(){

    var celsius = tempSensor.value();
    var lux = light.value();
    
    console.log("Value light: " + lux + " Temp " + celsius);

}



// place device in standby mode so we can write registers
myDigitalAccelerometer.setModeStandby();

// enable 64 samples per second
myDigitalAccelerometer.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_64);

// place device into active mode
myDigitalAccelerometer.setModeActive();

var x, y, z;
x = digitalAccelerometer.new_intp();
y = digitalAccelerometer.new_intp();
z = digitalAccelerometer.new_intp();

var ax, ay, az;
ax = digitalAccelerometer.new_floatp();
ay = digitalAccelerometer.new_floatp();
az = digitalAccelerometer.new_floatp();

var outputStr;

function getAccelerometerData()
{
	myDigitalAccelerometer.getRawValues(x, y, z);
	outputStr = "Raw values: x = " + digitalAccelerometer.intp_value(x) +
	" y = " + digitalAccelerometer.intp_value(y) +
	" z = " + digitalAccelerometer.intp_value(z);
	console.log(outputStr);

	myDigitalAccelerometer.getAcceleration(ax, ay, az);
	outputStr = "Acceleration: x = " 
		+ roundNum(digitalAccelerometer.floatp_value(ax), 6)
		+ "g y = " + roundNum(digitalAccelerometer.floatp_value(ay), 6) 
		+ "g z = " + roundNum(digitalAccelerometer.floatp_value(az), 6) + "g";
	console.log(outputStr);
}

// round off output to match C example, which has 6 decimal places
function roundNum(num, decimalPlaces)
{
	var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));
	return (Math.round((num + extraNum) 
		* (Math.pow(10, decimalPlaces))) / Math.pow(10, decimalPlaces));
}

// When exiting: clear interval and print message
process.on('SIGINT', function()
{
	clearInterval(myInterval);

	// clean up memory
	digitalAccelerometer.delete_intp(x);
	digitalAccelerometer.delete_intp(y);
	digitalAccelerometer.delete_intp(z);

	digitalAccelerometer.delete_floatp(ax);
	digitalAccelerometer.delete_floatp(ay);
	digitalAccelerometer.delete_floatp(az);

	myDigitalAccelerometer.setModeStandby();

	console.log("Exiting...");
	process.exit(0);
});




function readPiezo(){

var buffer = [];
for (var i=0; i < NUMBER_OF_SECONDS * SAMPLES_PER_SECOND; i++) {
    buffer.push(piezo.getSample());
    delay(MILLISECONDS_PER_SECOND / SAMPLES_PER_SECOND );
}

// Print the number of times the reading was greater than the threshold
var count = 0;
for (var i=0; i < NUMBER_OF_SECONDS * SAMPLES_PER_SECOND; i++) {
    if (buffer[i] > THRESHOLD) {
        count++;
    }
}
console.log(piezo.name() + " exceeded the threshold value of " +
        THRESHOLD + " a total of " + count + " times,");
console.log("out of a total of " + NUMBER_OF_SECONDS*SAMPLES_PER_SECOND +
            " readings.");
console.log("");

// Print a graphical representation of the average value sampled
// each second for the past 10 seconds, using a scale factor of 15
console.log("Now printing a graphical representation of the average reading ");
console.log("each second for the last " + NUMBER_OF_SECONDS + " seconds.");
var SCALE_FACTOR = 15;
for (var i=0; i < NUMBER_OF_SECONDS; i++) {
    var sum = 0;
    for (var j=0; j < SAMPLES_PER_SECOND; j++) {
        sum += buffer[i*SAMPLES_PER_SECOND+j];
    }
    var average = sum / SAMPLES_PER_SECOND;
    var stars_to_print = Math.round(average / SCALE_FACTOR);
    var string = "(" + ("    " + Math.round(average)).slice(-4) + ") | ";
    for (var j=0; j < stars_to_print; j++) {
        string += "*";
    }
    console.log(string);
}
}
function delay( milliseconds ) {
    var startTime = Date.now();
    while (Date.now() - startTime < milliseconds);
}



