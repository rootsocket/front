<template>
  <canvas id="lineChart"></canvas>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineController,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  LineController,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement
)
export default Vue.extend({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    labels: {
      type: Array,
      default: () => [],
    },
  },
  data(): { chart: ChartJS | undefined } {
    return {
      chart: undefined,
    }
  },
  watch: {
    data() {
      this.updateChart()
    },
    labels() {
      this.updateChart()
    },
  },
  mounted() {
    this.chart = new ChartJS(
      document.getElementById('lineChart') as any,
      this.getConfig() as any
    )
  },
  beforeDestroy() {
    document.getElementById('lineChart')?.remove()
  },
  methods: {
    updateChart() {
      const chart = this.chart as any
      chart.data.labels = this.labels
      chart.data.datasets.forEach((dataset: any) => {
        dataset.data = this.data
      })
      chart.update()
    },
    getDataset() {
      return {
        labels: this.labels,
        datasets: [
          {
            borderColor: '#007fff',
            data: this.data,
            lineTension: 0.42,
            fill: true,
          },
        ],
      }
    },
    getConfig() {
      return {
        type: 'line',
        data: this.getDataset(),
        fill: true,
        options: {
          elements: {
            point: {
              pointBorderWidth: 0,
              pointRadius: 0,
            },
          },
          layout: {
            padding: {
              top: 10,
            },
          },
          plugins: {
            tooltip: {
              displayColors: false,
              mode: 'nearest',
              axis: 'x',
              intersect: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          borderWidth: 2,
          scales: {
            x: {
              display: false,
              //   grid: {
              //     display: false,
              //   },
            },
            y: {
              display: false,
              beginAtZero: true,
              min: 0,
            },
          },
        },
      }
    },
  },
})
</script>
