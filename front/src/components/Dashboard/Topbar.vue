<template>
  <div class="level is-mobile">
    <div class="level-left title" :class="titleLeft ? '' : 'has-text-primary-light'">
      {{ titleLeft ? titleLeft : titleItem }}
    </div>
    <div class="level-item title">
      {{ titleItem }}
    </div>
    <div class="level-right">
      <div class="level-left mr-3">
        <div class="cercle" :class="[ subscriptionValid ? 'cercle__active' : 'cercle__inactive' ]"></div>
      </div>
      <div class="level-right mr-6">
        <span class="has-text-weight-bold"> {{ subscriptionLabel }} </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      subscriptionValid: 'subscriptionValid',
      subscriptionLabel: 'subscriptionLabel'
    }),
    titleItem() {
      if (this.$route.name === 'Dashboard') return 'Dashboard';
      return '';
    },
    titleLeft() {
      return '';
    }
  },
}
</script>

<style>

</style>