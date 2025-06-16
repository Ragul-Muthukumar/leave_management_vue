<template>
  <div>
    <Navbar />
    <div class="content">
      <h1>Leaves</h1>

      <div class="form-section">
        <input v-model="emailSearch" type="text" placeholder="Search by email..." class="search-input" />
      </div>

      <div class="leave-grid">
        <div class="leave-card" v-for="leave in filteredLeaves" :key="leave.id">
          <h3>Email: {{ leave.email }}</h3>
          <p><strong>Name:</strong> {{ leave.name }}</p>
          <p><strong>Start:</strong> {{ formatDate(leave.start_date) }}</p>
          <p><strong>End:</strong> {{ formatDate(leave.end_date) }}</p>
          <p><strong>Reason:</strong> {{ leave.reason }}</p>

          <div class="status-section">
            <template v-if="leave.status === 0">
              <button class="approve-btn" @click="approveUser(leave.id)">Approve</button>
              <button class="reject-btn" @click="rejectUser(leave.id)">Reject</button>
            </template>
            <template v-else-if="leave.status === 1">
              <span class="status approved">Approved</span>
            </template>
            <template v-else-if="leave.status === 2">
              <span class="status rejected">Rejected</span>
            </template>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading more leaves...</div>
      <div v-if="allLoaded" class="loading">All leaves loaded.</div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      leaves: [],
      emailSearch: '',
      form: {
        start_date: '',
        end_date: '',
        reason: ''
      },
      page: 1,
      perPage: 5,
      loading: false,
      allLoaded: false
    }
  },
  computed: {
    filteredLeaves() {
      if (!this.emailSearch) return this.leaves
      return this.leaves.filter(leave =>
        leave.email && leave.email.toLowerCase().includes(this.emailSearch.toLowerCase())
      )
    }
  },
  methods: {
    async fetchLeaves() {
      if (this.loading || this.allLoaded) return

      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const apiBase = import.meta.env.VITE_API_BASE_URL

        const res = await axios.get(`${apiBase}/leaves`, {
          params: {
            page: this.page,
            per_page: this.perPage
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const newLeaves = res.data.data
        if (newLeaves.length < this.perPage) {
          this.allLoaded = true
        }

        this.leaves.push(...newLeaves)
        this.page++
      } catch (error) {
        console.error('Error fetching leaves:', error)
      } finally {
        this.loading = false
      }
    },
    handleScroll() {
      const scrollPosition = window.innerHeight + window.scrollY
      const bottom = document.documentElement.offsetHeight - 100

      if (scrollPosition >= bottom) {
        this.fetchLeaves()
      }
    },
    async changeStatus(leaveId, newStatus) {
      try {
        const token = localStorage.getItem('token')
        const apiBase = import.meta.env.VITE_API_BASE_URL

        await axios.put(`${apiBase}/leaves/${leaveId}/status`, {
          status: newStatus
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const leave = this.leaves.find(l => l.id === leaveId)
        if (leave) leave.status = newStatus
      } catch (error) {
        console.error('Failed to update leave status:', error)
      }
    },
    formatDate(date) {
      return dayjs(date).format('MMMM DD YYYY')
    },
    async approveUser(leaveId) {
      try {
        const token = localStorage.getItem('token')
        const apiBase = import.meta.env.VITE_API_BASE_URL

        await axios.patch(`${apiBase}/leaves/${leaveId}/approve`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

      const leave = this.leaves.find(l => l.id === leaveId)
        if (leave) leave.status = 1
      } catch (error) {
        console.error('Error approving user:', error)
      }
    },

    async rejectUser(leaveId) {
      try {
        const token = localStorage.getItem('token')
        const apiBase = import.meta.env.VITE_API_BASE_URL

        await axios.patch(`${apiBase}/leaves/${leaveId}/reject`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const leave = this.leaves.find(l => l.id === leaveId)
        if (leave) leave.status = 2
      } catch (error) {
        console.error('Error rejecting user:', error)
      }
    }

  },
  mounted() {
    this.fetchLeaves()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.content {
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.leave-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.leave-form input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.leave-form button {
  padding: 8px 14px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.leave-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .leave-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1025px) {
  .leave-grid {
    grid-template-columns: 1fr;
  }
}

.leave-card {
  background-color: #f0f0f0;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;
}

.leave-card:hover {
  background-color: #e0e0e0;
}

.status-section {
  margin-top: 10px;
}

.approve-btn,
.reject-btn {
  padding: 6px 10px;
  margin-right: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
}

.approve-btn {
  background-color: #2ecc71;
  color: white;
}

.reject-btn {
  background-color: #e74c3c;
  color: white;
}

.status {
  font-weight: bold;
}

.status.approved {
  color: #2ecc71;
}

.status.rejected {
  color: #e74c3c;
}

.loading {
  text-align: center;
  margin-top: 20px;
  color: #777;
}
.action-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.approve-btn,
.reject-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: 0.2s ease;
}

.approve-btn {
  background-color: #4caf50;
  color: white;
}

.reject-btn {
  background-color: #f44336;
  color: white;
}

.approve-btn:hover {
  background-color: #43a047;
}

.reject-btn:hover {
  background-color: #e53935;
}

</style>
