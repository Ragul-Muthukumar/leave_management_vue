<template>
  <div>
    <Navbar />
    <div class="content">
      <h1>Apply Leave</h1>

      <form @submit.prevent="applyLeave" class="form">
        <input v-model="form.start_date" type="date" required />
        <input v-model="form.end_date" type="date" required />
        <textarea v-model="form.reason" placeholder="Reason" required rows="6"></textarea>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Submitting...' : 'Apply' }}
        </button>

        <p v-if="message" :class="{ success: success, error: !success }">
          {{ message }}
        </p>
      </form>

      <LeaveList :newLeave="newLeave" />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import LeaveList from '@/components/LeaveList.vue'
import axios from 'axios'

export default {
  components: {
    Navbar,
    LeaveList
  },
  data() {
    return {
      form: {
        start_date: '',
        end_date: '',
        reason: ''
      },
      message: '',
      success: false,
      loading: false,
      newLeave: null
    }
  },
  methods: {
    async applyLeave() {
      this.loading = true
      this.message = ''
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL
        const token = localStorage.getItem('token')

        const res = await axios.post(`${apiBase}/leaves`, this.form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        this.success = true
        this.message = 'Leave applied successfully!'
        this.newLeave = res.data?.data || res.data

        this.form = { start_date: '', end_date: '', reason: '' }
      } catch (error) {
        console.error('Error:', error.response?.data['message'] || error)
        this.success = false
        this.message = `Failed to apply leave. ${error.response?.data['message']}`
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  gap: 10px;
  margin-bottom: 40px;
}

input,
textarea,
button {
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  background-color: #2e7d32;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
