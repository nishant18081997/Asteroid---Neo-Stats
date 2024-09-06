<script setup>
import { ref, defineProps, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

// Register the required components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale
)

// Data and options for the Bar Chart
const props = defineProps({
  barData: {
    required: true,
    type: Array
  },
  labels: {
    required: true,
    type: Array
  }
})
watch(
  () => props.barData,
  (newBarData) => {
    barChartData.value.datasets = newBarData
  }
)

watch(
  () => props.labels,
  (newLabels) => {
    barChartData.value.labels = newLabels
  }
)
const barChartData = ref({
  labels: props.labels,
  datasets: props.barData
})

// Data and options for the Line Chart

// Data and options for the Pie Chart

// Common options for all charts
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return context.dataset.label + ': ' + context.raw
        }
      }
    }
  }
})
</script>

<template>
  <div>
    <h2>Bar Chart</h2>

    <Bar :data="barChartData" :options="chartOptions" />
  </div>
</template>
