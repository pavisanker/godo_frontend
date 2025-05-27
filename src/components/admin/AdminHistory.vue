<template>
    <div>
      <h2>History Management</h2>

      <v-container>
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">Details</v-card-title>
        <v-divider></v-divider>

        <v-table dense>
          <thead>
            <tr>
            <th>Sl No.</th>
            <th>Start</th>
            <th>Destination</th>
            <th>Boarding Time</th>
            <th>Delivery</th>
            <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(history, index) in userHistory" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ history.start }}</td>
            <td>{{ history.destination }}</td>
            <td>{{ formatDate(history.boardingTime) }}</td>
            <td>
            <v-icon v-if="history.deliveryCustomerId" color="green">mdi-check</v-icon>
            <span v-else>Nil</span>
          </td>
            <td>
              <v-chip color="gray" dark>Completed</v-chip>
            </td>
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
    name: "AdminHistory",
    data() {
      
      return {

          history: [],
          userHistory: [],
  
        };
      },
    async mounted() {
      await this.fetchUserHistory();
    
    },
    methods: {
      
    formatDate(date) {
      return new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true // Use 24-hour format
      });
    },
   
        async fetchUserHistory() {
        try {
            const response = await axios.get(`${this.$store.getters.getUrl}/api/admin/getHistory`);
            this.userHistory = response.data;
        } catch (error) {
            console.error("Error fetching ride history:", error);
        }
        },
    },
};
  </script>
  