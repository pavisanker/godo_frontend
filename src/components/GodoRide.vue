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
                  <router-link :to="`/drive?session=${sessionId}`" style="color: #324247;">Drive</router-link>
                    <router-link :to="`/ride?session=${sessionId}`" style="color: #F4A261;">Ride</router-link>
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
              Upcoming Ride
            </v-card-title>
            <v-divider></v-divider>
            <v-table dense>
              <thead>
                <tr>
                  <th class="text-center">Sl No.</th>
                  <th class="text-center">Start</th>
                  <th class="text-center">Destination</th>
                  <th class="text-center">Boarding Time</th>
                  <th class="text-center">Passengers</th>
                  <th class="text-center">Total Fare</th>
                  <th class="text-center">Status</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ride, index) in rides" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ ride.start }}</td>
                  <td>{{ ride.destination }}</td>
                  <td>{{ formatDate(ride.boardingTime) }}</td>
                  <td>{{ ride.passengerCount }}</td>
                  <td><v-icon left>mdi-currency-inr</v-icon>{{ ride.amount/100 }}</td>
                  <td>
                    <v-chip :color="getStatusName(ride.status) === 'Pending' ? 'red' : 'blue'" dark>
                      {{ getStatusName(ride.status) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn icon variant="text" color="primary" @click="viewDetails(ride.routeId)">
                    <v-icon size="20">mdi-eye</v-icon>
                  </v-btn>
                    <v-btn 
                    :disabled="ride.status === 3"
                    variant="text" color="blue" @click="openEditDialog(ride)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="ride.paymentStatus !== 4" 
                      :disabled="ride.status !== 3 "
                      color="green"
                      @click="goToPayment(ride)"
                    >
                    <v-icon left>mdi-currency-inr</v-icon> Pay
                  </v-btn>
                  <v-chip
                  v-else
                  :color="getStatusName(ride.paymentStatus) === 'Success' ? 'success' : 'default'"
                  class="ma-2"
                  label
                  small
                >
                  <v-icon left small>mdi-currency-inr</v-icon>
                  {{ getStatusName(ride.paymentStatus) }}
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
                Confirm Delete
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                
              Are you sure you want to cancel this booking?<br>
              From 
              <b>{{ editedRide?.start }}</b> to <b>{{ editedRide?.destination }}</b>
            </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                  <!-- <v-btn color="blue" @click="saveChanges(editedRide.bookingId)">Save</v-btn> -->
                  <v-btn @click="editDialog = false">Cancel</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="red" :disabled="editedRide.paymentStatus !== 1" @click="deleteRide(editedRide.bookingId)">Delete</v-btn>

                </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-col>

          <v-col cols="12">
              <v-container>
                <v-card class="pa-4 mt-4">
                <v-card-title class="d-flex justify-center align-center">
                  Ride History
                </v-card-title>
                <v-divider></v-divider>
                <v-table dense>
                  <thead>
                    <tr>
                      <th class="text-center">Sl No.</th>
                      <th class="text-center">Start</th>
                      <th class="text-center">Destination</th>
                      <th class="text-center">Boarding Time</th>
                      <th class="text-center">Route ID</th>
                      <th class="text-center">Amount</th>
                      <th class="text-center">Payment ID</th>
                      <th class="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ride, index) in rideHistory" :key="ride.bookingId">
                      <td class="text-center">{{ index + 1 }}</td>
                      <td class="text-center">{{ ride.start }}</td>
                      <td class="text-center">{{ ride.destination }}</td>
                      <td class="text-center">{{ formatDate(ride.boardingTime) }}</td>
                      <td>{{ ride.travelId }}</td>
                      <td>
                          <v-icon left small>mdi-currency-inr</v-icon>
                        {{ ride.amount/100 }}</td>
                      <td>{{ ride.paymentId }}</td>
                      <td>{{getStatusName(ride.status) }}</td>
                      
                    </tr>
                  </tbody>
                </v-table>
              </v-card>

        </v-container>
            </v-col>
          </v-row>
  </v-container>

  <v-dialog v-model="showDetailsDialog" max-width="500px">
  <v-card class="pa-4 rounded-lg elevation-3">
    
    <!-- Title -->
    <v-card-title class="text-h6 d-flex justify-space-between align-center">
      <span>🚗 Drive Details</span>
      <v-btn icon @click="showDetailsDialog = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Driver Info -->
    <v-card-text class="mt-4">
      <v-row>
        <v-col cols="12" class="mb-2">
          <v-icon left color="primary">mdi-account</v-icon>
          <strong>Name:</strong> {{ details.name || 'N/A' }}
        </v-col>

        <v-col cols="12" class="mb-2">
          <v-icon left color="green">mdi-phone</v-icon>
          <strong>Phone:</strong> {{ details.phone || 'N/A' }}
        </v-col>

        <v-col cols="12" class="mb-2">
          <v-icon left color="blue">mdi-car</v-icon>
          <strong>Vehicle Number:</strong> {{ details.vehicleNumber || 'N/A' }}
        </v-col>

        <v-col cols="12">
          <v-icon left color="teal">mdi-car-side</v-icon>
          <strong>Vehicle Type:</strong> {{ details.vehicleType || 'N/A' }}
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Actions -->
    <v-card-actions class="justify-end">
      <v-btn color="primary" variant="outlined" @click="showDetailsDialog = false">
        <v-icon left>mdi-check</v-icon> Close
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

            
        
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
        rides: [],
        editDialog: false,
        editedRide: {},
        rideHistory: [],
        statuses: [],
        details: [],
        showDetailsDialog: false,

    
      };
    },
    async mounted() {
      await this.fetchRideHistory();
      await this.fetchRides();
      await this.checkExpiredRides();


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
      async fetchRides() {
      if (!this.sessionId) {
        alert("Please enter a session ID");
        return;
      }

      if (this.fetched) return; // Prevent unnecessary API calls

      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/viewRides?session=${this.sessionId}`);

        this.rides = response.data;
        this.fetched = true; // Set to true after fetching once

        // console.log("vehicles",this.vehicles);
        
        if (this.rides.length === 0) {
          alert("No Rides found for this user.");
        }
      } catch (error) {
        this.fetched = false; // Reset fetched flag on error
        if (error.response) {
          if (error.response.status === 401) {
            alert("Invalid session. Please try again.");
          } else if (error.response.status === 404) {
            // alert("No Rides found.");
          } else {
            alert("Something went wrong!");
          }
        }
        console.error("Error fetching Rides:", error);
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
    openEditDialog(ride) {
      this.editedRide = { ...ride };
      this.editDialog = true;
    },
    async saveChanges(bookingId) {
      try {
        const response = await axios.put(`${this.$store.getters.getUrl}/api/godo/updateRide/${bookingId}`,
          this.editedRide
        );
        const index = this.rides.findIndex(v => v.bookingId === response.data.bookingId);
        if (index !== -1) {
          this.rides[index] = response.data;
        }
        this.editDialog = false;
      } catch (error) {
        console.error("Error updating Ride:", error);
      }
    },
    async deleteRide(bookingId) {
      try {
        await axios.delete(`${this.$store.getters.getUrl}/api/godo/deleteRide/${bookingId}`);
        this.rides = this.rides.filter(v => v.bookingId !== bookingId);
        this.editDialog = false;
      } catch (error) {
        console.error("Error deleting Ride:", error);
      }
    },
    async checkExpiredRides() {
  const now = new Date();
  const expiredRides = this.rides.filter(ride => new Date(ride.boardingTime) < now);

  for (const ride of expiredRides) {
    try {
      if(ride.status === 4){
          await axios.post(`${this.$store.getters.getUrl}/api/godo/history?session=${this.sessionId}&routeId=${ride.routeId}`);

          await axios.delete(`${this.$store.getters.getUrl}/api/godo/deleteRide/${ride.bookingId}`);
          this.rides = this.rides.filter(v => v.bookingId !== ride.bookingId);
      }
      else if(ride.status ===1){
        await axios.delete(`${this.$store.getters.getUrl}/api/godo/deleteRide/${ride.bookingId}`);
          this.rides = this.rides.filter(v => v.bookingId !== ride.bookingId);
      }
      else{
        return;
      }
      
    } catch (error) {
      console.error(`Failed to delete ride (ID: ${ride.bookingId})`, error);
      alert(`Failed to delete ride (ID: ${ride.bookingId}). Check console for details.`);
    }
  }

},
async fetchRideHistory() {
  try {
    const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/viewRideHistory?session=${this.sessionId}`);
    this.rideHistory = response.data;
  } catch (error) {
    console.error("Error fetching ride history:", error);
  }
},
async viewDetails(routeId) {
  try {
    const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/details/${routeId}`);
            this.details = response.data;

    this.showDetailsDialog = true; // Open the dialog
  } catch (error) {
    console.error("Error fetching booking details:", error);
  }
},

goToPayment(ride) {
    this.$router.push({
      name: 'CreatePayment',  // must match the route name
      query: {
        customerId: ride.userId || '9191IM',
        ownerId: ride.ownerId || '9191IM',
        routeId: ride.routeId || 'defaultRoute',
        bookingId: ride.bookingId || 'defaultBooking',
        amount: ride.amount/100 || 100  // fallback
      }
    });
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