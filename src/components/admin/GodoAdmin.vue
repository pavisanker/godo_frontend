<template>
    <div class="d-flex">
      <!-- Sidebar -->
      <v-navigation-drawer app expand-on-hover rail class="text-white vh-100 d-flex flex-column p-3" color="#324247">
        <div class="d-flex justify-content-between align-items-center mb-4 sidebar-header">
            <h4 class="sidebar-content">Admin Panel</h4>
          <v-icon class="hidden-icon">mdi-dots-horizontal</v-icon>
        </div>
        <v-list class="sidebar-content">
          <v-list-item to="/admin/dashboard">
            <v-icon>mdi-view-dashboard</v-icon>
            <v-list-item-content>Dashboard</v-list-item-content>
          </v-list-item>
          <v-list-item to="/admin/users">
            <v-icon>mdi-account-group</v-icon>
            <v-list-item-content>Users</v-list-item-content>
          </v-list-item>
          <v-list-item to="/admin/vehicles">
            <v-icon>mdi-car</v-icon>
            <v-list-item-content>Vehicles</v-list-item-content>
          </v-list-item>
          <v-list-item to="/admin/drives">
            <v-icon>mdi-map-marker-path</v-icon>
            <v-list-item-content>Drives</v-list-item-content>
          </v-list-item>
          <v-list-item to="/admin/bookings">
            <v-icon>mdi-calendar-check</v-icon>
            <v-list-item-content>Bookings</v-list-item-content>
          </v-list-item>
          <v-list-item to="/admin/history">
            <v-icon>mdi-history</v-icon>
            <v-list-item-content>History</v-list-item-content>
          </v-list-item>
        </v-list>
        <v-spacer></v-spacer>
        <v-list class="sidebar-bottom">
          <v-list-item to="/admin/settings">
            <v-icon>mdi-cog</v-icon>
            <v-list-item-content>Settings</v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout">
            <v-icon>mdi-logout</v-icon>
            <v-list-item-content>Logout</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <!-- Main Content -->
      <v-main class="p-4">
        <router-view></router-view>

      </v-main>
      
    </div>
  </template>
  
  <script>
// import axios from 'axios';

  export default {
    name: "GodoAdmin",
    data(){
      return{
        
      }
    },
    async mounted() {
    
  },
    methods: {
      logout() {
        alert("Logging out...");
        this.$router.push("/");
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
  }
  .v-navigation-drawer:hover .sidebar-content {
    display: block;
  }
  .sidebar-bottom {
  margin-top: 100px;
}
  </style>