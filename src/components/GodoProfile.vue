<template>
  <div>
    <!-- Only Show Profile Container for New Users -->
    <div v-if="isNewProfile" class="profile-container">
      <div style="width: 400px">
        <v-container class="profile">
          <v-card class="mx-auto pa-5" max-width="500">
            <v-form @submit.prevent="saveProfile">
              <v-card-title class="d-flex justify-space-between align-center">
                <span>Create Profile</span>
                <v-btn color="#F4A261" type="submit">Save</v-btn>
              </v-card-title>
              <v-divider></v-divider>

              <!-- Profile Form Fields -->
              <v-text-field label="Name" v-model="profile.name" required></v-text-field>
              <v-text-field label="Address" v-model="profile.address" required></v-text-field>
              <v-text-field label="Age" v-model="profile.age" type="number" required></v-text-field>
              <v-select label="Gender" v-model="profile.gender" :items="['Male', 'Female', 'Other']"></v-select>
              <v-text-field label="Email" v-model="profile.email" type="email" required></v-text-field>
              <v-text-field label="Driving License" v-model="profile.drivingLicense"></v-text-field>
              <v-text-field label="Aadhar" v-model="profile.aadhar"></v-text-field>

            </v-form>
          </v-card>
        </v-container>
      </div>
    </div>

    <!-- Show the rest of the UI if NOT a new user -->
    <div v-else>
      <div>
        <div class="header">
          <div class="l1">
            <h3>GoDo</h3>
            <h4>Travel & Deliver</h4>
          </div>
          <div>
            <div class="l2">
              <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <router-link to="/home">Home</router-link>
                <router-link :to="`/drive?session=${sessionId}`" style="color: #324247;">Drive</router-link>
                <router-link :to="`/ride?session=${sessionId}`" style="color: #324247;">Ride</router-link>
                <router-link :to="`/delivery?session=${sessionId}`" style="color: #324247;">Delivery</router-link>
              </div>
              <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <a>About</a>
                <a style="color: #F4A261;" @click="goToProfile">Profile</a>
                <a @click="logout">Logout</a>
              </div>
            </div>
          </div>
        </div>

      <div class="profile-container">
        <div style="width: 400px">
        <v-container>
            <v-card class="mx-auto pa-5" max-width="500">
              <v-form @submit.prevent="saveProfile">
                <v-card-title class="d-flex justify-space-between align-center">
                  <span>{{ isNewProfile ? "Create Profile" : "Profile Information" }}</span>
                  <div>
                    <!-- Show Edit button when not editing and not a new profile -->
                    <v-btn v-if="!isEditing && !isNewProfile" color="#324247" @click="isEditing = true">
                      Edit
                    </v-btn>
                    <!-- Show Save button when editing or creating a new profile -->
                    <v-btn v-if="isEditing || isNewProfile" color="#F4A261" type="submit">
                      Save
                    </v-btn>
                  </div>
                </v-card-title>
                <v-divider></v-divider>

                <!-- Form Fields -->
                <v-text-field label="Name" v-model="profile.name" :readonly="!isEditing && !isNewProfile"></v-text-field>
                <v-text-field label="Address" v-model="profile.address" :readonly="!isEditing && !isNewProfile"></v-text-field>
                <v-text-field label="Age" v-model="profile.age" type="number" :readonly="!isEditing && !isNewProfile"></v-text-field>
                <v-select
                  label="Gender"
                  v-model="profile.gender"
                  :items="['Male', 'Female', 'Other']"
                  :readonly="!isEditing && !isNewProfile"
                ></v-select>
                <v-text-field label="Email" v-model="profile.email" type="email" :readonly="!isEditing && !isNewProfile"></v-text-field>
                <v-text-field
                  v-if="profile.phoneNumber"
                  label="Phone Number"
                  v-model="profile.phoneNumber"
                  readonly
                ></v-text-field>
                <template v-if="isEditing || isNewProfile">
                  <v-text-field label="Driving License" v-model="profile.drivingLicense"></v-text-field>
                  <v-text-field label="Aadhar" v-model="profile.aadhar"></v-text-field>
                </template>
                <v-btn v-if="isEditing" color="red" @click="showConfirm = true">Delete Account</v-btn>


                <!-- <v-text-field
                  v-if="profile.lastUpdate"
                  label="Last Updated"
                  v-model="formattedDate"
                  readonly
                ></v-text-field> -->
              </v-form>
            </v-card>
          </v-container>
          </div>


          <div>
            
        <div style="width: 400px">
        <v-container>
          <v-card class="mx-auto pa-5" >
          <v-form @submit.prevent="addVehicle">
            <v-card-title class="d-flex justify-center align-center">
              Add Vehicle
            </v-card-title>
            <v-divider></v-divider>

            <v-select
              label="Vehicle Type"
              v-model="vehicle.vehicleType"
              :items="['Bike', 'Car', 'Heavy']"
              required
            ></v-select>

            <v-text-field 
              label="Vehicle Name" 
              v-model="vehicle.vehicleName" 
              required
            ></v-text-field>

            <v-text-field 
              label="Registration No"
              v-model="vehicle.registrationNo"
              :rules="[registrationNoRule]" 
              @input="vehicle.registrationNo = vehicle.registrationNo.toUpperCase()"
              required
            ></v-text-field>

            <v-text-field 
              label="Chassis No" 
              v-model="vehicle.chassisNo"
              @input="vehicle.chassisNo = vehicle.chassisNo.toUpperCase()"
              required
            ></v-text-field>

            <v-text-field 
              label="Capacity"
              v-model="vehicle.capacity"
              type="number"
              :rules="[capacityRule]"
              min="2"
              required
              outlined
            ></v-text-field>

            <v-field label="RC Book">
              <input type="file" @change="handleFileUpload" class="input-field" required style="padding-left: 100px;"/>
            </v-field>


            <v-btn style="margin-left:40%;margin-top: 20px;" type="submit" color="#324247">Add</v-btn>
          </v-form>
        </v-card>
        </v-container>
      </div>
          </div>
      </div>
      
          <v-container>
          <v-card class="pa-4">
            <v-card-title class="d-flex justify-center align-center">Vehicle Details</v-card-title>
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
                <v-text-field label="Vehicle Name" v-model="editedVehicle.vehicleName"></v-text-field>
                <!-- <v-text-field label="Registration No." v-model="editedVehicle.registrationNumber"></v-text-field> -->
                <v-select 
                  label="Status" 
                  v-model="editedVehicle.status"
                  :items="['Inactive','Request']">
                </v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn color="red" @click="deleteVehicle(editedVehicle.vehicleId)">Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue" @click="updateVehicle">Save</v-btn>
                <v-btn @click="editDialog = false">Cancel</v-btn>
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

    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      profile: {
        name: "",
        address: "",
        age: "",
        gender: "",
        email: "",
        phoneNumber: "",
        drivingLicense: "",
        aadhar: "",
        lastUpdate: ""
      },
      vehicle: {
        vehicleType: "",
        vehicleName: "",
        registrationNo: "",
        chassisNo: "",
        rcBook: null,
        capacity: "",
      },
      vehicles: [],
      registrationNoRule: value => {
        const pattern = /^[A-Z]{2}\d{2}[A-Z]{0,2}\d{4}$/;
        return pattern.test(value) || "Invalid registration number format (e.g., KL11AB1234)";
      },

      capacityRule: value => {
        if (this.vehicle.vehicleType === "Bike") return value == 2 || "Bike capacity must be 2";
        if (this.vehicle.vehicleType === "Car") return (value >= 5 && value <= 7) || "Car capacity: 5-7";
        if (this.vehicle.vehicleType === "Heavy") return (value >= 5 && value <= 10) || "Heavy capacity: 5-10";
        return "Select a valid vehicle type";
      },

      isEditing: false,
      isNewProfile: this.$route.query.isNewUser === "true",
      sessionId: this.$route.query.session || localStorage.getItem("sessionId") || "",
      rcBookURL: null,
      showRcBookPopup: false,
      editDialog: false,
      editedVehicle: {},
      showConfirm: false,
    };
    
  },
  computed: {
    formattedDate() {
      return this.profile.lastUpdate ? new Date(this.profile.lastUpdate).toLocaleString() : "";
    }
  },
  async mounted() {
    if (!this.sessionId) {
      alert("Session expired. Please log in again.");
      this.$router.push("/");
      return;
    }

    // If user is new, do not fetch profile (force profile creation)
    if (this.isNewProfile) return;

    try {
      const response = await fetch(`${this.$store.getters.getUrl}/api/godo/viewProfile?session=${this.sessionId}`);
      if (!response.ok) throw new Error("Profile fetch failed");

      const data = await response.json();

      if (data.name && data.email) {
        this.profile = data;
      } else {
        this.isNewProfile = true;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      this.isNewProfile = true;
    }
    this.fetchVehicles();
  },
  methods: {
    async saveProfile() {
      if (!this.sessionId) {
        alert("Session expired. Please log in again.");
        this.$router.push("/");
        return;
      }

      try {
        const url = this.isNewProfile
          ? `${this.$store.getters.getUrl}/api/godo/profile?session=${this.sessionId}`
          : `${this.$store.getters.getUrl}/api/godo/updateProfile?session=${this.sessionId}`;

        const method = this.isNewProfile ? "POST" : "PUT";
        // console.log(method);
        

        let profileData = { ...this.profile };

        if (this.isNewProfile) {
          delete profileData.phoneNumber;
          delete profileData.lastUpdate;
        }

        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData)
        });

        if (!response.ok) throw new Error("Profile save failed");

        alert("Profile saved successfully!");
        if(this.isNewProfile){
          this.$router.push(`/home?session=${this.sessionId}`);

        }
        this.isNewProfile = false;
        this.isEditing = false;
        localStorage.removeItem("isNewProfile");
        localStorage.removeItem("isNewUser");
        

      } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile. Please try again.");
      }
    },
    logout() {
      localStorage.removeItem("sessionId");
      this.$router.push("/");
    },
    async addVehicle() {
  try {
    const vehicleDetails = {
      vehicleType: this.vehicle.vehicleType,
      vehicleName: this.vehicle.vehicleName,
      registrationNumber: this.vehicle.registrationNo,
      chassisNumber: this.vehicle.chassisNo,
      capacity: this.vehicle.capacity
    };

    const formData = new FormData();
    formData.append("rcBook", this.vehicle.rcBook);  // Attach the file
    formData.append("vehicleDetails", JSON.stringify(vehicleDetails)); // Convert JSON to string

    console.log("FormData before sending:", formData);

    // const payload ={
    //   session : this.sessionId,
    //   formData: this.formData
    // }

    // const response = await this.$store.dispatch('addVehicle',payload);


    const response = await axios.post(
      `${this.$store.getters.getUrl}/api/godo/addVehicle?session=${this.sessionId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      alert("Vehicle added successfully!");
      this.resetForm();
      this.vehicles.push(response.data);

    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    alert("Failed to add vehicle.");
  }
},

resetForm() {
  this.vehicle = { 
    vehicleType: "", 
    vehicleName: "", 
    registrationNo: "", 
    chassisNo: "", 
    rcBook: null, 
    capacity: "" 
  };
},
handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (optional)
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a PNG, JPEG, or PDF.");
        return;
      }

      // Store the file in data
      this.vehicle.rcBook = file;

      // Optionally, convert the file to Base64 for preview or upload
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.vehicle.rcBookPreview = reader.result; // Store preview URL if needed
      };

      console.log("File uploaded:", file.name);
    }
  },
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
      this.editedVehicle = { ...vehicle };
      this.editDialog = true;
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
    async deleteVehicle(vehicleId) {
      try {
        await axios.delete(`${this.$store.getters.getUrl}/api/godo/deleteVehicle/${vehicleId}`);
        this.vehicles = this.vehicles.filter(v => v.vehicleId !== vehicleId);
        this.editDialog = false;
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    },
    async deleteAccount() {

      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        this.showConfirm = false; // Close dialog immediately

        try {
          // await this.$axios.delete(`/api/godo/deleteProfile/${this.sessionId}`);
          alert("Account deleted successfully");
          localStorage.clear(); // Clear user data
          this.$router.push("/"); // Redirect to login
        } catch (error) {
          console.error("Error deleting account:", error);
          alert("Failed to delete account.");
        }
      }
    },


  },
  
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

.profile-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 200px;
  background-image: url(/src/assets/bike.webp);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;  
}


@media (max-width: 600px) {
  .l2 {
    flex-direction: column;
  }
  .content{
    flex-direction: column;
  }
  .profile-container{
    flex-direction: column;
    align-items: center;
    gap:10px

  }
}
</style>
