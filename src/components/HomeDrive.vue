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
                    <router-link to="/home" style="color: #F4A261;">Home</router-link>
                    <router-link :to="`/drive?session=${sessionId}`" style="color: #324247;">Drive</router-link>
                    <router-link :to="`/ride?session=${sessionId}`" style="color: #324247;">Ride</router-link>
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
          

            <div style="display: flex; flex-direction: column; align-items: center;width: 400px;">

                <div style="display: flex;flex-direction: column; align-items: center; width: 400px;">
                    <button class="button" style="background-color: #324247; color :white; border-bottom: none; border-bottom-left-radius: 0px;border-bottom-right-radius: 0px;">Take Drive</button>
                    <div style="display: flex;flex-direction: row;">
                        <button class="button" style="background-color:#EAEAEA;color: #324247; border-color: #324247; border-bottom: none; border-bottom-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;" @click="toHomeRide">Book Ride</button>
                        <button class="button" style="background-color: #EAEAEA; color: #324247; border-color: #324247;border-left: none; border-bottom: none;border-bottom-right-radius: 0px;border-top-left-radius: 0px; border-bottom-left-radius: 0px;" @click="toHomeDelivery">Book Delivery</button>
                    </div>
                </div>

                <div style="border: 2px solid;border-radius: 10px;border-top-left-radius: 0px;border-top-right-radius: 0px; width: 350px; display: flex;flex-direction: column;align-items: center;padding-left: 2em;padding-right: 2em;">
                    
                      <v-select class="input-group"
                        v-model="selectedVehicleId"
                        label="Vehicle"
                        :items="vehicles.filter(v => v.status === 'Active')"
                        item-title="vehicleName"
                        item-value="vehicleId"
                        @update:modelValue="updateVehicleCapacity"
                        @click="fetchVehicles"
                      ></v-select>

          
                    <v-text-field class="input-group"
                      label="Starting point" 
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
                      v-model="destination" 
                      required
                    ></v-text-field>
                    
                    <v-field class="input-group">
                        <input type="date" v-model="date">
                        <input type="time" v-model="time">
                    </v-field>
                    <v-field class="input-group" label="Vacancy">
                      <template v-slot:default>
                        <div class="d-flex align-center" style="gap: 10px; padding-left: 100px;">
                          <v-btn icon variant="text" color="#324247" @click="decreaseVacancy">
                            <v-icon>mdi-minus-circle-outline</v-icon>
                          </v-btn>
                          <span>{{ vacancy }}</span>
                          <v-btn icon variant="text" color="#324247" @click="increaseVacancy">
                            <v-icon>mdi-plus-circle-outline</v-icon>
                          </v-btn>
                        </div>
                      </template>
                    </v-field>

                    
                    
                    <button class="button" style="color: white; background-color: #324247;" @click="addDrive()">Continue</button>
                </div>
            </div>
            <div>
                
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
            </div>
        
        </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

  export default {
    data() {
      const now = new Date();
    return {
        sessionId: this.$route.query.session || localStorage.getItem("sessionId") || "",
        // isNewUser: this.$route.query.isNewUser === "true",
        vehicle: "",
        vacancy: 1,
        date: now.toLocaleDateString("en-CA"), 
        time: now.toTimeString().slice(0, 5), 
        startingPoint: "", // Selected place
        suggestions: [],
        destination: "",
        vehicles: [],
        selectedVehicleId: "",
        selectedVehicleCapacity: 0,
        fetched: false,
        mapCenter: { lat: 9.6878, lng: 76.3354 },
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
      async fetchVehicles() {
      if (!this.sessionId) {
        alert("Please enter a session ID");
        return;
      }

      if (this.fetched) return; // Prevent unnecessary API calls

      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/godo/vehicles?session=${this.sessionId}`);

        this.vehicles = response.data;
        this.fetched = true; // Set to true after fetching once
          

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
    updateVehicleCapacity() {
      const selectedVehicle = this.vehicles.find(vehicle => vehicle.vehicleId === this.selectedVehicleId);
      this.selectedVehicleCapacity = selectedVehicle ? selectedVehicle.capacity : 0;
      
    },
      async addDrive(){
        const dateTimeString = `${this.date}T${this.time}:00`; // "2025-01-20T09:00:00"

        if (
              !this.sessionId ||
              !this.selectedVehicleId ||
              !this.vacancy ||
              !this.date ||
              !this.time ||
              !this.startingPoint ||
              !this.destination
            ) {
              alert("Please fill in all fields before adding a drive.");
              return;
            }
        const payload ={
          sessionId: this.sessionId,
          vehicleId: this.selectedVehicleId,
          data:{
          vacancy: this.vacancy,
          boardingTime: dateTimeString,
          start: this.startingPoint,
          destination: this.destination
          }
          
        }
      try{
        
        const response = await this.$store.dispatch('addDrive',payload)
        if(response){
          console.log("Drive added!");
          alert("Drive added successfully!");
          this.$router.push(`/drive?session=${this.sessionId}`);
          
        }
      }catch (error){
        this.errorMessage = 'Failed to send OTP. Please try again.';
      }
    },
      async goToProfile() {
        if (!this.sessionId) {
          alert("Session expired. Please log in again.");
          this.$router.push("/");
          return;
        }
        this.$router.push(`/profile?session=${this.sessionId}`);
      },
      toHomeDelivery(){
      this.$router.push(`/homedelivery?session=${this.sessionId}`);
      
    },
    toHomeRide(){
      this.$router.push(`/home?session=${this.sessionId}`);
      
    },
      logout() {
        localStorage.removeItem("sessionId");
        this.$router.push("/");
      },
      increaseVacancy() {
        if(this.vacancy<this.selectedVehicleCapacity-1){
          this.vacancy++;

        }

      },
      decreaseVacancy() {
        if (this.vacancy > 1) {
          this.vacancy--;
        }
      },
      async fetchPlaceSuggestions(query) {
      if (!query) {
        this.suggestions = [];
        return;
      }

      const apiKey = "AIzaSyAmUrMggmOI2LemyeYrc-uHm5hMnRBKz98"; // Replace with your API Key
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=geocode&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.predictions) {
          this.suggestions = data.predictions.map((place) => place.description);
        }
      } catch (error) {
        console.error("Error fetching place suggestions:", error);
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
  