// FIXME: these devices no longer match the schema
var seedDevice = {};

var adaptorObj1 = {
    deviceType:'adaptor',
    deviceName:'tsLinkName1',
    driverId: 'SyringePump_HA_PicoPlus'
};

var adaptorObj2 = {
    deviceType:'adaptor',
    deviceName:'tsLinkName2',
    driverId: 'MassBalancer_OHAUS'
};

var cameraObj = {
    deviceType : 'camera',
    deviceName : 'tsCameraName',
    params: {
        snapshotImageFileName:''
    }
};

var sensorObj = {
    deviceType : 'sensor',
    deviceName : 'tsSensorName',
    sensor: {
        parameter : 'Temperature'
    }
};

var switchObj = {
    deviceName : 'tsSwitchName',
    deviceType : 'switch'
};

var boxObj= {
    deviceName: 'newBox',
    deviceType: 'box'
};

seedDevice.adaptor1 = adaptorObj1;
seedDevice.adaptor2 = adaptorObj2;
seedDevice.camera = cameraObj;
seedDevice.sensor = sensorObj;
seedDevice.switch = switchObj;
seedDevice.box = boxObj;

module.exports.seedDevice = seedDevice;

