<template>
  <div class="container is-max-desktop px-4" style="height: 100%">
    <div class="columns is-vcentered is-mobile" style="height: 100%">
      <div class="column">
        <h1 class="has-text-centered title mb-6">Get started</h1>
        <b-field 
          label="Email Address"
          custom-class="has-text-centered"
          :type="errorEmail ? 'is-danger' : ''"
          :message="errorEmail">
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
              @click="proceed"
              class="has-text-weight-bold">
              Proceed
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { emailValidation } from '@/services/validation';
import { auth } from '@/pluging/firebase';
import getCurrentUser from '@/services/firebase';

export default {
  data() {
    return {
      email: '',
      errorEmail: '',
      privacyPolicy: true,
      time: 4000,
    }
  },
  computed: {
    ...mapGetters(['userEmail'])
  },
  methods: {
    ...mapMutations({
      setEmail: 'SET_EMAIL',
      setDataSign: 'SET_DATA_SIGN'
    }),
    async proceed() {
      if (!emailValidation(this.email)) {
        const that = this;
        this.errorEmail = 'Email address is not valid';
        setTimeout(() => that.errorEmail = '', this.time);
        return;
      }
      const loadingComponent = this.$buefy.loading.open();
      try { 
        const actionCodeSettings = {
          url: window.location.href,
          handleCodeInApp: true,
        };
        await auth.sendSignInLinkToEmail(this.email, actionCodeSettings);
        this.setEmail(this.email);
        this.$buefy.toast.open({
          message: 'Check your mailbox to complete the process',
          type: 'is-success',
        });
        loadingComponent.close();
      } catch (error) {
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
        });
        loadingComponent.close();
      }
    },
    async validSign() {
      if (auth.isSignInWithEmailLink(window.location.href)) {
        let email = this.userEmail;
        if (!this.userEmail) {
          email = window.prompt('Please provide your email for confirmation');
        }
        const loadingComponent = this.$buefy.loading.open();
        try {
          await auth.signInWithEmailLink(email, window.location.href);
          this.setDataSign({
            isConnect: true,
          })
          this.$router.push({ name: 'PaystackBeds24' });
          loadingComponent.close();
        } catch (error) {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger',
          });
          loadingComponent.close();
        }
      }
    },
  },
  async mounted() {
    if (this.$route.query.apiKey) {
      await this.validSign();
    } else {
      try {
        await getCurrentUser();
        this.$router.replace({ name: 'PaystackBeds24' });
      } catch (e) {
        //
      }
    }
  }
}
</script>
