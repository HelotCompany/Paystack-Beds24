<template>
  <div class="container has-text-centered">
    <img src="@/assets/images/illustration-home.svg" class="my-6">
    <p class="is-size-5 has-text-weight-semibold mb-3">
      Your subscription is currently
      <span :class="styleSubcription">
        {{subscriptionLabel}}
      </span>
    </p>
    <b-button 
      type="is-primary"
      label="Subscribe"
      class="has-text-weight-bold px-6"
      @click="goToPortal()"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { createCustomerPortalSession } from '@/api';

export default {
  computed: {
    ...mapGetters({
      subscriptionLabel: 'subscriptionLabel',
      userId: 'userId',
    }),
    styleSubcription() {
      if (['Active', 'Trial'].includes(this.subscriptionLabel)) return 'has-text-success';
      return 'has-text-inactive';
    }
  },
  methods: {
    async goToPortal() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        const data = (await createCustomerPortalSession(this.userId)).data;
        window.location = data
        loadingComponent.close();
      } catch (error) {
        loadingComponent.close();
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
        });
      }
    },
  }
}
</script>

<style>

</style>