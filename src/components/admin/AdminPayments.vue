<template>
    <div>
      <h2>GoDo Payments</h2>

      <v-container>
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">Payment Details</v-card-title>
        <v-divider class="mb-2"></v-divider>

        <v-table dense>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Travel ID</th>
              <th>Booking ID</th>
              <th>Amount (₹)</th>
              <th>Payment ID</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, index) in paymentHistory" :key="payment.id">
              <td>{{ index + 1 }}</td>
              <td>{{ payment.routeId }}</td>
              <td>{{ payment.bookingId }}</td>
              <td>
                <v-icon left small>mdi-currency-inr</v-icon>
                {{ payment.amount }}
              </td>
              <td>{{ payment.paymentId }}</td>
              <td>
                <v-chip :color="payment.status === 'SUCCESS' ? 'green' : 'red'" dark>
                  {{ payment.status }}
                </v-chip>
              </td>
              <td>{{ formatDate(payment.paymentDate) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminPaymentHistory",
  data() {
    return {
      paymentHistory: [],
    };
  },
  async mounted() {
    await this.fetchPaymentHistory();
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    },
    async fetchPaymentHistory() {
      try {
        const response = await axios.get(
          `${this.$store.getters.getUrl}/api/godo/payment/history`
        );
        this.paymentHistory = response.data;
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    },
  },
};
</script>
  