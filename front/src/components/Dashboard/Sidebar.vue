<template>
  <div class="pt-6">
    <div class="my-3" v-for="(item, i) in menu" :key="i">
      <b-button
        :type="$route.name === item.to.name ? 'is-primary-light' : ''"
        :icon-left="item.icon"
        :label="item.label"
        expanded
        size="is-medium"
        class="has-text-weight-bold is-justify-content-start"
        @click="goTo(item.to)"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          label: 'Dashboard',
          icon: 'view-dashboard',
          to: { name: 'Dashboard' }
        },
        {
          label: 'Profile',
          icon: 'account',
          to: { name: 'Dashboard' }
        },
        {
          label: 'Setting',
          icon: 'settings',
          to: { name: 'Dashboard' }
        },
        {
          label: 'Logout',
          icon: 'logout',
          to: { name: 'Dashboard' }
        },
        {
          label: 'Help',
          icon: 'help-circle',
          to: { name: 'Dashboard' }
        },
      ],
    }
  },
  methods: {
    async goTo(to) {
      if (this.$route.name !== to.name) {
        this.$router.replace(to);
      }
    },
  }
}
</script>

<style>

</style>