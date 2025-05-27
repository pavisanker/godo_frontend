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
                  <router-link :to="`/home?session=${sessionId}`" style="color: #F4A261;">Home</router-link>
                  <router-link :to="`/drive?session=${sessionId}`" style="color: #324247;">Drive</router-link>
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
          
            <div style="display: flex; flex-direction: column; align-items: center;width: 400px;">

                <div style="display: flex;flex-direction: column; align-items: center; width: 400px;">
                    <button class="button" style="background-color: #EAEAEA; color :#324247; border-bottom: none; border-bottom-left-radius: 0px;border-bottom-right-radius: 0px;" @click="toHomeDrive">Take Drive</button>
                    <div style="display: flex;flex-direction: row;">
                        <button class="button" style="background-color:white;color: #324247; border-color: #324247; border-bottom: none; border-bottom-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;" @click="toHomeRide">Book Ride</button>
                        <button class="button" style="background-color: #324247; color: white; border-color: #324247;border-left: none; border-bottom: none;border-bottom-right-radius: 0px;border-top-left-radius: 0px; border-bottom-left-radius: 0px;">Book Delivery</button>
                    </div>
                </div>

                <div style="border: 2px solid;border-radius: 10px;border-top-left-radius: 0px;border-top-right-radius: 0px; width: 350px; display: flex;flex-direction: column;align-items: center;padding-left: 2em;padding-right: 2em;">
                    
                  <v-text-field class="input-group"
                      label="Starting point" 
                      v-model="startingPoint" 
                      @input="startingPoint = startingPoint.toUpperCase()"
                      required
                    ></v-text-field>
                    <!-- <v-autocomplete class="input-group"
                      v-model="startingPoint"
                      :items="suggestions"
                      label="Enter Starting Point"
                      @update:search="fetchPlaceSuggestions"
                    ></v-autocomplete> -->
                    <v-text-field class="input-group"
                      label="Destination" 
                      v-model="destination" 
                      @input="destination = destination.toUpperCase()"
                      required
                    ></v-text-field>
                    
        
                    <v-text-field class="input-group" label="Weight in Kg" 
                    v-model="weight"
                    type="number"
                    required>
                    </v-text-field>
                    
                    
                    <button class="button" style="color: white; background-color: #324247;" @click="searchRoutes()">Search</button>
                </div>
                <!-- Popup Dialog to Show Search Results -->
              <v-dialog v-model="dialog" max-width="500px">
                <v-card class="rounded-lg">
                  <v-card-title class="text-h6 font-weight-bold text-center">
                    🚏 Select a Route
                  </v-card-title>

                  <v-card-text>
                    <v-row>
                      <v-col v-for="(route, index) in results" :key="index" cols="12">
                        <v-card 
                          class="route-card" 
                          @click="bookDelivery(route)"
                        >
                          <v-card-title class="d-flex align-center justify-space-between">
                            <span class="text-body-1 font-weight-medium">
                              <v-icon color="green" class="mr-1">mdi-map-marker</v-icon>
                              {{ route.start }} 
                              <v-icon color="blue" class="mx-2">mdi-arrow-right</v-icon> 
                              {{ route.destination }}
                            </span>
                          </v-card-title>

                          <v-card-subtitle class="text-body-2 px-4">
                            <!-- <div>
                              <v-icon color="orange">mdi-seat</v-icon> 
                              Vehicle Type <b>{{ route.vacancy }}</b>
                            </div> -->
                            <div>
                              <v-icon color="red">mdi-calendar</v-icon> 
                              Date: <b>{{ formatDate(route.boardingTime) }}</b>
                            </div>
                            <div>
                              <v-icon color="blue">mdi-clock-time-four-outline</v-icon> 
                              Time: <b>{{ formatTime(route.boardingTime) }}</b>
                            </div>
                          </v-card-subtitle>


                          <v-card-actions class="justify-end">
                            <v-btn color="primary" @click="bookTravel(route)">
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>

                <v-card-actions class="justify-end">
                  <v-btn color="error" @click="dialog = false">
                    <v-icon class="mr-1">mdi-close</v-icon> Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            </div>
            <!-- <div>
                
                  <GMapMap
                    :center="mapCenter"
                    :zoom="12"
                    style="width: 400px; height: 500px;border-radius: 10px;"
                  >
                    <GMapMarker
                      :position="mapCenter"
                      :clickable="true"
                      :draggable="false"
                    />
                  </GMapMap>
            </div> -->

            <div>
            <MapView 
              ref="mapRef"
              :center="mapCenter"
              :zoom="12"
              :startingPoint="startingPoint" 
              :destination="destination"
              style="width: 400px; height: 500px;border-radius: 10px;"
              />
            </div>
        
        </div>

        <div>
          <v-snackbar
          v-model="snackbar"
          :timeout="2000"
          :color="snackbarColor"
          location="top center"

        >
          {{ snackbarMessage }}
        </v-snackbar>
        </div>
    </div>
  </template>


<script>
// import axios from 'axios';
import MapView from './MapView.vue';


  export default {
  components: { MapView },

    data() {
    return {
        sessionId: this.$route.query.session || localStorage.getItem("sessionId") || "",
        // isNewUser: this.$route.query.isNewUser === "true",
        startingPoint: "",
        destination: "",
        weight: null,
        mapCenter: { lat: 9.6878, lng: 76.3354 },
        results: [], // Holds search results from backend
        dialog: false, // Controls the popup
        selectedRoute: null,
        snackbar: false,
        snackbarMessage: '',
      };
    },
    async mounted() {
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
      async searchRoutes() {
      if (!this.startingPoint || !this.destination) {
        // alert("Please enter both Starting Point and Destination.");
        this.snackbarMessage = "Please enter both Starting Point and Destination.";
          this.snackbarColor = 'red';
          this.snackbar = true;
        return;
      }

      try {
        const response = await fetch(`${this.$store.getters.getUrl}/api/godo/deliveryRoutes?start=${this.startingPoint}&destination=${this.destination}&weight=${this.weight}`);
        if (!response.ok) throw new Error("Failed to fetch routes.");
        this.$refs.mapRef.showRoute();
        this.results = await response.json();
        this.dialog = true;
      } catch (error) {
        console.error("Error fetching routes:", error);
        // alert("Please choose another route or try again Later...");
        this.snackbarMessage = "Please choose another route or try again Later...";
          this.snackbarColor = 'red';
          this.snackbar = true; 
      }
    },
      async bookDelivery(route) {
      this.selectedRoute = route;
      this.dialog = false;

      if (!this.selectedRoute) {
        alert("Please select a route first.");
        return;
      }

      const payload = {
        start: this.selectedRoute.start,
        destination: this.selectedRoute.destination,
        routeId: this.selectedRoute.routeId,
        weight: this.weight,
        boardingTime: this.selectedRoute.boardingTime

      };

      try {
        const response = await fetch(`${this.$store.getters.getUrl}/api/godo/deliveryBooking?session=${this.sessionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // alert("Booking successful!");
          this.selectedRoute = null;
          // window.location.reload();

          this.snackbarMessage = "Booking successful!";
          this.snackbarColor = 'green';
          this.snackbar = true;        
            setTimeout(() => {
              this.$router.push(`/delivery?session=${this.sessionId}`);
                }, 2000);

        } else {
          const errorMessage = await response.text();
          alert("Error: " + errorMessage);
        }
      } catch (error) {
        console.error("Booking failed:", error);
        // alert("Failed to book travel.");
        this.snackbarMessage = "Booking failed";
          this.snackbarColor = 'red';
          this.snackbar = true;
      }
    },
    formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); 
    // Example Output: "20 Jan 2025"
  },
  formatTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }); 
    // Example Output: "09:30 AM"
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
  /* background-color: #EAEAEA; */
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