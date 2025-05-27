<template>
    <div>
      <h2>Drives Management</h2>

      <v-container>
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">Details</v-card-title>
        <v-divider></v-divider>

        <v-table dense>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>RouteId</th>
              <th>UserId</th>
              <th>VehicleId</th>
              <th>Phone</th>
              <th>StartingPoint</th>
              <th>Destination</th>
              <th>Booked</th>
              <th>BoardingTime</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(drive, index) in drives" :key="drive.routeId">
              <td>{{ index + 1 }}</td>
              <td>{{ drive.routeId }}</td>
              <td>{{ drive.userId }}</td>
              <td>{{ drive.vehicleId }}</td>
              <td>{{ drive.phoneNumber }}</td>
              <td>{{ drive.start }}</td>
              <td>{{ drive.destination }}</td>
              <td>{{ drive.booked }}</td>
              <td>{{ drive.boardingTime }}</td>
                    
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
      drives: [],
    };
  },
  async mounted() {
    await this.fetchDrives();
  },
  methods: {
    async fetchDrives() {
      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/admin/getDrives`);
        this.drives = response.data.map(drive => ({
          ...drive,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
  }
};
</script>
  