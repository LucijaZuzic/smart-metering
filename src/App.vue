<template>
  <div id="app" class = 'container-fluid'> 
      <!--<
      <line-chart :key="myvar" :chartData="chartData3" :options="chartOptions3"></line-chart>
      -->
      <div class='row'>
        <div class='col'>
          <div id="air"></div>
        </div>
        <div class='col'>
          <div id="inputs"></div>
          <div id="microparticle"></div>
        </div>
        <div class='col mybutton'>
          <input type="checkbox" v-model="showtemp"> Show temperature<br />
          <input type="checkbox" v-model="showgas"> Show gas<br />
          <input type="checkbox" v-model="showhdty"> Show humidity<br />
          <input type="checkbox" v-model="showpres"> Show pressure<br />
          <input type="checkbox" v-model="showalt"> Show altitude<br />
          <input type="checkbox" v-model="showIAQ"> Show IAQ<br />
          <input type="checkbox" v-model="showPM25"> Show PM2.5<br />
          <input type="checkbox" v-model="showPM10"> Show PM10<br />
        </div>
        <div class='col'>
          Update interval: <input type='number' v-model="updateinterval"><br />
          Maximum chart samples: <input type='number' v-model="maxchartlen"><br />
        </div>
      </div>
      <div class='row mybutton'>
        <div class='col'>
          <b-button-group>
            <b-button v-on:click="cleartemp()"> Clear temperature</b-button>
            <b-button v-on:click="cleargas()"> Clear gas</b-button>
            <b-button v-on:click="clearhdty()"> Clear humidity</b-button>
            <b-button v-on:click="clearpres()"> Clear pressure</b-button>
            <b-button v-on:click="clearalt()"> Clear altitude</b-button>
            <b-button v-on:click="clearIAQ()"> Clear IAQ</b-button>
            <b-button v-on:click="clearPM25()"> Clear PM2.5</b-button>
            <b-button v-on:click="clearPM10()"> Clear PM10</b-button>
          </b-button-group>
        </div>
      </div>
      <div class='row'>
        <div class='col'>
          <b-button-group>
            <b-button v-on:click='getme = 0'>Stop</b-button>
            <b-button v-on:click='getme = 1'>Start</b-button>            
          </b-button-group>
        </div>
        <div class='col'>
          <b-button-group>
            <b-button v-on:click='resetmicroparticle()'>Reset microparticle</b-button>         
            <a class = 'btn btn-secondary' href='http://192.168.1.10:3000/microparticle.json' download='microparticle.json'>Download microparticle</a>
          </b-button-group>
        </div>
        <div class='col'>
          <b-button-group>
            <b-button v-on:click='reset()'>Reset file</b-button>         
            <a class = 'btn btn-secondary' href='http://192.168.1.10:3000/bme680.json' download='bme680.json'>Download file</a>
          </b-button-group>
        </div>
        <div class='col'>
          <b-button-group>       
            <b-button v-on:click='getanimage()'>Get image</b-button>    
            <a class = 'btn btn-secondary' href='http://192.168.1.10:3000/image.jpg' download='image.jpg'>Download image</a>
          </b-button-group>
        </div>
        <div class='col'>    
          <b-button v-on:click='video()'>Start video</b-button>    
        </div>
      </div>
      <div class='row'>
        <div class='col'>
          <line-chart v-if='showtemp' class = 'small' :key="bme680temperature" :chartData="chartDatabme680temperature" :options="chartOptionsbme680temperature"></line-chart> 
        </div>
        <div class='col' >
          <line-chart v-if='showgas' class = 'small' :key="bme680gas" :chartData="chartDatabme680gas" :options="chartOptionsbme680gas"></line-chart>
        </div>
        <div class='col'>
          <line-chart v-if='showhdty' class = 'small' :key="bme680humidity" :chartData="chartDatabme680humidity" :options="chartOptionsbme680humidity"></line-chart>
        </div>
        <div class='col'>
          <line-chart v-if='showpres' class = 'small' :key="bme680pressure" :chartData="chartDatabme680pressure" :options="chartOptionsbme680pressure"></line-chart>
        </div>
        <div class='col'>
          <line-chart v-if='showalt' class = 'small' :key="bme680altitude" :chartData="chartDatabme680altitude" :options="chartOptionsbme680altitude"></line-chart>
        </div>
        <div class='col'>
          <line-chart v-if='showIAQ' class = 'small' :key="bme680IAQ" :chartData="chartDatabme680IAQ" :options="chartOptionsbme680IAQ"></line-chart>
        </div>
        <div class='col'>
          <line-chart v-if='showPM25' class = 'small' :key="PM25" :chartData="chartDataPM25" :options="chartOptionsPM25"></line-chart>
        </div>
        <div class='col'>
          <line-chart v-if='showPM10' class = 'small' :key="PM10" :chartData="chartDataPM10" :options="chartOptionsPM10"></line-chart>
        </div>
        <div class='col'>   
          <img src = './assets/image.jpg' class="small">
        </div>
      </div>
  </div>
</template>

<script>

//import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue'
import axios from 'axios'

var descr = ['Extremely polluted', 'Severely polluted', 'Heavily polluted', 'Moderately polluted', 'Lightly polluted', 'Good', 'Excellent']
var IAQ = [500, 350, 250, 200, 150, 100, 50, 0]
var c = ['brown','purple','red','orange','yellow','green','dark green'];

export default {
  name: 'App',
  mounted() {    
    this.time_elapsed = setInterval(() => (this.time_elapsed += this.getme), 1000);
  },
  data: () => ({
    getme: 1,
    updateinterval: 1,
    values: {'temperature': 0, 
              'pressure': 0, 
              'CO2': 0, 
              'NO2': 0, 
              'CO': 0, 
              'NO': 0},
    time_elapsed: 0,
    maxchartlen: 10,
    myvar: 0,
    myvar2: 2,
    bme680temperature: 4,
    bme680gas: 6,
    bme680humidity: 8,
    bme680pressure: 10,
    bme680altitude: 12,
    bme680IAQ: 14,
    PM25: 16,
    PM10: 18,
    showtemp: 1,
    showgas: 1,
    showhdty: 1,
    showpres: 1,
    showalt: 1,
    showIAQ: 1,
    showPM25: 1,
    showPM10: 1,
    chartDataPM25: {
        labels: [],
        datasets: [
          {
            label: 'PM2.5 ()',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartDataPM10: {
        labels: [],
        datasets: [
          {
            label: 'PM10 ()',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartDatabme680temperature: {
        labels: [],
        datasets: [
          {
            label: 'Temperature (°C)',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartDatabme680gas: {
        labels: [],
        datasets: [
          {
            label: 'Gas (ohm)',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartDatabme680humidity: {
        labels: [],
        datasets: [
          {
            label: 'Humidity (%)',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartDatabme680pressure: {
        labels: [],
        datasets: [
          {
            label: 'Pressure (hPa)',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartDatabme680altitude: {
        labels: [],
        datasets: [
          {
            label: 'Altitude (meters)',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartDatabme680IAQ: {
        labels: [],
        datasets: [
          {
            label: 'IAQ',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartOptionsbme680altitude: {
      responsive: true,
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 9144,
            min: -1524
          }
        }]
      },*/
      animation: {
          duration: 0
      }
    },
    chartOptionsbme680pressure: {
      responsive: true,
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            min: 300,
            max: 1100
          }
        }]
      },*/
      animation: {
          duration: 0
      }
    },
    chartOptionsbme680humidity: {
      responsive: true,
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 100
          }
        }]
      },*/
      animation: {
          duration: 0
      }
    },
    chartOptionsbme680IAQ: {
      responsive: true,
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 500
          }
        }]
      },*/
      animation: {
          duration: 0
      }
    },
    chartOptionsbme680gas: {
      responsive: true,
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            max: 521177,
            min: 8371
          }
        }]
      },*/
      animation: {
          duration: 0
      }
    },
    chartOptionsbme680temperature: {
      responsive: true,
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            max: 85,
            min: -40
          }
        }]
      },*/
      animation: {
          duration: 0
      }
    },
    chartOptionsPM25: {
      responsive: true,
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            max: 85,
            min: -40
          }
        }]
      },*/
      animation: {
          duration: 0
      }
    },
    chartOptionsPM10: {
      responsive: true,
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            max: 85,
            min: -40
          }
        }]
      },*/
      animation: {
          duration: 0
      }
    },
    chartData3: {
        labels: [],
        datasets: [
          {
            label: 'Temperatura (°C)',
            borderColor: '#f87979',
            backgroundColor: 'transparent',
            data: []
          }, {
            label: 'Tlak (Hg)',
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'transparent',
            data: []
          }
        ]
      },
    chartOptions3: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            stepValue: 1, 
            max: 35,
            min: 15
          }
        }]
      },
      maintainAspectRatio: false,
      animation: {
          duration: 0
      }
    },
    chartOptions1: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    },
    chartData2: {
      labels: ['CO2', 'CO', 'NO2', 'NO'],
      datasets: [{
          label: 'ppm',
          data: [12, 19, 3, 5],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
      }]
    },
    chartOptions2: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            stepValue: 50, 
            max: 1000,
            min: 400
          }
        }]
      },
      maintainAspectRatio: false,
      animation: {
          duration: 0
      }
    }
  }),
  components: {
    //BarChart,
    LineChart
  },
  methods: {
    cleartemp () {
        this.chartDatabme680temperature.datasets[0].data = [];            
        this.chartDatabme680temperature.labels = [];
    },
    cleargas () {
        this.chartDatabme680gas.datasets[0].data = [];            
        this.chartDatabme680gas.labels = [];
    },
    clearpres () {
        this.chartDatabme680pressure.datasets[0].data = [];            
        this.chartDatabme680pressure.labels = [];
    },
    clearhdty () {
        this.chartDatabme680humidity.datasets[0].data = [];            
        this.chartDatabme680humidity.labels = [];
    },
    clearIAQ () {
        this.chartDatabme680IAQ.datasets[0].data = [];            
        this.chartDatabme680IAQ.labels = [];
    },
    clearalt () {
        this.chartDatabme680altitude.datasets[0].data = [];            
        this.chartDatabme680altitude.labels = [];
    },
    clearPM25 () {
        this.chartDataPM25.datasets[0].data = [];            
        this.chartDataPM25.labels = [];
    },
    clearPM10 () {
        this.chartDataPM10.datasets[0].data = [];            
        this.chartDataPM10.labels = [];
    },
    getmicroparticle() {
      axios.get('http://192.168.1.10:3000/microparticle/', {
      })
      .then((response) => {
        var y = response.data;
        y = y.substr(y.search('PM'));
        var x = y.split(" ");
        document.getElementById("microparticle").innerText = y;
        var d = new Date();

        this.chartDataPM25.datasets[0].data[this.chartDataPM25.datasets[0].data.length] = {x: this.time_elapsed, y: x[2]};            
        this.chartDataPM25.labels[this.chartDataPM25.labels.length] = d.toLocaleString();
        
        while (this.chartDataPM25.datasets[0].data.length > this.maxchartlen) {
          this.chartDataPM25.datasets[0].data.shift();
          this.chartDataPM25.labels.shift();
        }

        if (this.PM25 === 16) {
          this.PM25 = 17;
        } else {
          this.PM25 = 16;
        }

        this.chartDataPM10.datasets[0].data[this.chartDataPM10.datasets[0].data.length] = {x: this.time_elapsed, y: x[6]};            
        this.chartDataPM10.labels[this.chartDataPM10.labels.length] = d.toLocaleString();
        
        while (this.chartDataPM10.datasets[0].data.length > this.maxchartlen) {
          this.chartDataPM10.datasets[0].data.shift();
          this.chartDataPM10.labels.shift();
        }

        if (this.PM10 === 18) {
          this.PM10 = 19;
        } else {
          this.PM10 = 18;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    bme680() {
      axios.get('http://192.168.1.10:3000/bme680/', {
      })
      .then((response) => {
        var y = response.data;
        y = y.replace('\nT', 'T', y);
        document.getElementById("inputs").innerText = y;
        var x = response.data.split(" ");
        var d = new Date();
        this.chartDatabme680temperature.datasets[0].data[this.chartDatabme680temperature.datasets[0].data.length] = {x: this.time_elapsed, y: x[1]};            
        this.chartDatabme680temperature.labels[this.chartDatabme680temperature.labels.length] = d.toLocaleString();
        
        while (this.chartDatabme680temperature.datasets[0].data.length > this.maxchartlen) {
          this.chartDatabme680temperature.datasets[0].data.shift();
          this.chartDatabme680temperature.labels.shift();
        }

        if (this.bme680temperature === 4) {
          this.bme680temperature = 5;
        } else {
          this.bme680temperature = 4;
        }

        this.chartDatabme680gas.datasets[0].data[this.chartDatabme680gas.datasets[0].data.length] = {x: this.time_elapsed, y: x[3]};            
        this.chartDatabme680gas.labels[this.chartDatabme680gas.labels.length] = d.toLocaleString();
        
        while (this.chartDatabme680gas.datasets[0].data.length > this.maxchartlen) {
          this.chartDatabme680gas.datasets[0].data.shift();
          this.chartDatabme680gas.labels.shift();
        }

        if (this.bme680gas === 6) {
          this.bme680gas = 7;
        } else {
          this.bme680gas = 6;
        }

        this.chartDatabme680humidity.datasets[0].data[this.chartDatabme680humidity.datasets[0].data.length] = {x: this.time_elapsed, y: x[5]};            
        this.chartDatabme680humidity.labels[this.chartDatabme680humidity.labels.length] = d.toLocaleString();
        
        while (this.chartDatabme680humidity.datasets[0].data.length > this.maxchartlen) {
          this.chartDatabme680humidity.datasets[0].data.shift();
          this.chartDatabme680humidity.labels.shift();
        }

        if (this.bme680humidity === 8) {
          this.bme680humidity = 9;
        } else {
          this.bme680humidity = 8;
        }

        this.chartDatabme680pressure.datasets[0].data[this.chartDatabme680pressure.datasets[0].data.length] = {x: this.time_elapsed, y: x[7]};            
        this.chartDatabme680pressure.labels[this.chartDatabme680pressure.labels.length] = d.toLocaleString();
        
        while (this.chartDatabme680pressure.datasets[0].data.length > this.maxchartlen) {
          this.chartDatabme680pressure.datasets[0].data.shift();
          this.chartDatabme680pressure.labels.shift();
        }

        if (this.bme680pressure === 10) {
          this.bme680pressure = 11;
        } else {
          this.bme680pressure = 10;
        }

        this.chartDatabme680altitude.datasets[0].data[this.chartDatabme680altitude.datasets[0].data.length] = {x: this.time_elapsed, y: x[10]};            
        this.chartDatabme680altitude.labels[this.chartDatabme680altitude.labels.length] = d.toLocaleString();
        
        while (this.chartDatabme680altitude.datasets[0].data.length > this.maxchartlen) {
          this.chartDatabme680altitude.datasets[0].data.shift();
          this.chartDatabme680altitude.labels.shift();
        }

        if (this.bme680altitude === 12) {
          this.bme680altitude = 13;
        } else {
          this.bme680altitude = 12;
        }
        
        this.chartDatabme680IAQ.datasets[0].data[this.chartDatabme680IAQ.datasets[0].data.length] = {x: this.time_elapsed, y: x[12]};            
        this.chartDatabme680IAQ.labels[this.chartDatabme680IAQ.labels.length] = d.toLocaleString();
        
        while (this.chartDatabme680IAQ.datasets[0].data.length > 10) {
          this.chartDatabme680IAQ.datasets[0].data.shift();
          this.chartDatabme680IAQ.labels.shift();
        }

        var q = parseFloat(x[12]);
        
        for (let i = 1; i < IAQ.length; i++) {
          if (q >= IAQ[i]) {
            document.getElementById('air').innerText =  "IAQ: " + q + "\n"  + descr[i - 1] 
            + "\n(" + IAQ[i] + " - " + IAQ[i - 1] + ")";
            document.getElementById('air').style.color = c[i - 1];
            this.chartDatabme680IAQ.datasets[0].borderColor = c[i - 1];
            break;
          }
        }

        if (this.bme680IAQ === 14) {
          this.bme680IAQ = 15;
        } else {
          this.bme680IAQ = 14;
        }

        
      })
      .catch((error) => {
        console.log(error);
      });
    },
    killvideo() {
      axios.get('http://192.168.1.10:3000/killvideo/', {
      })
      .then(() => {
        
      })
      .catch((error) => {
        console.log(error);
      });
    },
    startvideo() {
      axios.get('http://192.168.1.10:3000/killvideo/', {
      })
      .then(() => {
        axios.get('http://192.168.1.10:3000/video/', {
        })
        .then(() => {
        })
        .catch((error) => {
          console.log(error);
        });
        window.location = 'http://192.168.1.10:5050';
      })
      .catch((error) => {
        console.log(error);
      });
    },
    video() {
      window.location = 'http://192.168.1.10:8081';
    },
    getanimage() {
      axios.get('http://192.168.1.10:3000/image/', {
      })
      .then(() => {
        
      })
      .catch((error) => {
        console.log(error);
      });
    },
    update (parameter) {
      axios.get('http://192.168.1.10:3000/sensors/' + parameter, {

      })
      .then((response) => {
        this.values[parameter] = parseInt(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    },
    reset () {
      axios.get('http://192.168.1.10:3000/delete/', {

      })
      .then(() => {
        
      })
      .catch((error) => {
        console.log(error);
      });
    },
    resetmicroparticle () {
      axios.get('http://192.168.1.10:3000/deletemicroparticle/', {

      })
      .then(() => {
        
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
  watch: {
    time_elapsed() {
      if (this.time_elapsed % this.updateinterval == 0) {
        this.bme680();
        this.getmicroparticle();
      }
    }
  }
}


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 25px;
}
.small {
  max-width: 500px;
  margin: 25px auto;
}
.mybutton {
  margin: 25px;
}
</style>
