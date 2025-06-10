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
            <button class="button" style="background-color:#324247; border-color: #324247; border-bottom: none; border-bottom-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;">Book Ride</button>
            <button class="button" style="background-color: white; color: #324247; border-color: #324247; border-bottom: none;border-bottom-right-radius: 0px;border-top-left-radius: 0px; border-bottom-left-radius: 0px;" @click="toHomeDelivery">Book Delivery</button>
          </div>
        </div>
        
        <div style="border: 2px solid;border-radius: 10px;border-top-left-radius: 0px;border-top-right-radius: 0px; width: 350px; display: flex;flex-direction: column;align-items: center;padding-left: 2em;padding-right: 2em;">
          
          <v-text-field class="input-group"
                      label="Starting point" 
                      @input="startingPoint = startingPoint.toUpperCase()"
                      v-model="startingPoint" 
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
                      @input="destination = destination.toUpperCase()"
                      v-model="destination" 
                      required
                    ></v-text-field>
                    <!-- <MapView :startingPoint="startingPoint" :destination="destination" style="display: none;" /> -->


                  <v-field class="input-group" label="Passengers">
                    <template v-slot:default>
                      <div class="d-flex align-center" style="gap: 10px; padding-left: 100px;">
                        <v-btn icon variant="text" color="#324247" @click="decreasePassengers">
                          <v-icon>mdi-minus-circle-outline</v-icon>
                        </v-btn>
                        <span>{{ passengerCount }}</span>
                        <v-btn icon variant="text" color="#324247" @click="increasePassengers">
                          <v-icon>mdi-plus-circle-outline</v-icon>
                        </v-btn>
                      </div>
                    </template>
                  </v-field>
                <button class="button" style="color: white; background-color: #324247;" @click="searchRoutes">Search</button>
              </div>

              <!-- Popup Dialog to Show Search Results -->
              <v-dialog v-model="dialog" max-width="500px">
                <v-card class="rounded-lg">
                  <v-card-title class="text-h6 font-weight-bold text-center">
                    🚏 Available Routes
                  </v-card-title>

                  <v-card-text>
                    <v-row dense>
                      <v-col v-for="(route, index) in results" :key="index" cols="12">
                        <v-card class="route-card pa-3">
                          <v-card-title class="d-flex align-center justify-space-between px-0 pb-1">
                            <span class="text-body-1 font-weight-medium">
                              <v-icon color="green" class="mr-1">mdi-map-marker</v-icon>
                              {{ route.start }}
                              <v-icon color="blue" class="mx-2">mdi-arrow-right</v-icon>
                              {{ route.destination }}
                            </span>
                          </v-card-title>

                          <v-card-text class="px-0 py-1">
                            <v-row dense>
                              <v-col cols="6" class="d-flex align-center">
                                <v-icon color="orange" class="mr-2">mdi-seat</v-icon>
                                <b>Seats Available:</b>&nbsp;{{ route.vacancy }}
                              </v-col>

                              <v-col cols="6" class="d-flex align-center">
                                <v-icon color="orange" class="mr-2">mdi-car</v-icon>
                                <b>Vehicle:</b>&nbsp;{{ getVehicleType(route.capacity) }}
                              </v-col>

                              <v-col cols="6" class="d-flex align-center">
                                <v-icon color="orange" class="mr-2">mdi-ruler</v-icon>
                                <b>Distance:</b>&nbsp;{{ (route.distance / 1000).toFixed(1) }} Km
                              </v-col>

                              <v-col cols="6" class="d-flex align-center">
                                <v-icon color="green" class="mr-2">mdi-currency-inr</v-icon>
                                <b>Fare:</b>&nbsp;{{ (route.amount / 100).toFixed(2) }}
                              </v-col>

                              <v-col cols="6" class="d-flex align-center">
                                <v-icon color="red" class="mr-2">mdi-calendar</v-icon>
                                <b>{{ formatDate(route.boardingTime) }}</b>
                              </v-col>

                              <v-col cols="6" class="d-flex align-center">
                                <v-icon color="blue" class="mr-2">mdi-clock-time-four-outline</v-icon>
                                <b>{{ formatTime(route.boardingTime) }}</b>
                              </v-col>
                            </v-row>
                          </v-card-text>

                          <v-card-actions class="justify-end px-0 pt-2">
                            <v-btn color="primary" @click="openConfirm(route)">
                              Book {{ routeButtonLabel }}
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
        
        <v-dialog v-model="confirmDialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Confirm Booking</v-card-title>
            <v-card-text>
              Are you sure you want to book this route from 
              <b>{{ selectedRoute?.start }}</b> to <b>{{ selectedRoute?.destination }}</b>?
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn color="grey" text @click="confirmDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="confirmBooking">Yes, Book</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

  </div>
</template>

<script>
import MapView from './MapView.vue';

export default {
  components: { MapView },

  
  data() {
    return {
      sessionId: this.$route.query.session || localStorage.getItem("sessionId") || "",
      isNewUser: this.$route.query.isNewUser === "true",
      passengerCount: 1,
      startingPoint: "",
      destination: "",
      mapCenter: { lat: 9.6878, lng: 76.3354 },
      results: [], // Holds search results from backend
      dialog: false, // Controls the popup
      selectedRoute: null,
      snackbar: false,
      snackbarMessage: '',
      confirmDialog: false,

      
    };
  },
  async mounted() {
    if (!this.sessionId) {
      alert("Session expired. Please log in again.");
      this.$router.push("/");
      return;
    }
    // localStorage.setItem("sessionId", this.sessionId);
    if (this.isNewUser) {
      this.$router.push(`/profile?session=${this.sessionId}&isNewUser=true`);
    }
  },
  methods: {

    openConfirm(route) {
    this.selectedRoute = route
    this.confirmDialog = true
  },
  confirmBooking() {
    this.confirmDialog = false
    this.bookTravel(this.selectedRoute)
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
    toHomeDelivery(){
      this.$router.push(`/homedelivery?session=${this.sessionId}`);
      
    },
    logout() {
      localStorage.removeItem("sessionId");
      this.$router.push("/");
    },
    increasePassengers() {
      this.passengerCount++;
    },
    decreasePassengers() {
      if (this.passengerCount > 1) {
        this.passengerCount--;
      }
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
        const response = await fetch(`${this.$store.getters.getUrl}/api/godo/viewRoutes?start=${this.startingPoint}&destination=${this.destination}&passengerCount=${this.passengerCount}`);
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
    async bookTravel(route) {
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
        passengerCount: this.passengerCount,
        boardingTime: this.selectedRoute.boardingTime,
        distance: this.selectedRoute.distance,
        amount: this.selectedRoute.amount,

      };

      try {
        const response = await fetch(`${this.$store.getters.getUrl}/api/godo/travelBooking?session=${this.sessionId}`, {
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

          this.snackbarMessage = "Booking successful!"
          this.snackbarColor = 'green';
          this.snackbar = true;
          setTimeout(() => {
              this.$router.push(`/ride?session=${this.sessionId}`);
                }, 2000);

        } else {
          const errorMessage = await response.text();
          alert("Error: " + errorMessage);
        }
      } catch (error) {
        console.error("Booking failed:", error);
        // alert("Failed to book travel.");
        this.snackbarMessage = 'Failed to Book Ride';
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
  getVehicleType(capacity) {
    if (capacity == 2) return 'Bike';
    else if (capacity == 5) return 'Car';
    else if (capacity == 7) return 'Mini Van';
    else return 'Van/Bus';
  }
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
    gap:20px;

  }
}
</style>
