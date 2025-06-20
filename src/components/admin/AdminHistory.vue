<template>
    <div>
      <h2>GoDo History</h2>

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
            <th>Travel ID</th>
            <th>Amount</th>
            <th>Payment ID</th>
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
            <td>{{ history.travelId }}</td>
            <td>
                <v-icon left small>mdi-currency-inr</v-icon>
              {{ history.amount/100 }}</td>
            <td>{{ history.paymentId }}</td>
            <td>
            <v-chip :color="history.status === 4 ? 'green' : history.status === 3 ? 'red' : history.status === 2 ? 'blue' : history.status === 1 ? 'grey' : 'black'" dark>
              {{ history.status === 4 ? 'Success' : history.status === 3 ? 'Failed' : history.status === 2 ? 'Processing' : history.status === 1 ? 'Pending' : 'Unknown' }}
            </v-chip>
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
  