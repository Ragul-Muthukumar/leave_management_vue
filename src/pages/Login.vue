<template>
  <div class="login-container">
    <form class="login-box" @submit.prevent="handleLogin">
      <h2>Login to Leave Management System</h2>
      <div class="input-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Enter email" required />
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="Enter password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import api from '@/api/axios'


export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL
        const res = await axios.post(`${apiBase}/login`, {
          email: this.email,
          password: this.password
        })

        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))

        this.$router.push('/dashboard')
      } catch (err) {
        this.error = 'Invalid email or password'
      }
    }

  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f9fc;
  font-family: 'Segoe UI', sans-serif;
}

.login-box {
  background: white;
  padding: 30px 40px;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #2c3e50;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  color: #34495e;
}

.input-group input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccd6dd;
  border-radius: 6px;
  outline: none;
}

.input-group input:focus {
  border-color: #3498db;
}

button {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #2980b9;
}

.error {
  color: red;
  margin-top: 12px;
  text-align: center;
}
</style>
