<template>
  <div class="container has-text-centered">
    <img src="@/assets/images/illustration-home.svg" class="my-6">
    <p class="is-size-5 has-text-weight-semibold mb-3" v-if="!subscriptionId">
      You do not have an active subscription
    </p>
    <p class="is-size-5 has-text-weight-semibold mb-3" v-else>
      Your subscription is currently
      <span :class="styleSubcription">
        {{subscriptionLabel}}
      </span>
    </p>
    <b-button
      v-if="!subscriptionId"
      type="is-primary"
      label="Subscribe"
      class="has-text-weight-bold px-6"
      @click="subscribe()"/>
    <b-button
      v-else
      type="is-primary"
      :label="labelBtnSubcription"
      class="has-text-weight-bold px-6"
      @click="goToPortal()"
      :disabled="subscriptionLabel === 'Trial'"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { createCustomerPortalSession, createSession } from '@/api';

export default {
  computed: {
    ...mapGetters({
      subscriptionLabel: 'subscriptionLabel',
      subscriptionId: 'subscriptionId',
      userId: 'userId',
    }),
    styleSubcription() {
      if (['Active', 'Trial'].includes(this.subscriptionLabel)) return 'has-text-success';
      return 'has-text-inactive';
    },
    labelBtnSubcription() {
      if (['Trial'].includes(this.subscriptionLabel)) return 'Subscribe';
      return 'Manage Subscription';
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
    async subscribe() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        const response = (await createSession(this.userId)).data;
        const stripe = window.Stripe(response.publishableKey);
        await stripe.redirectToCheckout({
          sessionId: response.sessionId
        });
        loadingComponent.close();
      } catch (error) {
        loadingComponent.close();
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
        });
      }
    }
  },
  mounted() {
    if (this.$route.query._r === 'a') {
      this.$buefy.snackbar.open({
        message: `Processing of the current subscription ...`,
        type: 'is-primary',
      });
    }
  }
}
</script>

<style>

</style>