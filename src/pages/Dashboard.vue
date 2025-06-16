<template>
  <div class="users-container">
    <Navbar />
    <h2>Employees</h2>

    <input
      v-model="search"
      @input="onSearch"
      type="text"
      placeholder="Search users..."
      class="search-bar search-input"
    />

    <div class="user-grid" @scroll.passive="handleScroll" ref="scrollContainer">
      <div
        v-for="user in displayedUsers"
        :key="user.id"
        class="user-card"
      >
        <h3>{{ user.name }}</h3>
        <p>Email: {{ user.email }}</p>
        <p>Position: {{ user.role === 0 ? 'Employee' : user.role === 1 ? 'Manager' : 'N/A' }}</p>
      </div>

      <div v-if="loading" class="loading">Loading more users...</div>
      <div v-if="noMoreData && displayedUsers.length > 0" class="no-more">No more users</div>
      <div v-if="!loading && displayedUsers.length === 0" class="no-more">No users found</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'Users',
  components: {
    Navbar
  },
  data() {
    return {
      displayedUsers: [],
      page: 1,
      search: '',
      loading: false,
      noMoreData: false,
      searchDebounceTimeout: null,
    }
  },
  mounted() {
    this.loadNextBatch()
  },
  methods: {
    async loadNextBatch() {
        if (this.loading || this.noMoreData) return
        this.loading = true

        try {
            const token = localStorage.getItem('token')
            const apiBase = import.meta.env.VITE_API_BASE_URL

            const response = await axios.get(`${apiBase}/users`, {
            params: { page: this.page, search: this.search.trim() },
            headers: { Authorization: `Bearer ${token}` }
            })

            const users = response.data.data.data

            if (Array.isArray(users) && users.length > 0) {
            this.displayedUsers.push(...users)
            this.page++
            } else {
            this.noMoreData = true
            }
        } catch (error) {
            console.error('Error loading users:', error)
            this.noMoreData = true
        }

        this.loading = false
        }
,
    handleScroll() {
      const el = this.$refs.scrollContainer
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        this.loadNextBatch()
      }
    },
    onSearch() {
      clearTimeout(this.searchDebounceTimeout)
      this.searchDebounceTimeout = setTimeout(() => {
        this.resetUsers()
      }, 500)
    },
    resetUsers() {
      this.page = 1
      this.displayedUsers = []
      this.noMoreData = false
      this.loadNextBatch()
    }
  }
}
</script>

<style scoped>
.users-container {
  padding: 20px;
  background: #f9f9f9;
  min-height: 100vh;
}

h2 {
  margin-bottom: 10px;
  color: #333;
}

.search-bar {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.user-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) and (max-width: 1024px) {
  .user-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .user-grid {
    grid-template-columns: 1fr;
  }
}

.user-card {
  background: #f2f2f2;
  padding: 16px;
  border-radius: 10px;
  transition: 0.3s ease;
}

.user-card:hover {
  background: #e4e4e4;
}

.loading,
.no-more {
  grid-column: 1 / -1;
  text-align: center;
  color: #888;
  padding: 10px;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
