<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <v-navigation-drawer app expand-on-hover rail class="text-white vh-100" color="#324247">
      <div class="d-flex justify-space-between align-center pa-4 sidebar-header">
        <h4 class="sidebar-content white--text font-weight-bold">Admin Panel</h4>
        <v-icon class="hidden-icon white--text">mdi-dots-horizontal</v-icon>
      </div>

      <v-list dense nav>
        <v-list-item to="/admin/dashboard">
          <v-icon>mdi-view-dashboard</v-icon>
          <v-list-item-content class="sidebar-content">Dashboard</v-list-item-content>
        </v-list-item>

        <v-list-item to="/admin/users">
          <v-icon>mdi-account-group</v-icon>
          <v-list-item-content class="sidebar-content">Users</v-list-item-content>
        </v-list-item>

        <v-list-item to="/admin/vehicles">
          <v-icon>mdi-car</v-icon>
          <v-list-item-content class="sidebar-content">Vehicles</v-list-item-content>
        </v-list-item>

        <v-list-item to="/admin/drives">
          <v-icon>mdi-map-marker-path</v-icon>
          <v-list-item-content class="sidebar-content">Drives</v-list-item-content>
        </v-list-item>

        <v-list-item to="/admin/bookings">
          <v-icon>mdi-calendar-check</v-icon>
          <v-list-item-content class="sidebar-content">Bookings</v-list-item-content>
        </v-list-item>

        <v-list-item to="/admin/history">
          <v-icon>mdi-history</v-icon>
          <v-list-item-content class="sidebar-content">History</v-list-item-content>
        </v-list-item>

        <v-list-item to="/admin/payments">
          <v-icon>mdi-currency-inr</v-icon>
          <v-list-item-content class="sidebar-content">Payments</v-list-item-content>
        </v-list-item>
      </v-list>

      <v-spacer></v-spacer>

      <v-list dense class="sidebar-bottom">
        <v-list-item to="/admin/settings">
          <v-icon>mdi-cog</v-icon>
          <v-list-item-content class="sidebar-content">Settings</v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="pa-4">
      <router-view />
    </v-main>
  </div>
</template>

<script>
export default {
  name: "GodoAdmin",
  methods: {
    logout() {
      // Clear any session/token here if implemented
      // this.$router.push("/"); // Adjust to your login route
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 250px;
  background-color: #324247 !important;
}

.hidden-icon {
  opacity: 1;
  transition: opacity 0.3s;
}

.sidebar-header:hover .hidden-icon {
  opacity: 0;
}

.sidebar-content {
  display: none;
  margin-left: 12px;
}

.v-navigation-drawer:hover .sidebar-content {
  display: inline-block;
}

.sidebar-bottom {
  margin-top: auto;
}
@media (max-width: 900px) {
  .v-navigation-drawer {
  width: 250px;
  background-color: #324247 !important;
}

}
</style>
