<template>
  <div class="pt-6">
    <div>
      <img src="@/assets/logo.svg" alt="">
    </div>
    <div class="my-3" v-for="(item, i) in menu" :key="i">
      <b-button
        :type="$route.name === item.to.name ? 'is-primary-light' : 'is-transparent'"
        :icon-left="item.icon"
        :label="item.label"
        expanded
        size="is-medium"
        class="has-text-weight-bold has-text-primary is-justify-content-start"
        @click="goTo(item.to)"
        v-if="item.label !== 'Logout'"/>
      <b-button
        type="is-transparent"
        :icon-left="item.icon"
        :label="item.label"
        expanded
        size="is-medium"
        class="has-text-weight-bold has-text-primary is-justify-content-start"
        @click="logout()"
        v-else/>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { auth } from '@/pluging/firebase';

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
          to: { name: 'Profile' }
        },
        {
          label: 'Settings',
          icon: 'settings',
          to: { name: 'Settings' }
        },
        {
          label: 'Logout',
          icon: 'logout',
          to: { name: '' },
        },
        {
          label: 'Help',
          icon: 'help-circle',
          to: { name: 'Help' }
        },
      ],
    }
  },
  methods: {
    ...mapMutations({
      resetStore: 'RESET',
    }),
    async goTo(to) {
      if (this.$route.name !== to.name) {
        this.$router.replace(to);
      }
    },
    async logout() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        await auth.signOut();
        this.resetStore();
        this.$router.push('/');
        loadingComponent.close();
      } catch (error) {
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
        });
        loadingComponent.close();
      }
    },
  }
}
</script>

<style>

</style>