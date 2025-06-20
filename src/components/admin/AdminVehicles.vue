<template>
  <div>
    <h2>Vehicle Management</h2>

    <v-container>
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">Details</v-card-title>
        <v-divider></v-divider>

        <v-table dense>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Vehicle Details</th>
              <th>Registration No.</th>
              <th>RC Book</th>
              <th>Phone</th>
              <th>Owner Id</th>
              <th>Chassis No.</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vehicle, index) in vehicles" :key="vehicle.vehicleId">
              <td>{{ index + 1 }}</td>
              <td @click="toggleDetails(index)" style="cursor: pointer;">
                {{ vehicle.vehicleName }}
                <span v-if="vehicle.showDetails"> ⮝
                  <br>Vehicle Type: {{ vehicle.vehicleType }} 
                  <br>Capacity: {{ vehicle.capacity }}
                </span>
                <span v-else> ⮛</span>
              </td>                  
              <td>{{ vehicle.registrationNumber }}</td>
              <td>
                <v-btn icon variant="text" color="primary" @click="fetchRcBook(vehicle.vehicleId)">
                  <v-icon size="20">mdi-eye</v-icon>
                </v-btn>
              </td>
              <td>{{ vehicle.phoneNumber }}</td>
              <td>{{ vehicle.userId }}</td>
              <td>{{ vehicle.chassisNumber }}</td>
              <td>
                <v-chip :color="getStatusColor(vehicle.status)" dark>
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
            <v-select 
              label="Status" 
              v-model="editedVehicle.status"
              :items="['Pending', 'Active']">
            </v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="editDialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue" @click="updateVehicle">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "AdminVehicles",
  data() {
    return {
      vehicles: [],
      rcBookURL: null,
      showRcBookPopup: false,
      editDialog: false,
      editedVehicle: {}
    };
  },
  async mounted() {
    await this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/admin/getVehicles`);
        this.vehicles = response.data.map(vehicle => ({
          ...vehicle,
          showDetails: false // Initialize showDetails for each vehicle
        }));
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        alert(error.response?.data?.message || "Something went wrong!");
      }
    },

    async fetchRcBook(vehicleId) {
      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/rcBook/${vehicleId}`, {
          responseType: "blob",
        });

        const fileType = response.headers["content-type"];
        const fileBlob = new Blob([response.data], { type: fileType });
        this.rcBookURL = URL.createObjectURL(fileBlob);
        this.showRcBookPopup = true;
      } catch (error) {
        console.error("Error fetching RC Book:", error);
        alert("RC Book not available.");
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

    toggleDetails(index) {
      this.vehicles[index].showDetails = !this.vehicles[index].showDetails;
    },

    getStatusColor(status) {
      return status === "Active" ? "green" : status === "Pending" ? "red" : "blue";
    }
  }
};
</script>

<style scoped>
.v-container {
  max-width: 1200px;
  margin: auto;
}
</style>
