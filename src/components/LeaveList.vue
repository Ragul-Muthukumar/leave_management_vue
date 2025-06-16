<template>
  <div class="leave-list">
    <h2>My Leave Applications</h2>

    <div v-if="leaves.length === 0" class="empty">No leave applications found.</div>

    <div v-for="leave in leaves" :key="leave.id" class="leave-card">
      <div class="leave-dates">
        <strong>{{ formatDate(leave.start_date) }} → {{ formatDate(leave.end_date) }}</strong>
      </div>
      <p>{{ leave.reason }}</p>
      <span class="status" :class="statusClass(leave.status)">
        {{ statusLabel(leave.status) }}
      </span>
    </div>

    <div ref="bottom" class="bottom-sentinel"></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    newLeave: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      leaves: [],
      page: 1,
      perPage: 5,
      hasMore: true,
      loading: false,
      observer: null
    }
  },
  watch: {
    newLeave(newVal) {
      if (newVal && !this.leaves.find(l => l.id === newVal.id)) {
        this.leaves.unshift(newVal)
      }
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(date).toLocaleDateString(undefined, options)
    },
    statusLabel(status) {
      switch (status) {
        case 0: return 'Pending'
        case 1: return 'Approved'
        case 2: return 'Rejected'
        default: return 'Unknown'
      }
    },
    statusClass(status) {
      switch (status) {
        case 0: return 'pending'
        case 1: return 'approved'
        case 2: return 'rejected'
        default: return ''
      }
    },
    async fetchLeaves() {
      if (this.loading || !this.hasMore) return
      this.loading = true
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL
        const token = localStorage.getItem('token')
        const res = await axios.get(`${apiBase}/leaves?page=${this.page}&limit=${this.perPage}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = res.data.data || res.data
        this.leaves.push(...data)
        if (data.length < this.perPage) {
          this.hasMore = false
        } else {
          this.page++
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    initObserver() {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.fetchLeaves()
        }
      })

      if (this.$refs.bottom) {
        this.observer.observe(this.$refs.bottom)
      }
    }
  },
  mounted() {
    this.fetchLeaves()
    this.$nextTick(() => this.initObserver())
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  }
}
</script>

<style scoped>
.leave-list {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  color: #888;
  margin-top: 40px;
}

.leave-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  background: #f9f9f9;
}

.leave-dates {
  font-weight: bold;
  margin-bottom: 6px;
}

.status {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  color: #fff;
}

.status.pending {
  background-color: #fbc02d;
}

.status.approved {
  background-color: #43a047;
}

.status.rejected {
  background-color: #e53935;
}

.bottom-sentinel {
  height: 1px;
}
</style>
