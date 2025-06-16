<template>
  <nav class="navbar">
    <div class="logo">Leave Management System</div>
   <ul class="nav-links" :class="{ open: isOpen }">
        <li v-if="isManager">
            <router-link 
            to="/dashboard" 
            :class="{ active: $route.path === '/dashboard' }"
            >Dashboard</router-link>
        </li>
        <li v-if="isManager">
            <router-link 
            to="/register" 
            :class="{ active: $route.path === '/register' }"
            >Add Employee</router-link>
        </li>
        <li v-if="isManager">
            <router-link 
            to="/leaves" 
            :class="{ active: $route.path === '/leaves' }"
            >Leaves</router-link>
        </li>
        <li>
            <a href="#" @click.prevent="logout">Logout</a>
        </li>
    </ul>

    <div class="menu-icon" @click="toggleMenu">
      <span :class="{ open: isOpen }"></span>
      <span :class="{ open: isOpen }"></span>
      <span :class="{ open: isOpen }"></span>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Navbar',
  data() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      isOpen: false,
      isManager: user.role === 1,
    }
  },
  beforeMount() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isManager = user.role === 1;
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    logout() {
        const token = localStorage.getItem('token');
        const apiBase = import.meta.env.VITE_API_BASE_URL;

        axios.post(`${apiBase}/logout`, {}, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$router.push('/login');
        }).catch(error => {
            console.error('Logout failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$router.push('/login');
        });
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.nav-links a:hover {
  text-decoration: underline;
}

.menu-icon {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.menu-icon span {
  width: 25px;
  height: 3px;
  background-color: white;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    flex-direction: column;
    background-color: #34495e;
    position: absolute;
    top: 60px;
    right: 0;
    padding: 20px;
    width: 200px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }

  .nav-links.open {
    display: flex;
  }

  .menu-icon {
    display: flex;
  }
}
</style>
