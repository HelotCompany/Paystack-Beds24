<template>
  <div class="container is-max-desktop px-4" style="height: 100%">
    <div class="columns is-vcentered is-mobile" style="height: 100%">
      <div class="column">
        <h1 class="has-text-centered title mb-6">Get started</h1>
        <b-field 
          label="Email Address"
          custom-class="has-text-centered">
          <b-input 
            custom-class="custum-input"
            v-model="email">
          </b-input>
        </b-field>
        <div class="has-text-centered mb-5">
          <b-checkbox 
            v-model="privacyPolicy">
            I agree to Terms and privacy policy
          </b-checkbox>
        </div>
        <div class="columns is-centered">
          <div class="column is-4">
            <b-button 
              type="is-primary"
              expanded
              @click="proceed">
              Proceed
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      email: '',
      privacyPolicy: true,
    }
  },
  methods: {
    proceed() {
      this.$router.push({ name: 'PaystackBeds24' });
    }
  }
}
</script>
