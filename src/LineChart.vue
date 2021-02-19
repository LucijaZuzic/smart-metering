
<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
