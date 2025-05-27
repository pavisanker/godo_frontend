<template>
  <div id="map" style="width: 100%; height: 100%; border-radius: 10px;"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'MapView',
  props: {
    startingPoint: String,
    destination: String,
    center: Object,
    zoom: Number
  },
  data() {
    return {
      map: null,
      routeControl: null
    }
  },
  mounted() {
    this.map = L.map('map').setView(
      [this.center.lat, this.center.lng],
      this.zoom || 10
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map)
  },
  methods: {
    async geocode(place) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      )
      const data = await res.json()
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      }
      return null
    },
    async showRoute() {
      const from = await this.geocode(this.startingPoint)
      const to = await this.geocode(this.destination)

      if (!from || !to) {
        alert('Invalid location(s)')
        return
      }

      if (this.routeControl) {
        this.map.removeControl(this.routeControl)
      }

      this.routeControl = L.Routing.control({
        waypoints: [L.latLng(...from), L.latLng(...to)],
        createMarker: () => null,
        routeWhileDragging: false,
        show: false
      }).addTo(this.map)

      this.map.fitBounds(L.latLngBounds([from, to]))
    }
  }
}
</script>

<style scoped>
#map {
  height: 500px;
  width: 100%;
}
</style>
