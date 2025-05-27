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
          <router-link to="/about" :style="{ color: '#F4A261' , textDecoration: 'none' }">About</router-link>
          <router-link to="/" :style="{ color: '#324247', textDecoration: 'none' }">Login</router-link>
          
        </div>

      </div>
    </div>
  </div>
  
      <div class="about-container">
        <h1>About GoDo</h1>
        <p>
          <strong>GoDo</strong> is a smart platform that blends ride-sharing and delivery services into a single experience.
          Whether you're commuting to a destination or sending a package, GoDo lets you find or offer space in a vehicle
          that's already on the move.
        </p>
  
        <div class="section">
          <h2>👤 For Vehicle Owners</h2>
          <p>
            Maximize your earnings by sharing your travel space with others. Whether it's people or parcels, GoDo helps you earn on the go.
          </p>
        </div>

        <div class="section">
          <h2>🚗 For Travelers</h2>
          <p>
            Need a ride? Book a seat in a trusted vehicle heading your way. Affordable, reliable, and environmentally friendly.
          </p>
        </div>
  
        <div class="section">
          <h2>📦 For Senders</h2>
          <p>
            Send packages securely with travelers who are already going in the right direction. Track delivery in real-time.
          </p>
        </div>
  
        
  
        <div class="contact">
          <h2>Contact Us</h2>
          <p>Email: support@godo</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
    
    }
  }
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
  .about-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 2rem;
  background-color: #fdfdfd;
  border-radius: 10px;
  border: 1px solid #ccc;
  color: #324247;
  line-height: 1.8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about-container h1 {
  color: #F4A261;
  margin-bottom: 1.2rem;
  text-align: center;
  font-size: 2.5rem;
}

.section {
  margin-top: 2rem;
}

.section h2 {
  color: #324247;
}

.contact {
    text-align: center;
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #ccc;
}

@media (max-width: 600px) {
  .l2 {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5em;
  }

  .about-container {
    margin: 20px;
    padding: 1rem;
  }
  }
  </style>
  