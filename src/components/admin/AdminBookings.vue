<template>
    <div>
      <h2>Bookings Management</h2>

      <v-container>
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">Details</v-card-title>
        <v-divider></v-divider>

        <v-table dense>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Booking ID</th>
              <th>UserId</th>
              <th>Phone</th>
              <th>StartingPoint</th>
              <th>Destination</th>
              <th>Passenger Count</th>
              <th>BoardingTime</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ride, index) in rides" :key="ride.routeId">
              <td>{{ index + 1 }}</td>
              <td>{{ ride.bookingId }}</td>
              <td>{{ ride.userId }}</td>
              <td>{{ ride.phoneNumber }}</td>
              <td>{{ ride.start }}</td>
              <td>{{ ride.destination }}</td>
              <td>{{ ride.passengerCount }}</td>
              <td>{{ ride.boardingTime }}</td>
                    
            </tr>
          </tbody>
        </v-table>
      </v-card>

    </v-container>
    </div>
  </template>
  
  <script>
import axios from 'axios';

  export default {
    name: "AdminDrives",
    data() {
    return {
      rides: [],
    };
  },
  async mounted() {
    await this.fetchDrives();
  },
  methods: {
    async fetchDrives() {
      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/admin/getRides`);
        this.rides = response.data.map(ride => ({
          ...ride,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
  }
};
</script>
  