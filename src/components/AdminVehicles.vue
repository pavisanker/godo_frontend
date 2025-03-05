<template>
    <div class="d-flex">
      <!-- Sidebar -->
      <v-navigation-drawer app expand-on-hover rail class="text-white vh-100 d-flex flex-column p-3" color="#324247">
        <div class="d-flex justify-content-between align-items-center mb-4 sidebar-header">
            <h4 class="sidebar-content">Admin Panel</h4>
          <v-icon class="hidden-icon">mdi-dots-horizontal</v-icon>
        </div>
        <v-list class="sidebar-content">
          <v-list-item to="/admin">
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
          <v-list-item to="/admin/routes">
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
      <v-main class="p-4 bg-light">
        <div class="container-fluid">
          <div class="d-flex-row align-items-center mb-3">
            <h2>Vehicles</h2>
            <v-container>
          <v-card class="pa-4">
            <v-card-title class="d-flex justify-center align-center">Details</v-card-title>
            <v-divider></v-divider>
            <v-table dense>
              <thead>
                <tr>
                  <th class="text-left">Sl No.</th>
                  <th class="text-left">Vehicle Name</th>
                  <th class="text-left">Registration No.</th>
                  <th class="text-left">RC Book</th>
                  <th class="text-left">Capacity</th>
                  <th class="text-left">Vehicle Type</th>
                  <th class="text-left">Total Drives</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(vehicle, index) in vehicles" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ vehicle.vehicleName }}</td>
                  <td>{{ vehicle.registrationNumber }}</td>
                  <td>
                    <v-btn 
                      variant="text" 
                      color="primary" 
                      @click="fetchRcBook(vehicle.vehicleId)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </td>
                  <td>{{ vehicle.capacity }}</td>
                  <td>{{ vehicle.vehicleType }}</td>
                  <td>{{ vehicle.totalDrives }}</td>
                  <td>
                    <v-chip :color="vehicle.status === 'Active' ? 'green' : 'red'" dark>
                      {{ vehicle.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn variant="text" color="blue" @click="openEditDialog(vehicle)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <!-- RC Book Preview Dialog -->
          <v-dialog v-model="showRcBookPopup" max-width="600px">
            <v-card>
              <v-card-title>RC Book Preview</v-card-title>
              <v-card-text>
                <div v-if="rcBookURL">
                  <img v-if="rcBookURL.includes('image')" :src="rcBookURL" width="100%" />
                  <iframe v-else :src="rcBookURL" width="100%" height="500px"></iframe>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="error" @click="showRcBookPopup = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Edit Vehicle Dialog -->
          <v-dialog v-model="editDialog" max-width="500px">
            <v-card>
              <v-card-title>Edit Vehicle</v-card-title>
              <v-card-text>
                <!-- <v-text-field label="Registration No." v-model="editedVehicle.registrationNumber"></v-text-field> -->
                <v-select 
                  label="Status" 
                  v-model="editedVehicle.status"
                  :items="['Pending','Active']">
                </v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="editDialog = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue" @click="updateVehicle">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="showConfirm" max-width="300">
            <v-card class="confirm-box">
              <v-card-title>Confirm Deletion</v-card-title>
              <v-card-text>Are you sure? This cannot be undone.</v-card-text>
              <v-card-actions class="btn-group">
                <v-btn color="red" @click="deleteAccount">Yes</v-btn>
                <v-btn color="grey" @click="showConfirm = false">No</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
            
          </div>
          <router-view></router-view>
        </div>
      </v-main>
      
    </div>
  </template>
  
  <script>
import axios from 'axios';

  export default {
    name: "AdminPanel",
    data(){
      return{
        vehicle: {
        vehicleType: "",
        vehicleName: "",
        registrationNo: "",
        chassisNo: "",
        rcBook: null,
        capacity: "",
      },
      vehicles: [],
      isEditing: false,
      rcBookURL: null,
      showRcBookPopup: false,
      editDialog: false,
      editedVehicle: {},
      showConfirm: false,
      }
    },
    async mounted() {
    
    this.fetchVehicles();
  },
    methods: {
      logout() {
        alert("Logging out...");
        this.$router.push("/");
      },
      async fetchVehicles() {


      if (this.fetched) return; // Prevent unnecessary API calls

      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/admin/getVehicles`);

        this.vehicles = response.data;
        this.fetched = true; // Set to true after fetching once

        // console.log("vehicles",this.vehicles);
        
        if (this.vehicles.length === 0) {
          alert("No vehicles found for this user.");
        }
      } catch (error) {
        this.fetched = false; // Reset fetched flag on error
        if (error.response) {
          if (error.response.status === 401) {
            alert("Invalid session. Please try again.");
          } else if (error.response.status === 404) {
            alert("No vehicles found.");
          } else {
            alert("Something went wrong!");
          }
        }
        console.error("Error fetching vehicles:", error);
      }
    },
    async fetchRcBook(vehicleId) {
  try {
    const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/rcBook/${vehicleId}`, {
      responseType: "blob", // Ensures binary file handling
    });

    // Extract file type from response headers
    const fileType = response.headers["content-type"];
    const fileBlob = new Blob([response.data], { type: fileType });

    // Generate a temporary file URL
    this.rcBookURL = URL.createObjectURL(fileBlob);
    this.showRcBookPopup = true; // Show modal popup
  } catch (error) {
    console.error("Error fetching RC Book:", error);
    alert("RC Book not available for this vehicle.");
  }
},
openEditDialog(vehicle) {
      if (vehicle.status !== 'Inactive') {
          this.editedVehicle = { ...vehicle };
          this.editDialog = true;
      } else {
        alert("Inactive vehicles cannot be edited.");
      }
    },
    async updateVehicle() {
      try {
        const response = await axios.put(
          `${this.$store.getters.getUrl}/api/godo/updateVehicle/${this.editedVehicle.vehicleId}`,
          this.editedVehicle
        );
        const index = this.vehicles.findIndex(v => v.vehicleId === response.data.vehicleId);
        if (index !== -1) {
          this.vehicles[index] = response.data;
        }
        this.editDialog = false;
      } catch (error) {
        console.error("Error updating vehicle:", error);
      }
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