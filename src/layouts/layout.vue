<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow p-4 flex justify-between">
      <h1 class="text-lg font-bold">Leave Management System</h1>
      <slot name="nav" />
    </nav>
    <main class="p-4">
      <slot />
    </main>
  </div>
</template>
