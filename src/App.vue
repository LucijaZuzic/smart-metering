<template>
  <div id="app">
    <div class="small">
      <bar-chart :chartData="chartData1" :options="chartOptions1"></bar-chart>
      <bar-chart :key="myvar2" :chartData="chartData2" :options="chartOptions2"></bar-chart>
      <line-chart :key="myvar" :chartData="chartData3" :options="chartOptions3"></line-chart>
    </div>
  </div>
</template>

<script>

import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue'
import axios from 'axios'

export default {
  name: 'App',
  mounted() {    
    this.time_elapsed = setInterval(() => (this.time_elapsed += 1), 1000);
  },
  data: () => ({
    time_elapsed: 0,
    myvar: 0,
    myvar2: 2,
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
    chartData1: {
      labels: ['January', 'February'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [40, 20]
        },
        {
          label: 'Data Two',
          backgroundColor: 'rgba(255, 99, 132, 1)',
          data: [30, 20]
        }
      ]
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
      labels: ['CO2', 'CO', 'NO2', 'NO', 'Purple', 'Orange'],
      datasets: [{
          label: 'ppm',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
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
    BarChart,
    LineChart
  },
  methods: {
    changeonetime () {
      this.getvalue(25, 35); 
      if (this.time_elapsed % 2 == 0) {
        this.getvalue2(700, 900);
      }
    },
    getRandomInt (maxi, mini) {
      return Math.floor(Math.random() * (maxi - mini + 1)) + mini
    },
    getvalue(ymaximum, yminimum) {
      axios.post('http://localhost/smart-metering/src/getvalue.php', {
        mini: ymaximum,
        maxi: yminimum
      })
      .then((y1) => {
        axios.post('http://localhost/smart-metering/src/getvalue.php', {
          mini: ymaximum,
          maxi: yminimum
        })
        .then((y2) => {
          this.chartData3.datasets[0].data[this.chartData3.datasets[0].data.length] = {x: this.time_elapsed, y: y1.data};            
          this.chartData3.datasets[1].data[this.chartData3.datasets[1].data.length] = {x: this.time_elapsed, y: y2.data};      
          this.chartData3.labels[this.chartData3.labels.length] = this.time_elapsed;
          while (this.chartData3.datasets[0].data.length > 10) {
            this.chartData3.datasets[0].data.shift();
            this.chartData3.datasets[1].data.shift();
            this.chartData3.labels.shift();
          }
          if (this.myvar === 0) {
            this.myvar = 1;
          } else {
            this.myvar = 0;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      })
      .catch((error) => {
        console.log(error);
      });
    },
    getvalue2(ymaximum, yminimum) {
      axios.post('http://localhost/smart-metering/src/GETA.php', {
        mini: ymaximum,
        maxi: yminimum,
        num: 6
      })
      .then((y1) => {
        this.chartData2.datasets[0].data = y1.data; 
        if (this.myvar2 === 2) {
          this.myvar2 = 3;
        } else {
          this.myvar2 = 2;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
  watch: {
    time_elapsed() {
      this.changeonetime();
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
  margin-top: 60px;
}
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>
