<template>
    <div>
      <h2>Admin Dashboard</h2>
    </div>

    <v-container>
    <v-row justify="space-around" align="center">
      <v-col cols="12" md="4">
        <v-card class="info-card user-card" elevation="10" @click="toAdminUsers">
          <v-card-title class="d-flex align-center">
            <v-icon size="40" class="mr-3" color="#64b5f6">mdi-account-group</v-icon>
            <span class="card-title">Total Users</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <h2 class="count">{{ userCount }}</h2>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="info-card vehicle-card" elevation="10" @click="toAdminVehicles">
          <v-card-title class="d-flex align-center">
            <v-icon size="40" class="mr-3" color="#81c784">mdi-car</v-icon>
            <span class="card-title">Total Vehicles</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <h2 class="count">{{ vehicleCount }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <br>
    <br>
    <br>
    <br>

    <v-row justify="space-around" align="center">
      <v-col cols="12" md="4">
        <v-card class="info-card drive-card" elevation="10" @click="toAdminDrives">
          <v-card-title class="d-flex align-center">
            <v-icon size="40" class="mr-3" color="#c54a4a">mdi-map-marker-path</v-icon>
            <span class="card-title">Total Drives</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <h2 class="count">{{ driveCount }}</h2>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="info-card booking-card" elevation="10" @click="toAdminBookings">
          <v-card-title class="d-flex align-center">
            <v-icon size="40" class="mr-3" color="#8b59c8">mdi-calendar-check</v-icon>
            <span class="card-title">Total Bookings</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <h2 class="count">{{ bookingCount }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    
  </v-container>
  </template>
  
  <script>
import axios from 'axios';

  export default {
    name: "AdminDashboard",
    data() {
    return {
      userCount: 0,
      vehicleCount: 0,
      bookingCount: 0,
      driveCount: 0,
    };
  },
  async mounted() {
    this.fetchCounts();
  },
  methods: {
    async fetchCounts() {
      try {
        // Fetch total users
        const userResponse = await axios.get(`${this.$store.getters.getUrl}/api/admin/getUserCount`);
        this.userCount = userResponse.data.count;

        // Fetch total vehicles
        const vehicleResponse = await axios.get(`${this.$store.getters.getUrl}/api/admin/getVehicleCount`);
        this.vehicleCount = vehicleResponse.data.count;

        // const bookingResponse = await axios.get(`${this.$store.getters.getUrl}/api/admin/getBookingCount`);
        // this.bookingCount = bookingResponse.data.count;

        const driveResponse = await axios.get(`${this.$store.getters.getUrl}/api/admin/getDriveCount`);
        this.driveCount = driveResponse.data.count;

      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    },
    toAdminVehicles(){
      this.$router.push(`/admin/vehicles`);
    },
    toAdminUsers(){
      this.$router.push(`/admin/users`);
    },
    toAdminDrives(){
      this.$router.push(`/admin/drives`);
    },
    toAdminBookings(){
      this.$router.push(`/admin/bookings`);
    },
  },
};
</script>

<style scoped>
.info-card {
  border-radius: 12px;
  color: white;
  padding: 20px;
  text-align: center;
}

.user-card {
  background: linear-gradient(135deg, #324247, #64b5f6);
}

.vehicle-card {
  background: linear-gradient(135deg, #324247, #81c784);
}
.drive-card {
  background: linear-gradient(135deg, #324247, #c54a4a);
}
.booking-card {
  background: linear-gradient(135deg, #324247, #8b59c8);
}

.card-title {
  font-size: 20px;
  font-weight: bold;
}

.count {
  font-size: 40px;
  font-weight: bold;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
  