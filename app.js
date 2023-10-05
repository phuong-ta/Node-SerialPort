//const { SerialPort } = require('serialport')
const { SerialPort, ReadlineParser } = require('serialport')
const express = require('express')
const app = express()
const serverPort = 4000

const port = new SerialPort({
    path: 'COM12',
    baudRate: 115200
    }, function (err) {
    if (err) {
        return console.log('Error: ', err.message)
    }
}).setEncoding("utf-8");

// Creating the parser and piping can be shortened to
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
const connected = new Promise(function (resolve){
    console.log("Opening Port")
    port.on("open",resolve)
}).then(function (){
    console.log("port is open... Baud rated 115200")
    //port.write("aq");
})

app.get('/', async (req, res) => {
    port.write('a');
    port.write('q');
    const cb = data =>{
        console.log("Data in route:\n" + data);
        res.status(200)
        port.removeAllListeners();
    }
    port.on("readable",()=>{
        port.read(22);
    });
    getData();
    res.json('data');
});

app.listen(serverPort, () => {
    console.log(`Example app listening on port ${serverPort}`)
})

function getData(){
    parser.on('data',(data)=>{
        console.log("Data:\n"+data);
    });
}