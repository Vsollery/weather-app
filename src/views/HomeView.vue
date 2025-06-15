<template>
  <main class="container p-4">
      <form class="d-flex" role="search">
        <input
            type = "text"
            v-model = "searchQuery"
            @input = getSearchResult
            class="form-control me-2"
            placeholder="Search for a City"
        >
      </form>

      <ul v-if="searchResults" class="absolute bg-opacity-100 bg-dark-subtle w-full shadow-md py-2 px-1 top-[66px]" style="list-style-type: none">
        <p class="py-2" v-if="searchError">
          Sorry, something went wrong, please try again.
        </p>
        <p
            class="py-2"
            v-if="!searchError && searchResults.length === 0"
        >
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
              v-for="result in searchResults"
              class="py-2 cursor-pointer"
              :key="result.id"
          >
            {{ result.name }}, {{ result.state ?? '' }} {{ result.country }}
            <button class="btn btn-sm btn-primary ms-2" @click="addCity(result)">+</button>
          </li>
        </template>
      </ul>


      <div class="my-4">
        <button class="btn btn-outline-primary" @click="toggleUnit">
          Switch to {{ unit === 'metric' ? 'Fahrenheit (°F)' : 'Celsius (°C)' }}
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <Suspense>
         <CityCard :savedCities="storedCities" @remove-city="removeCity"/>
          <template #fallback>
            <div>
              loading
            </div>
          </template>
        </Suspense>
      </div>
  </main>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getCityCoordinates, getWeatherData} from "@/services/weatherApi";
import CityCard from "../components/CityCard.vue";
// import {CityCoordinate} from "@/types/cityCoordinates";
import {WeatherResponse} from "@/types/weatherResponse";
import {WeatherRequest} from "@/types/weatherRequest";
import {City} from "@/types/city";

const searchQuery = ref<any>("");
const searchResults = ref<any>(null);
const searchError = ref<boolean>();
const debounceTime = ref<number | undefined>();
const unit = ref("metric");

const getSearchResult = () => {
  clearTimeout(debounceTime.value);

  debounceTime.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await getCityCoordinates(searchQuery.value);
        console.log(result);
        searchResults.value = result;
      } catch (error) {
        console.error(error);
        searchError.value = true;
      }
      return;
    }
    searchResults.value = null;
  }, 300);
};

const savedCities = ref<City[]>([]);
const addCity = (city:  City) => {
  const stored = localStorage.getItem("savedCities");
  if(stored){
    savedCities.value = JSON.parse(stored) as City[];
  }
  savedCities.value.push(city);
  localStorage.setItem(
      "savedCities",
      JSON.stringify(savedCities.value)
  );

  getCities()
}

const storedCities = ref<WeatherResponse[]>([])
const getCities = async () => {
  if(localStorage.getItem("savedCities")) {
    const stored = localStorage.getItem("savedCities");
    const cities = JSON.parse(stored) as WeatherRequest[];

    const requests = cities.map(city =>
        getWeatherData({
          lat: city.lat,
          lon: city.lon,
          units: unit.value,
        })
    );

    const weatherData = await Promise.all(requests);
    console.log(weatherData);

    storedCities.value = cities.map((city, index) => ({
      ...city,
      weatherToday: weatherData[index].weatherToday,
      weatherTomorrow: weatherData[index].weatherTomorrow,
    }));

    console.log(storedCities.value);
  }
}

const removeCity = (id: string) => {
  const cities= JSON.parse(localStorage.getItem("savedCities"));
  const updatedCities = cities.filter((city: City) => city.id !== id);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));

  getCities()
}

const toggleUnit = async () => {
  unit.value = unit.value === "metric" ? "imperial" : "metric";
  await getCities();
};

const getDefaultWeather = async () => {
  const defaultCity: City = {
    country: "Netherlands",
    name: 'Amsterdam',
    lat: 52.3676,
    lon: 52.3676
  };

  savedCities.value.push(defaultCity);
  localStorage.setItem(
      "savedCities",
      JSON.stringify(savedCities.value)
  );
};


onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("savedCities") || "[]");
  if (saved.length === 0) {
    getDefaultWeather();
  }
  getCities();
});

</script>
