<template>
  <v-container
    class="d-flex flex-column align-center justify-center"
    style="min-height: 100vh;"
  >
    <v-card max-width="500" class="pa-6" outlined>
      <v-card-title class="headline text-center">Pay for Your Ride</v-card-title>

      <v-form @submit.prevent="makePayment" ref="paymentForm" v-model="valid">
        <v-text-field
          v-model="form.customerId"
          label="Customer ID"
          :rules="[v => !!v || 'Customer ID is required']"
          required
          dense
          outlined
          :readonly="form.customerId"
        />
        <v-text-field
          v-model="form.ownerId"
          label="Owner ID"
          :rules="[v => !!v || 'Owner ID is required']"
          required
          dense
          outlined
          :readonly="form.ownerId"
        />
        <v-text-field
          v-model="form.routeId"
          label="Route ID"
          :rules="[v => !!v || 'Route ID is required']"
          required
          dense
          outlined
          :readonly="form.routeId"

        />
        <v-text-field
          v-model="form.bookingId"
          label="Booking ID"
          :rules="[v => !!v || 'Booking ID is required']"
          required
          dense
          outlined
          :readonly="form.bookingId"

        />
        <v-text-field
          v-model.number="form.amount"
          label="Amount (INR)"
          :rules="[
            v => !!v || 'Amount is required',
            v => (v > 0) || 'Amount must be greater than zero',
          ]"
          type="number"
          min="1"
          required
          dense
          outlined
          :readonly="form.amount"

        />

        <v-btn
          :disabled="!valid || loading"
          type="submit"
          color="primary"
          class="mt-4"
          block
          elevation="2"
        >
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="20"
            color="white"
            class="mr-2"
          ></v-progress-circular>
          Pay Now
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
/* global Razorpay */
import axios from "axios";

export default {
  name: "PaymentPage",
  data() {
    return {
      valid: false,
      loading: false,
      form: {
        customerId: this.$route.query.customerId || "",
        ownerId: this.$route.query.ownerId || "",
        routeId: this.$route.query.routeId || "",
        bookingId: this.$route.query.bookingId || "",
        amount: Number(this.$route.query.amount) || 0,
      },
    };
  },
  mounted() {
    // Dynamically load Razorpay script if not loaded
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  },
  methods: {
    async makePayment() {
      const formIsValid = await this.$refs.paymentForm.validate();
      if (!formIsValid) return;

      this.loading = true;
      try {
        // Create order on backend
        const response = await axios.post(
          "http://localhost:8080/api/godo/payment/create-order",
          this.form
        );

        const orderData = response.data;

        this.openRazorpay(orderData);
      } catch (err) {
        console.error("Order creation failed", err);
        alert("Failed to create payment order. Please try again.");
        this.loading = false;
      }
    },

    openRazorpay(orderData) {
      const options = {
        key: "rzp_test_fA47hwvl6ctOq8", // Your Razorpay test key
        amount: orderData.amount, // amount in paise
        currency: orderData.currency,
        name: "GoDo Booking",
        description: "Ride Payment",
        image: "/logo.png",
        order_id: orderData.id,
        handler: async (response) => {
  console.log('Payment successful', response);

  try {
    const payload = {
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
    };


    await axios.post(
      "http://localhost:8080/api/godo/payment/verify",
      payload  // ✅ send payload directly, not wrapped in another object
    );

    this.$router.push('/ride');
  } catch (err) {
    console.error("Verification failed", err);
  }
},

        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          bookingId: this.form.bookingId,
        },
        theme: {
          color: "#1976D2",
        },
        modal: {
          ondismiss: () => {
            this.loading = false;
          },
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    },
  },
};
</script>

<style scoped>
.v-application {
  background-color: #f5f5f5 !important;
}
</style>
