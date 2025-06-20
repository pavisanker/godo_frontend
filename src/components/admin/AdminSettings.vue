<template>
  <v-container class="mt-8" max-width="400">
    <v-card class="pa-4">
      <v-card-title class="text-h6 font-weight-bold">👤 Admin Profile</v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-title>Username: <strong>{{ username }}</strong></v-list-item-title>
        </v-list-item>
        <v-btn color="primary" class="mt-4" block @click="logout">
          🔒 Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "AdminSettings",
  data() {
    return {
      username: "admin", // Hardcoded or fetched from login/session
    };
  },
  methods: {
    logout() {
      // Clear session, redirect, etc.
      alert("Logging out...");
      this.$router.push("/"); // Adjust route accordingly
    },
  },
};
</script>
