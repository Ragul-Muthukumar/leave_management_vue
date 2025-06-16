<template>
  <div>
    <Navbar />
    <div class="content">
      <h1>Add Employee</h1>

      <form @submit.prevent="registerUser" class="form">
        <input v-model="form.name" type="text" placeholder="Name" required />
        <input v-model="form.email" type="email" placeholder="Email" required />
        <input v-model="form.password" type="password" placeholder="Password" required />
        
        <select v-model="form.role" required>
          <option value="" disabled>Select Role</option>
          <option value="0">Employee</option>
          <option value="1">Manager</option>
        </select>

        <button type="submit">Register</button>

        <p v-if="message" class="success">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import axios from 'axios'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        role: ''
      },
      message: ''
    }
  },
  methods: {
    async registerUser() {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL
        const response = await axios.post(`${apiBase}/register`, this.form)

        const token = response.data.token
        localStorage.setItem('auth_token', token)

        this.message = 'Employee registered successfully!'
        this.form = { name: '', email: '', password: '', role: '' }
      } catch (error) {
        console.error('Registration failed:', error.response?.data || error)
        this.message = 'Registration failed. Check console for error.'
      }
    }
  }
}
</script>

<style scoped>
.content {
  padding: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 10px;
}

input,
select,
button {
  padding: 10px;
  font-size: 16px;
}

.success {
  color: green;
}
</style>
