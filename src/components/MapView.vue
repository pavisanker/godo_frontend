<template>
  <div id="map" style="width: 100%; height: 100%; border-radius: 10px;"></div>
</template>

<script>
import axios from 'axios'
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
      routeControl: null,
      distanceLabel: null,
      startLat: '',
      startLng: '',
      endLat: '',
      endLng: '',
      startAndEnd: [],
      counter:0,
      places: [],
      loading: false,
      selectedWayPoints: [],
      straightDistance: ''



    }
  },
  async mounted() {
    this.initMap()
    // await this.showRoute()
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView(
        [this.center.lat, this.center.lng],
        this.zoom || 10
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map)
    },

    // Proxy geocode call (you must implement this on your backend)
    async geocode(place) {
      try {
        const res = await fetch(`${this.$store.getters.getUrl}/api/godo/geocode?place=${encodeURIComponent(place)}`)
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        if (!data.length) throw new Error(`No results for ${place}`)
        
        if(this.counter<4){
          this.startAndEnd[this.counter] = parseFloat(data[0].lat)
        console.log(this.startAndEnd[this.counter]);
          this.counter++;
          this.startAndEnd[this.counter] = parseFloat(data[0].lon)
        console.log(this.startAndEnd[this.counter]);
          this.counter++;
        }
        else{
          console.log('counter error');
        }
        
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      } catch (err) {
        console.error('Geocode error:', err.message)
        return null
      }
    },
    async fetchRoutePlaces() {
      this.loading = true;

      try {
        const res = await axios.get(`${this.$store.getters.getUrl}/api/godo/route-places`, {
          params: {
            startLat: this.startAndEnd[0],
            startLng: this.startAndEnd[1],
            endLat: this.startAndEnd[2],
            endLng: this.startAndEnd[3]
          }
        });
        this.places = res.data;        
        this.selectedWaypoints = [...res.data]; // select all by default
          this.$emit('wayPoints', this.places)

      } catch (err) {
        console.log('Failed to fetch route places.');
      } finally {
        this.loading = false;
      }
    },

    async showRoute() {
      const from = await this.geocode(this.startingPoint)
      const to = await this.geocode(this.destination)

      if (!from || !to) {
        alert('Invalid location(s) or Check Internet Connection')
        return
      }
      this.counter = 0;
      this.fetchRoutePlaces();
        console.log(this.places);
       
          this.straightDistance = this.haversineDistance(from, to)       
        
          this.$emit('distance-calculated', this.straightDistance)
      
      // console.log('Straight-line distance:', straightDistance + ' km')



      if (this.routeControl) {
        this.map.removeControl(this.routeControl)
      }

      this.routeControl = L.Routing.control({
        waypoints: [L.latLng(...from), L.latLng(...to)],
        createMarker: () => null,
        routeWhileDragging: true,
        show: false
      }).addTo(this.map)

      // this.routeControl.on('routesfound', (e) => {
        // const route = e.routes[0]
        // const distanceKm = (route.summary.totalDistance / 1000).toFixed(2)

        // const midLat = (from[0] + to[0]) / 2
        // const midLon = (from[1] + to[1]) / 2

        // if (this.distanceLabel) {
        //   this.map.removeLayer(this.distanceLabel)
        // }

        // this.distanceLabel = L.marker([midLat, midLon], {
        //   icon: L.divIcon({
        //     className: 'distance-label',
        //     html: `<div style="background: white; padding: 4px 8px; border-radius: 4px; border: 1px solid #999; font-size: 14px;">
        //       Distance: ${distanceKm},${this.straightDistance} km
        //     </div>`
        //   })
        // }).addTo(this.map)
      // })

      this.map.fitBounds(L.latLngBounds([
        L.latLng(...from),
        L.latLng(...to)
      ]))
    },
    haversineDistance(coord1, coord2) {
    const R = 6371; // Earth radius in km
    const toRad = deg => deg * Math.PI / 180;

    const dLat = toRad(coord2[0] - coord1[0]);
    const dLon = toRad(coord2[1] - coord1[1]);
    const lat1 = toRad(coord1[0]);
    const lat2 = toRad(coord2[0]);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // returns distance in km
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
