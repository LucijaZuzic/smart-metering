var http = require('http');
var express = require('express');
var cors = require('cors');
var app2 = express();
var fs = require('fs');
app2.use(cors({origin: '*'}));

app2.get('/bme680', function(req, res) {

    var exec = require('child_process').exec, child;

    child = exec('python3 bme680.py',
    function (error, stdout, stderr) {
        if (error !== null) {
             console.log('exec error: ' + error);
             res.status(500).send(stderr);
  	     return;
        }
        res.status(200).send(stdout);
  	return;
    });
});

app2.get('/bme680.json', function(req, res) {
    var x = fs.readFileSync('assets/bme680.json', (err) => {});
    res.status(200).send(x);
    return;
});

app2.get('/killvideo', function(req, res) {

    var exec = require('child_process').exec, child;

    child = exec('sudo /etc/init.d/motion stop',
    function (error, stdout, stderr) {
        if (error !== null) {
             console.log('exec error: ' + error);
             res.status(500).send(stderr);
  	     return;
        }
        console.log('video ended');
        res.status(200).send(stdout);
  	return;
    });
});
app2.get('/video', function(req, res) {

    var exec = require('child_process').exec, child;

    child = exec('sudo /etc/init.d/motion start',
    function (error, stdout, stderr) {
        if (error !== null) {
             console.log('exec error: ' + error);
             res.status(500).send(stderr);
  	     return;
        }
        console.log('video started');
        res.status(200).send(stdout);
  	return;
    });
});

app2.get('/delete', function(req, res) {

    var exec = require('child_process').exec, child;

    child = exec('rm assets/bme680.json',
    function (error, stdout, stderr) {
        if (error !== null) {
             console.log('exec error: ' + error);
             res.status(500).send(stderr);
  	     return;
        }
        res.status(200).send(stdout);
  	return;
    });
});

app2.get('/microparticle', function(req, res) {

    var exec = require('child_process').exec, child;

    child = exec('sudo python aqi.py',
    function (error, stdout, stderr) {
        if (error !== null) {
             console.log('exec error: ' + error);
             res.status(500).send(stderr);
  	     return;
        }
	res.status(200).send(stdout);
  	return;
    });
});

app2.get('/microparticle.json', function(req, res) {
    var x = fs.readFileSync('assets/microparticle.json', (err) => {});
    res.status(200).send(x);
    return;
});

app2.get('/deletemicroparticle', function(req, res) {

    var exec = require('child_process').exec, child;

    child = exec('rm assets/microparticle.json',
    function (error, stdout, stderr) {
        if (error !== null) {
             console.log('exec error: ' + error);
             res.status(500).send(stderr);
  	     return;
        }
        res.status(200).send(stdout);
  	return;
    });
});

app2.get('/image', function(req, res) {

    var exec = require('child_process').exec, child;

    child = exec('raspistill -o assets/image.jpg',
    function (error, stdout, stderr) {
        if (error !== null) {
             console.log('exec error: ' + error);
             res.status(500).send(stderr);
  	     return;
        }
        res.status(200).send(stdout);
  	return;
    });
});

app2.get('/image.jpg', function(req, res) {
    var x = fs.readFileSync('assets/image.jpg', (err) => {});
    res.status(200).send(x);
    return;
});

app2.get('*', function(req, res) {
    res.status(404).send('Unrecognised API call');
});

app2.use(function(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send('Oops, Something went wrong!');
  	return;
    } else {
        next(err);
    }
});

app2.listen(3000);
console.log('app2 Server running at port 3000');