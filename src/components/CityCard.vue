
<template>
  <div v-for="city in savedCities" :key="city.id" >
    <div class="p-4 position-relative border rounded shadow bg-white m-4">
      <div class="position-absolute">
        <button
            v-if="city.name !== 'Amsterdam'"
            class="text-bg-danger icon-link-hover font-bold text-lg"
            @click="handleRemove(city.id)"
            aria-label="Remove city"
        >
          ✕
        </button>
      </div>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold">{{city.name}}</h2>
        <h2 class="text-xl font-bold">{{city.state}}</h2>
        <h3 class="text-sm text-gray-500">Today's Weather</h3>
      </div>
      <div class="flex flex-col">
        <div class="row align-items-center">
          <div class="col" v-for="todayWeather in city.weatherToday" :key="todayWeather.dt_txt">
            <img
                class="w-auto h-[50px] object-cover"
                :src="`http://openweathermap.org/img/wn/${todayWeather.icon}@2x.png`"
                alt="weather icon"
            />
            <p>
              {{todayWeather.dt_txt.slice(11, 16) }}
            </p>
            <p class="text-3xl self-end">
              {{ Math.round(todayWeather.temp) }}&deg;
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col">
        <h3 class="text-sm text-gray-500">Tomorrow's Weather</h3>
      </div>
      <div class="row">
        <div class="col" v-for="tomorrowWeather in city.weatherTomorrow" :key="tomorrowWeather.dt_txt">
            <img
                class="w-auto h-[100px] object-cover"
                :src="`http://openweathermap.org/img/wn/${tomorrowWeather.icon}@2x.png`"
                alt="weather icon"
            />
            <p class="text-3xl font-semibold">
              {{ Math.round(tomorrowWeather.temp) }}&deg;
            </p>
            <div>
              {{tomorrowWeather.dt_txt.slice(11, 16)}}
            </div>
          </div>
      </div>
    </div>

    <p v-if="savedCities.length === 0">
      No locations added. To start tracking a location, search in
      the field above.
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: 'remove-city', id: string): void;
}>();

function handleRemove(id: string) {
  emit('remove-city', id)
}
// defineEmits(["remove-city"]);

defineProps({
  savedCities: {
    type: Array,
    default: () => {},
  },
});
</script>