<script setup>
import { ref } from 'vue'
import moment from 'moment'
import Chart from './components/Chart.vue'
const responseData = ref([])
const startDate = ref('')
const endDate = ref('')
const form = ref(null)
const selectStartDate = ref()
const selectEndDate = ref()
const openDatePicker = ref(false)
const openEndDatePicker = ref(false)
const labels = ref([])
const barData = ref([])
const maxVelocity = ref(-Infinity)
const maxVelocityId = ref(null)

const totalSize = ref(0)
const count = ref(0)
const minDistance = ref(Infinity)
const minDistanceId = ref(null)
const avgSize = ref(0)

const fetchData = async () => {
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate.value}&end_date=${endDate.value}&api_key=DEMO_KEY`

  const myRequest = new Request(url, {
    method: 'GET'
  })

  const response = await fetch(myRequest)
  const Json = await response.json()
  responseData.value = Json
  calulateMaxandAverage(Json.near_earth_objects)
}
const formatDate = (val) => {
  openDatePicker.value = false
  startDate.value = moment(val).format('YYYY-MM-DD')
}
const formatEndDate = (val) => {
  openEndDatePicker.value = false
  endDate.value = moment(val).format('YYYY-MM-DD')
}
const onSumbit = async () => {
  const { valid } = await form.value.validate()

  if (valid) {
    fetchData()
  }
}

const calulateMaxandAverage = (data) => {
  let barArr = []
  for (const date in data) {
    labels.value.push(date)
    let barcount = 0

    data[date].forEach((asteroid) => {
      barcount++
      // (Find max relative velocity and  id
      asteroid.close_approach_data.forEach((approach) => {
        const velocity = approach.relative_velocity.kilometers_per_hour
        if (velocity > maxVelocity.value) {
          maxVelocity.value = velocity
          maxVelocityId.value = asteroid.id
        }

        //  Find min miss distance id
        const distance = approach.miss_distance.kilometers
        if (distance < minDistance.value) {
          minDistance.value = distance
          minDistanceId.value = asteroid.id
        }
      })

      //  Calculate total size for average
      const size = asteroid.estimated_diameter.kilometers.estimated_diameter_max
      totalSize.value += size
      count.value++
    })
    barArr.push(barcount)
  }
  barData.value.push({
    label: 'Line Dataset',
    backgroundColor: '#42A5F5',
    data: barArr
  })
  avgSize.value = totalSize.value / count.value
}
const currentDate = moment().format('YYYY-MM-DD')
</script>

<template>
  <v-row>
    <v-col v-if="maxVelocityId"> </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <v-form ref="form">
        <v-row class="d-flex">
          <v-col cols="12">
            <v-menu :close-on-content-click="false" v-model="openDatePicker" style="width: 100%">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  v-model="startDate"
                  readonly
                  label="Start date"
                  append-inner-icon="mdi-calendar"
                  class="mx-1"
                  :rules="[(v) => !!v || 'The  Start date is required']"
                  required
                >
                </v-text-field>
              </template>
              <span>
                <v-date-picker
                  v-model="selectStartDate"
                  @update:modelValue="formatDate(selectStartDate)"
                  title=""
                  :max="currentDate"
                >
                </v-date-picker>
              </span>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-menu :close-on-content-click="false" v-model="openEndDatePicker" style="width: 100%">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  v-model="endDate"
                  readonly
                  label="end date"
                  append-inner-icon="mdi-calendar"
                  class="mx-1"
                  required
                  :rules="[(v) => !!v || 'The  End date is required']"
                >
                </v-text-field>
              </template>
              <span>
                <v-date-picker
                  v-model="selectEndDate"
                  @update:modelValue="formatEndDate(selectEndDate)"
                  title=""
                  :min="selectStartDate"
                  :max="currentDate"
                >
                </v-date-picker>
              </span>
            </v-menu>
          </v-col>
        </v-row>
        <v-btn @click="onSumbit">Submit</v-btn>
      </v-form>
    </v-col>
    <v-col cols="6">
      <span v-if="barData.length">
        Fastest Asteroid in km/h: {{ maxVelocity }} and id :{{ maxVelocityId }}
        <br />
        Closest Asteroid :
        {{ minDistance }} and id :{{ minDistanceId }}
        <br />
        Average Size :{{ avgSize }} <br />
        <Chart :labels="labels" :barData="barData" />
      </span>
    </v-col>
  </v-row>
</template>
