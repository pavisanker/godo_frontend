<template>
    <div>
        <div class="header">
            <div class="l1">
                <h3>GoDo</h3>
                <h4>Travel & Deliver</h4>
            </div>
            <div>
                <div class="l2">
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                  <router-link :to="`/home?session=${sessionId}`" style="color: #324247;">Home</router-link>
                  <router-link :to="`/drive?session=${sessionId}`" style="color: #F4A261;">Drive</router-link>
                    <router-link :to="`/ride?session=${sessionId}`" style="color: #324247;">Ride</router-link>
                    <router-link :to="`/delivery?session=${sessionId}`" style="color: #324247;">Delivery</router-link>
                  </div>
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                  <!-- <router-link to="/about" class="nav-link">About</router-link> -->
                  <a @click="goToProfile">Profile</a>
                  <a @click="logout">Logout</a>
                </div>
                </div>
            </div>
        </div>
  
        <div class="content">
          
          

  <v-container>
    <v-row>
      <!-- Single column that contains two rows -->
      <v-col cols="12">
        <v-container>
    <v-card class="pa-4">
      <v-card-title class="d-flex justify-center align-center">
        Upcoming Drive
      </v-card-title>
      <v-divider></v-divider>
      <v-table dense>
        <thead>
          <tr>
            <th class="text-center">Sl No.</th>
            <th class="text-center">Start</th>
            <th class="text-center">Destination</th>
            <th class="text-center">Boarding Time</th>
            <th class="text-center">Distance</th>
            <th class="text-center">Fare</th>
            <th class="text-center">Vacancy</th>
            <th class="text-center">Booked</th>
            <th class="text-center">Delivery</th>
            <th class="text-center">Status</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(drive, index) in drives" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ drive.start }}</td>
            <td>{{ drive.destination }}</td>
            <td>{{ formatDate(drive.boardingTime) }}</td>
            <td>{{ drive.distance/1000 }}Km</td>
            <td><v-icon left>mdi-currency-inr</v-icon>{{ drive.amount/100 }}</td>
            <td>{{ drive.vacancy }}</td>
            <td>{{ drive.booked }}</td>
            <td>{{ drive.delivery }}</td>
            <td>
              <v-chip :color="drive.status === 'Booked' ? 'green' : getStatusName(drive.status) === 'Pending' ? 'red' : 'blue'" dark>
                {{ getStatusName(drive.status) }}
              </v-chip>

            </td>
            
            <td>
              <v-btn icon variant="text" color="primary" @click="viewBookings(drive.routeId)">
                    <v-icon size="20">mdi-eye</v-icon>
                  </v-btn>
              <v-btn icon variant="text" color="blue" @click="openEditDialog(drive)">
                <v-icon size="20">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="green" @click="openConfirmDialog(drive)">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-chip
                :color="getStatusName(drive.paymentStatus) === 'Success' ? 'success' : 'default'"
                class="ma-2"
                label
                small
              >
                <v-icon left small>mdi-currency-inr</v-icon>
                {{ getStatusName(drive.paymentStatus) }}
              </v-chip>

            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex justify-center align-center">
          Edit Drive - {{ editedDrive.routeId }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
              Are you sure you want to cancel this route?<br>
              From 
              <b>{{ editedDrive?.start }}</b> to <b>{{ editedDrive?.destination }}</b>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn @click="editDialog = false">Cancel</v-btn>
                        <v-spacer></v-spacer>
            <!-- <v-btn  v-if="editedDrive.paymentStatus !== 4" 
              color="red" @click="deleteDrive(editedDrive.routeId)">Delete</v-btn> -->
              <v-btn 
                color="red" 
                @click="deleteDrive(editedDrive.routeId)" 
                :disabled="editedDrive.paymentStatus !== 1"
              >
                Delete
              </v-btn>


          </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation Dialog -->
<v-dialog v-model="confirmDialog" max-width="400px">
  <v-card>
    <v-card-title class="d-flex justify-center align-center">
      Confirm Start
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="text-center">
      Are you sure you want to mark this drive as **Started**?
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-center">
      <v-btn color="red" @click="confirmDialog = false">No</v-btn>
      <v-btn color="green" @click="confirmCompletion">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="showDetails" max-width="600px">
  <v-card class="pa-4 rounded-lg elevation-3">
    <!-- Title Bar -->
    <v-card-title class="text-h6 d-flex justify-space-between align-center">
      <span>📖 Booking Details</span>
      <v-btn icon @click="showDetails = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Booking Details -->
    <v-card-text class="mt-4">
      <!-- Passenger Details -->
      <div v-if="bookedPassengers.length">
        <h4 class="text-subtitle-1 font-weight-bold mb-2">🧑‍🤝‍🧑 Passengers</h4>
        <v-row dense class="d-flex flex-wrap">
          <v-col v-for="(passenger, index) in bookedPassengers" :key="index" cols="12" sm="6" md="6">
            <v-card class="pa-2 rounded-lg elevation-2">
              <v-card-title class="d-flex align-center">
                    <v-icon color="blue" class="mr-2">mdi-account</v-icon>
                    {{ passenger.name }}
                </v-card-title>
                <div class="d-flex align-center justify-space-between">
                  <v-card-subtitle class="text-grey-darken-3">📞 {{ passenger.phone }}</v-card-subtitle>
                  <v-card-subtitle class="text-grey-darken-3">👤{{ passenger.passengerCount }}</v-card-subtitle>
                </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Delivery Details -->
      <div v-if="bookedDeliveries.length" class="mt-4">
        <h4 class="text-subtitle-1 font-weight-bold mb-2">📦 Deliveries</h4>
        <v-row dense class="d-flex flex-wrap">
          <v-col v-for="(delivery, index) in bookedDeliveries" :key="index" cols="12" sm="6" md="6">
            <v-card class="pa-2 rounded-lg elevation-2">
              <v-card-title class="d-flex align-center">
                <v-icon color="green" class="mr-2">mdi-package-variant</v-icon>
                {{ delivery.receiverName || 'Unknown Item' }}
              </v-card-title>
              <div class="d-flex align-center justify-space-between">
                <v-card-subtitle class="text-grey-darken-3">📞 {{ delivery.phone }}</v-card-subtitle>
                <v-card-subtitle class="text-grey-darken-3">⚖️ {{ delivery.weight+"Kg" }}</v-card-subtitle>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- No Bookings -->
      <v-alert v-if="!bookedPassengers.length && !bookedDeliveries.length" type="info" class="mt-3 text-center">
        No bookings yet.
      </v-alert>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Actions -->
    <v-card-actions class="justify-end">
      <v-btn color="primary" variant="outlined" @click="showDetails = false">
        <v-icon left>mdi-check</v-icon> Close
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>



  </v-container>
      </v-col>

      <!-- Second container for section history -->
      <v-col cols="12">
        <v-container>
          <v-card class="pa-4 mt-4">
      <v-card-title class="d-flex justify-center align-center">
        Drive History
      </v-card-title>
      <v-divider></v-divider>
      <v-table dense>
        <thead>
          <tr>
            <th class="text-center">Sl No.</th>
            <th class="text-center">Start</th>
            <th class="text-center">Destination</th>
            <th class="text-center">Boarding Time</th>
            <th class="text-center">Delivery</th>
            <th class="text-center">Travel ID</th>
            <th class="text-center">Amount</th>
            <th class="text-center">Payment ID</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(drive, index) in driveHistory" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ drive.start }}</td>
            <td>{{ drive.destination }}</td>
            <td>{{ formatDate(drive.boardingTime) }}</td>
            <td>
            <v-icon v-if="drive.deliveryCustomerId" color="green">mdi-check</v-icon>
            <span v-else>Nil</span>
          </td>
            <td>{{ drive.travelId }}</td>
            <td>
                <v-icon left small>mdi-currency-inr</v-icon>
              {{ drive.amount/100 }}</td>
            <td>{{ drive.paymentId }}</td>
            <td>{{getStatusName(drive.status) }}</td>

          </tr>
        </tbody>
      </v-table>
    </v-card>

  
  </v-container>
      </v-col>
    </v-row>
  </v-container>
            
        
        </div>
        <div>
          <v-snackbar
          v-model="snackbar"
          :timeout="2000"
          :color="snackbarColor"
          location="top centre"
        >
          {{ snackbarMessage }}
        </v-snackbar>
        </div>

    </div>
  </template>
<script>
import axios from 'axios';

// import axios from 'axios';

  export default {
    data() {
      
    return {
        sessionId: this.$route.query.session || localStorage.getItem("sessionId") || "",
        // isNewUser: this.$route.query.isNewUser === "true",
        drives: [],
        editDialog: false,
        editedDrive: {},
        driveHistory: [],
        confirmDialog: false,
        selectedDrive: null,
        bookedPassengers: [],
        bookedDeliveries: [],
        showDetails: false,
        statuses: [],
        snackbar: false,
        snackbarMessage: '',

      };
    },
    async mounted() {
      await this.fetchDriveHistory();
      await this.fetchDrives();
      await this.checkExpiredDrives();
      if (!this.sessionId) {
        alert("Session expired. Please log in again.");
        this.$router.push("/");
        return;
      }
      localStorage.setItem("sessionId", this.sessionId);
      // if (this.isNewUser) {
      //   this.$router.push(`/profile?session=${this.sessionId}`);
      // }
      const statusRes = await axios.get(`${this.$store.getters.getUrl}/api/godo/viewStatus`);
      this.statuses = statusRes.data;
    },
    methods: {
      getStatusName(id) {
          const match = this.statuses.find(s => s.statusId === id);
          return match ? match.statusName : 'Unknown';
        },
      async goToProfile() {
        if (!this.sessionId) {
          alert("Session expired. Please log in again.");
          this.$router.push("/");
          return;
        }
        this.$router.push(`/profile?session=${this.sessionId}`);
      },
      toHomeDrive(){
      this.$router.push(`/homedrive?session=${this.sessionId}`);
      
    },
    toHomeRide(){
      this.$router.push(`/home?session=${this.sessionId}`);
      
    },
      logout() {
        localStorage.removeItem("sessionId");
        this.$router.push("/");
      },
      async fetchDrives() {
      if (!this.sessionId) {
        alert("Please enter a session ID");
        return;
      }

      if (this.fetched) return; // Prevent unnecessary API calls

      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/viewDrives?session=${this.sessionId}`);

        this.drives = response.data;
        this.fetched = true; // Set to true after fetching once

        // console.log("vehicles",this.vehicles);
        
        if (this.drives.length === 0) {
          alert("No Drives found for this user.");
        }
      } catch (error) {
        this.fetched = false; // Reset fetched flag on error
        if (error.response) {
          if (error.response.status === 401) {
            alert("Invalid session. Please try again.");
          } else if (error.response.status === 404) {
            // alert("No Drives found.");
          } else {
            alert("Something went wrong!");
          }
        }
        console.error("Error fetching Drives:", error);
      }
    },
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
    openEditDialog(drive) {
      this.editedDrive = { ...drive };
      this.editDialog = true;
    },
    async saveChanges(routeId) {
      try {
        const response = await axios.put(
          `${this.$store.getters.getUrl}/api/godo/updateDrive/${routeId}`,
          this.editedDrive
        );
        const index = this.drives.findIndex(v => v.routeId === response.data.routeId);
        if (index !== -1) {
          this.drives[index] = response.data;
        }
        this.editDialog = false;
      } catch (error) {
        console.error("Error updating Drive:", error);
      }
    },
    async deleteDrive(routeId) {
      try {
        await axios.delete(`${this.$store.getters.getUrl}/api/godo/deleteDrive/${routeId}`);
        this.drives = this.drives.filter(v => v.routeId !== routeId);
        this.editDialog = false;
      } catch (error) {
        console.error("Error deleting Drive:", error);
      }
    },
    async checkExpiredDrives() {
  const now = new Date();
  const expiredDrives = this.drives.filter(drive => new Date(drive.boardingTime) < now);

  for (const drive of expiredDrives) {
    try {
      // Move to history if status is success"
      if (drive.status === 4) {
        await axios.post(`${this.$store.getters.getUrl}/api/godo/history?session=${this.sessionId}&routeId=${drive.routeId}`);
        await axios.delete(`${this.$store.getters.getUrl}/api/godo/deleteDrive/${drive.routeId}`);

        this.drives = this.drives.filter(drive => new Date(drive.boardingTime) >= now && drive.status === 4);

      }
      else if(drive.status === 1){
        await axios.delete(`${this.$store.getters.getUrl}/api/godo/deleteDrive/${drive.routeId}`);
        this.drives = this.drives.filter(drive => new Date(drive.boardingTime) >= now && drive.status === 1);


      }
      else{
        return;
      }

    } catch (error) {
      console.error(`Error processing drive (ID: ${drive.routeId}):`, error);
      alert(`Failed to process drive (ID: ${drive.routeId}). Check console for details.`);
    }
  }

},

    openConfirmDialog(drive) {
    this.selectedDrive = drive; // Store the selected drive
    this.confirmDialog = true;  // Open confirmation dialog
  },
  async confirmCompletion() {
   
    if (!this.selectedDrive) return;

    try {
      const now = new Date();
        const boardingDate = new Date(this.selectedDrive.boardingTime);
        // console.log("drive",this.selectedDrive);
        

        if (this.selectedDrive.status !== 1 && boardingDate < now && this.selectedDrive.status !== 4) {
        

            await axios.put(`${this.$store.getters.getUrl}/api/godo/updateStatus/${this.selectedDrive.routeId}`);
            this.snackbarMessage = 'Status updated successfully';
               this.snackbarColor = 'green';
               this.snackbar = true;
               window.location.reload();


        }
        else{
          this.snackbarMessage = 'Boarding Time Not Passed';
           this.snackbarColor = 'red';
            this.snackbar = true;

        }

      // Close dialog
      this.confirmDialog = false;

    } catch (error) {
      alert("Error marking drive as completed:", error);
    }

  },
  async fetchDriveHistory() {
  try {
    const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/viewDriveHistory?session=${this.sessionId}`);
    this.driveHistory = response.data;
  } catch (error) {
    console.error("Error fetching ride history:", error);
  }
},
async viewBookings(routeId) {
  try {
    const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/bookings/${routeId}`);
    this.selectedDrive = response.data.route;
    this.bookedPassengers = response.data.passengers;
    this.bookedDeliveries = response.data.deliveries;
    this.showDetails = true; // Open the dialog
  } catch (error) {
    console.error("Error fetching booking details:", error);
  }
},



    }
  };
  </script>

<style scoped>
  .l1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 1%;
  text-decoration: solid;
  color: white;
  background-color: #324247;
}

.l2 {
  display: flex;
  flex-direction: row;
  padding-left: 2%;
  padding-right: 10%;
  padding-top: 1%;
  justify-content: space-between;
  background-color: #EAEAEA;
}

a {
  padding-left: 2em;
  padding-bottom: 1em;
  cursor: pointer;
  text-decoration: none;
  color: black;
}
.content {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: center;
  margin-top: 50px;
}
.button {
  display: block;
  width: 175px;
  height: 50px;
  padding: 10px;
  color: white;
  border: 2px solid;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}
.input-group {
  margin: 10px 0;
  background-color: #EAEAEA;
  height: 50px;
  width: 100%;
  border-radius: 5px;
}
input {
  width: auto;
  /* padding: 8px; */
  margin: 5px;
}

/* .v-card {
  background: linear-gradient(135deg, #324247, #EAEAEA);
  color: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
} */
@media (max-width: 600px) {
  .l2 {
    flex-direction: column;
  }
  .content{
    flex-direction: column;
    align-items: center;
    gap:20px
  }
}

</style>