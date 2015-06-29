var port = '/dev/ttyUSB0';
var os = require('os').platform();
if(os=='darwin'){
    port = '/dev/cu.usbserial-A702X0MB';
}

var seedDriver = {};

var seedDriver_SyringePump_HA_PicoPlus;
seedDriver_SyringePump_HA_PicoPlus = {
    driverId : 'SyringePump_HA_PicoPlus',
    io : {
        communication: 'RS232',
        port : port,
        config: {
            baudrate : 9600,
            stopbits: 2,
            databits: 8, //also known as bytesize
            parity: 'none'
        },
        initializeCommand: 'VER\r',
        delimiter: '\n' // this means every line will be interpreted as data
    },
    ui : [{
        type:'button',
        id:'start',
        name:'Start',
        style : 'col-md-3'
    },{
        type:'button',
        id:'stop',
        name:'Stop',
        style : 'col-md-3'
    },{
        type:'button',
        id:'reverse',
        name:'reverse',
        style : 'col-md-3'
    },{
        type:'button',
        id:'version',
        name:'Firmware Version',
        resultId : 'firmwareVersion',
        style : 'col-md-4 '
    },{
        type:'display',
        id:'firmwareVersion',
        name:'Firmware Version',
        value:'',
        style : 'col-md-4'
    },{
        id:'setVolumn',
        name: 'Set'
    },{
        id:'setDiameter',
        name: 'Set'
    }],
    commands: [{
        _id:'start',
        command:'RUN\r'
    },{
        _id:'stop',
        command:'STP\r'
    },{
        _id : 'reverse',
        command : 'REV\r'
    },{
        _id:'version',
        command:'VER\r',
        filter : /(?:([0-9]+).([0-9]+))/g
    },{
        _id:'setVolumn',
        command:'',
        preProcessor : function(command,parameter){
            return parameter.unit+parameter.value+'\r';
        }
    },{
        _id:'setDiameter',
        command:'',
        preProcessor : function(command,parameter){
            return 'MMD'+parameter.unit+'\r';
        }
    }],
    company: 'Harvard Apparatus',
    instrument: 'Pico Plus Syringe Pump'
};

var seedDriver_MassBalancer;
seedDriver_MassBalancer = {
    driverId: 'MassBalancer_OHAUS',
    io: {
        communication: 'RS232',
        port : port,
        config : {
            baudrate: 2400,
            stopbits: 2,
            databits: 7, //also known as bytesize
            parity: 'none'
        },
        delimiter: '\n' // this means every line will be interpreted as data
    },
    // UI
    ui: [{
        type: 'button',
        name: 'Single Acquisition',
        id: 'singleAcquisition',
        resultId: 'mass', // where to display the result
        style : 'col-md-4'
    },  {
        type: 'button',
        name: 'Multiple Acquisition',
        id: 'multipleAcquisition',
        resultId: 'mass',
        parameterId: 'interval',
        style: 'col-md-4'
    }, {
        type: 'input',
        name: 'Interval(sec)',
        id: 'interval',
        value:'',
        style: 'col-md-4'
    },{
        type: 'button',
        name : 'Zero',
        id : 'zero',
        resultId: 'mass',
        style: 'col-md-4'
    },{
        type: 'display',
        name: 'Mass',
        id: 'mass',
        value:'',
        style:'col-md-12'
    },{
        id: 'stop'
    }],
    // COMMANDS
    commands: [{
        _id: 'singleAcquisition', // needs to match the button id
        command: 'IP\r',
        postProcessor : function(result){
            /*var lines;
            // get the 7th line if there are that many
            lines = result.split('\n');
            if (lines.length > 6) { return lines[6].trim();}
            else { return result;}*/
            //var regExp = /g
            return result;

        },
        filter : /(?:([0-9]+).([0-9]+)) g/g
    },{
        _id: 'multipleAcquisition',
        command: 'P\r',
        preProcessor : function(command,parameter){
            return parameter.interval+command;
        },
        filter : /(?:([0-9]+).([0-9]+)) g/g
    },{
        _id : 'zero',
        command: 'Z\r'
    },{
        _id : 'stop',
        command: '0P\r'
    }],

    company : 'OHAUS',
    instrument : 'Adventurer Pro Mass Balancer'
};

var seedDriver_SyringePump_KDS_Legato101;
seedDriver_SyringePump_KDS_Legato101 = {
  driverId: "SyringePump_KDS_Legato101",
  io: {
    communication: "RS232",
    port: "/dev/ttyACM0",
    config: {
      baudRate: 115200,
      stopBits: 1,
      dataBits: 8,
      parity: "none"
    },
    delimiter: "\r\n",
  },
  ui: [
    {
      id: 'getRate',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'getRateUnits',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'setRate',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'run',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'stop',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'getDiameter',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'setDiameter',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'getInfusedVolume',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'clearInfusedVolume',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'getTargetVolume',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'setTargetVolume',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      id: 'clearTargetVolume',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'input',
      id: 'param'
    },
    {
      type: 'display',
      id: 'result'
    },
  ],
  commands: [
    {
      _id: "getVersion",
      command: "@ver\r",
      filter: /\s+(Legato [\d\. ]+)/g
    },
    {
      _id: "getRate",
      command: "@irate\r",
      filter: /\n([\d\.]+) (?:pl|nl|ul|ml|L)\/(?:sec|min|hr)/g
    },
    {
      _id: "getRateUnits",
      command: "@irate\r",
      filter: /\n[\d\.]+ ((?:pl|nl|ul|ml|L)\/(?:sec|min|hr))/g
    },
    {
      _id: "setRate",
      command: "irate {rate} {volUnit}/{timeUnit}\r",
      preProcessor: function(command, parameter) {
        return 'irate ' + parameter.rate + ' ' + parameter.unit + '\r';
      }
    },
    {
      _id: "run",
      command: "run\r"
    },
    {
      _id: "stop",
      command: "stp\r"
    },
    {
      _id: "getDiameter",
      command: "@diameter\r",
      filter: /\n([\\d\\.]+) mm/g
    },
    {
      _id: "setDiameter",
      command: "diameter {dia}\r",
      preProcessor : function(command, parameter){
        return 'diameter ' + parameter.diameter + '\r';
      }
    },
    {
      _id: "getInfusedVolume",
      command: "@ivolume\r",
      filter: /\n([\\d\\.]+)/g
    },
    {
      _id: "clearInfusedVolume",
      command: "cvolume\r"
    },
    {
      _id: "getTargetVolume",
      command: "@tvolume\r",
      filter: /\n([\\d\\.]+) (?:pl|nl|ul|ml|L)/g
    },
    {
      _id: "setTargetVolume",
      command: "tvolume {target} ml\r",
      preProcessor : function(command, parameter){
        return 'tvolume ' + parameter.target + '\r';
      }
    },
    {
      _id: "clearTargetVolume",
      command: "ctvolume\r"
    },
  ],
  company: "KD Scientific",
  instrument: "Legato 101"
};

var seedDriver_Hotplate_TorreyPines = {
  driverId: "HotPlate_TorreyPines",
  io: {
    communication: "RS232",
    port: "/dev/ttyUSB0",
    config: {
      baudRate: 2400,
      stopBits: 1,
      dataBits: 8,
      parity: "none"
    },
    initializeCommand: "",
    shutdownCommand: "",
    delimiter: "\r"
  },
  ui: [
    {
      id: 'setPlateTarget',
      type: 'button',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'button',
      id: 'setProbeTarget',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'button',
      id: 'setProbeTarget',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'button',
      id: 'setStirrerSpeed',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'button',
      id: 'setHeaterOff',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'button',
      id: 'setStirrerOff',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'button',
      id: 'getProbeTemp',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'button',
      id: 'getPlateTemp',
      parameterId: 'param',
      resultId: 'result'
    },
    {
      type: 'input',
      id: 'param'
    },
    {
      type: 'display',
      id: 'result'
    },
  ],
  commands: [
    {
      _id: "getPlateTemp",
      command: "a\r",
      filter: "(\\d+) C"
    },
    {
      _id: "getProbeTemp",
      command: "b\r",
      filter: "(\\d+) C"
    },
    {
      _id: "getTimer",
      command: "c\r",
      filter: "(\\d\\d:\\d\\d:\\d\\d)"
    },
    {
      _id: "getPlateTarget",
      command: "e\r",
      filter: "(\\d+) C"
    },
    {
      _id: "getProbeTarget",
      command: "f\r",
      filter: "(\\d+) C"
    },
    {
      _id: "getStirrerSpeed",
      command: "g\r",
      filter: "(\\d+) RPM"
    },
    {
      _id: "setPlateTarget",
      command: "A{temp}\r",
      preProcessor: function(command, params) {
        return 'A' + params.temp + '\r';
      }
    },
    {
      _id: "setProbeTarget",
      command: "B{temp}\r",
      preProcessor: function(command, params) {
        return 'B' + params.temp + '\r';
      },
    },
    {
      _id: "setTimer",
      command: "C{time}\r",
      preProcessor: function(command, params) {
        return 'C' + params.time + '\r';
      },
    },
    {
      _id: "setStirrerSpeed",
      command: "E{speed}\r",
      preProcessor: function(command, params) {
        return 'E' + params.speed + '\r';
      },
    },
    {
      _id: "setStirrerOff",
      command: "F\r"
    },
    {
      _id: "setHeaterOff",
      command: "G\r"
    },
    {
      _id: "toggleAutoOffMode",
      command: "H\r"
    }
  ],
  company: "Torrey Pines Scientific",
  instrument: "HS30 Hot Plate"
};

seedDriver.SyringePump = seedDriver_SyringePump_HA_PicoPlus;
seedDriver.MassBalancer = seedDriver_MassBalancer;
seedDriver.drivers = [
    seedDriver_SyringePump_HA_PicoPlus,
    seedDriver_SyringePump_KDS_Legato101,
    seedDriver_MassBalancer,
    seedDriver_Hotplate_TorreyPines
];
module.exports.seedDriver = seedDriver;
