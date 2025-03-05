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
                    <router-link to="/home" style="color: #324247;">Home</router-link>
                    <router-link :to="`/drive?session=${sessionId}`" style="color: #324247;">Drive</router-link>
                    <router-link :to="`/ride?session=${sessionId}`" style="color: #F4A261;">Ride</router-link>
                    <router-link :to="`/delivery?session=${sessionId}`" style="color: #324247;">Delivery</router-link>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <a>About</a>
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
                  <td>
                    <v-chip :color="ride.status === 'Booked' ? 'green' : 'blue'" dark>
                      {{ ride.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn variant="text" color="blue" @click="openEditDialog(ride)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <!-- Edit Dialog -->
          <v-dialog v-model="editDialog" max-width="500px">
            <v-card>
              <v-card-title class="d-flex justify-center align-center">
                Edit Ride
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-form ref="editForm">
                  <!-- <v-text-field label="Start" v-model="editedRide.start" required></v-text-field>
                  <v-text-field label="Destination" v-model="editedRide.destination" required></v-text-field>
                  <v-text-field label="Boarding Time" v-model="editedRide.boardingTime" type="datetime-local" required></v-text-field>
                  <v-text-field label="Vacancy" v-model="editedRide.vacancy" type="number" required></v-text-field> -->
                  <!-- <v-select label="Status" v-model="editedRide.status" :items="['Scheduled', 'Completed']"></v-select> -->
                  <v-field>Confirm Delete</v-field>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                  <v-btn color="red" @click="deleteRide(editedRide.bookingId)">Delete</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="blue" @click="saveChanges(editedRide.bookingId)">Save</v-btn>
                  <v-btn @click="editDialog = false">Cancel</v-btn>
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
                      <th class="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ride, index) in rideHistory" :key="ride.bookingId">
                      <td class="text-center">{{ index + 1 }}</td>
                      <td class="text-center">{{ ride.start }}</td>
                      <td class="text-center">{{ ride.destination }}</td>
                      <td class="text-center">{{ formatDate(ride.boardingTime) }}</td>
                      <td class="text-center">
                        <v-chip :color="ride.status === 'Completed' ? 'gray' : 'orange'" dark>
                          {{ ride.status }}
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>

        </v-container>
            </v-col>
          </v-row>
  </v-container>

  
            
        
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
    },
    methods: {

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
            alert("No Rides found.");
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
      await axios.post(`${this.$store.getters.getUrl}/api/godo/history?session=${this.sessionId}&routeId=${ride.routeId}`);

      await axios.delete(`${this.$store.getters.getUrl}/api/godo/deleteRide/${ride.bookingId}`);
      this.rides = this.rides.filter(v => v.bookingId !== ride.bookingId);
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