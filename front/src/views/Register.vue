<template>
  <div class="columns is-marginless" style="height: 100%">
    <div class="column has-background-primary columns is-flex-direction-column is-centered is-marginless is-hidden-mobile">
      <img src="@/assets/images/illustration-signin.svg" alt="">
    </div>
    <div class="column columns is-marginless is-flex-direction-column is-justify-content-space-between" style="height: 100%">
      <div class="column is-narrow">
        <h1 class="has-text-centered is-size-2 has-text-weight-medium">Paystack + Beds24</h1>
      </div>
      <div class="column is-narrow px-6">
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
          <b-field
            :type="errorPrivacyPolicy ? 'is-danger' : ''"
            :message="errorPrivacyPolicy">
            <b-checkbox v-model="privacyPolicy">
              I agree to Terms and privacy policy
            </b-checkbox>
          </b-field>
        </div>
        <div class="columns is-centered">
          <div class="column">
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
      <div class="column is-narrow">
        <Copywrinting/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { emailValidation } from '@/services/validation';
import { auth } from '@/pluging/firebase';
import getCurrentUser from '@/services/firebase';
import Copywrinting from '@/components/general/Copywrinting.vue';

export default {
  components: {
    Copywrinting,
  },
  data() {
    return {
      email: '',
      errorEmail: '',
      errorPrivacyPolicy: '',
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
    }),
    async proceed() {
      let valid = true;
      if (!emailValidation(this.email)) {
        valid = false
        const that = this;
        this.errorEmail = 'Email address is not valid';
        setTimeout(() => that.errorEmail = '', this.time);
      }
      if (!this.privacyPolicy) {
        valid = false
        const that = this;
        this.errorPrivacyPolicy = 'Validation required';
        setTimeout(() => that.errorPrivacyPolicy = '', this.time);
      }
      if (!valid) return;
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
        this.$router.push({ name: 'VerifyEmail' });
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
          this.$router.push({ name: 'Dashboard' });
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
        this.$router.replace({ name: 'Dashboard' });
      } catch (e) {
        //
      }
    }
  }
}
</script>
