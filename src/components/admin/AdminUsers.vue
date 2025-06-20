<template>
    <div>
      <h2>GoDo Users</h2>

      <v-container>
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">Details</v-card-title>
        <v-divider></v-divider>

        <v-table dense>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>UserId</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.phoneNumber">
              <td>{{ index + 1 }}</td>
              <td>{{ user.userId }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.address }}</td>
              <td>{{ user.phoneNumber }}</td>
              <td>{{ user.age }}</td>
              <td>{{ user.lastUpdate }}</td>
                    
            </tr>
          </tbody>
        </v-table>
      </v-card>

    </v-container>
    </div>
  </template>
  
  <script>
import axios from 'axios';

  export default {
    name: "AdminUsers",
  data() {
    return {
      users: [],
    };
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(`${this.$store.getters.getUrl}/api/admin/getUsers`);
        this.users = response.data.map(user => ({
          ...user,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
  }
};
</script>
  