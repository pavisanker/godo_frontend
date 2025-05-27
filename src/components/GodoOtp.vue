<template>
  <div>
  <div class="header">
    <div class="l1">
      <h3>GoDo</h3>
      <h4>Travel & Deliver</h4>
    </div>
    <div>
      <div class="l2">
        <div style="display: flex;flex-direction: row;justify-content: space-between;">
            <a>Welcome...</a>
        </div>
        <div style="display: flex;flex-direction: row;justify-content: space-between;">
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link to="/" :style="{ color: !showDialog ? '#F4A261' : '#324247', textDecoration: 'none' }">Login</router-link>
          <router-link to="#" @click="showDialog = true" :style="{ color: showDialog ? '#F4A261' : '#324247', textDecoration: 'none' }">
            Admin
          </router-link>

        </div>

      </div>
    </div>
  </div>
  
    <div class="content" v-if="!showDialog">
      <form v-if="!otpSent" @submit.prevent="sendOTP">
      <input v-model="phoneNumber" type="text" placeholder="Enter phone number" required @input="ensureCountryCode" @click="ensureCountryCode"/>
      <button id = "b1" type="submit">Continue</button>
    </form>
    <form v-if="otpSent" @submit.prevent="verifyOTP">
      <input v-model="otp" type="text" placeholder="Enter OTP" required />
      <button id = "b1" type="submit">Verify OTP</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
    
    <!-- Password Dialog -->
    <v-dialog v-model="showDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Enter Admin Password</v-card-title>
        <v-card-text>
          <v-text-field v-model="username" label="Username" type="username" outlined></v-text-field>
          <v-text-field v-model="password" label="Password" type="password" outlined></v-text-field>
          <p v-if="errorAdminMessage" class="text-danger">{{ errorAdminMessage }}</p>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="d-flex justify-space-between">
          <v-btn color="red" @click="showDialog = false">Cancel</v-btn>
          <v-btn color="green" @click="verifyPassword">Login</v-btn>
        </v-card-actions>
       
      </v-card>
    </v-dialog>
  
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

// import { useRouter } from 'vue-router';

export default {
  // setup() {
  //   const router = useRouter();
  //   return { router };
  // },
  data() {
    return {
      phoneNumber: '',
      otp: '',
      otpSent: false,
      // sessionId: null,
      errorMessage: '',
      isNewUser: false,
      showDialog: false,
      username: '',
      password: '',
      errorAdminMessage: '',
    };
  },
  computed: {
    ...mapGetters(['getSessionId']),
    sessionId(){
      return this.getSessionId
      // return ' 7ea75b90-4cbf-4919-969f-48a623a2dfef' //Manual sessionId
    }
  },
  methods: {
    async sendOTP() {

      try{
        const response = await this.$store.dispatch('login',JSON.stringify({ phoneNumber: this.phoneNumber }))
        if(response){
          this.otpSent = true;
        }
      }catch (error){
        this.errorMessage = 'Failed to send OTP. Please try again.';
      }
    },
    async verifyOTP() {
  const payload = {
    sessionId: this.sessionId,
    otp: this.otp
  };

  try {
    const response = await this.$store.dispatch('verify', payload);

    if (!response) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.data;

    if (data.message === 'OTP Verified Successfully') {
      console.log("otp:", this.sessionId);
      console.log("user:", data.isNewUser);

      // Ensure newUser is correctly assigned
      // this.newUser = data.isNewUser.value;
      // console.log("usercondition",this.newUser);
      

      // Redirect based on user type
      if (!data.isNewUser) { // If newUser is false
        this.$router.push(`/home?session=${this.sessionId}`);
      } else { // If newUser is true
        this.$router.push(`/home?session=${this.sessionId}&isNewUser=${data.isNewUser}`);
      }
    } else {
      this.errorMessage = data.message;
    }
  } catch (error) {
    this.errorMessage = 'Invalid OTP. Please try again.';
  }
},

ensureCountryCode() {
      // If the input doesn't start with "+91", automatically insert it.
      if (!this.phoneNumber.startsWith('+91')) {
        // Remove any leading + or 91 that might be partially entered.
        const cleaned = this.phoneNumber.replace(/^[+]?91?/, '');
        this.phoneNumber = '+91' + cleaned;
      }
    },
    async verifyPassword() {
      try {
        const payload = {
          username: this.username,
          password: this.password
        }
        const response = await axios.post(`${this.$store.getters.getUrl}/api/admin/login`, payload);
        if (response.data.success) {
          this.showDialog = false;
          this.$router.push("/admin");
        } else {
          this.errorAdminMessage = "Incorrect password. Try again.";
        }
      } catch (error) {
        this.errorAdminMessage = "Server error. Please try again.";
      }
    },


  }
};
</script>

<style scoped>

.l1{
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
.l2{
    display: flex;
    flex-direction:row;
    padding-left: 2%;
    padding-right: 10%;
    padding-top: 1%;
    justify-content: space-between;
    background-color: #EAEAEA;
    
    
}
a{
  padding-left: 2em;
  padding-bottom: 1em;
}

/* General styling */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Container for the form */
.content {
  margin-top: 12%;
  margin-left:auto;
  margin-right: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}


/* Form styling */
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Input fields */
input[type="text"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
}

input[type="text"]:focus {
  border-color: #324247;
  outline: none;
}

/* Buttons */
#b1 {
  padding: 10px;
  background-color: #324247;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

#b1:hover {
  background-color: #F4A261;
  color: #324247;
}

/* Error message */
p {
  color: red;
  text-align: center;
  font-size: 14px;
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
