<template>
  <div class="container is-max-desktop has-text-centered px-4" style="height: 100%">
    <div class="columns is-marginless is-flex-direction-column is-justify-content-space-between pt-6" style="height: 100%">
      <div class="column">
        <h1 class="has-text-centered title">Verify your email</h1>
        <p class="has-text-weight-semibold is-size-5 mb-4">
          You will need to verify your email to complete registration
        </p>
        <p class="has-text-weight-semibold is-size-5">
          An email has been sent to <a>{{userEmail}}</a> with a link to verify account.
          If you have not received the email after a few minutes, Please check your folder
        </p>
        <img src="@/assets/images/illustration-verifyEmail.svg">
        <div class="level is-mobile mt-6">
          <div class="level-left">
            <b-button 
              type="is-primary"
              label="Change Email"
              class="has-text-weight-bold"
              outlined
              @click="$router.push({ name: 'Register' })"/>
          </div>
          <div class="level-rigth">
            <b-button 
              type="is-primary"
              label="Resend Email"
              class="has-text-weight-bold"
              @click="proceed"/>
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
import { mapGetters } from 'vuex';
import { emailValidation } from '@/services/validation';
import { auth } from '@/pluging/firebase';
import Copywrinting from '@/components/general/Copywrinting.vue';

export default {
  components: {
    Copywrinting,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['userEmail'])
  },
  methods: {
    async proceed() {
      if (!emailValidation(this.userEmail)) {
        this.$router.push({ name: 'Register' });
        return;
      }
      const loadingComponent = this.$buefy.loading.open();
      try { 
        const actionCodeSettings = {
          url: window.location.origin,
          handleCodeInApp: true,
        };
        await auth.sendSignInLinkToEmail(this.userEmail, actionCodeSettings);
        this.$buefy.toast.open({
          message: 'Check your mailbox to complete the process',
          type: 'is-primary',
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
  },
  mounted() {}
}
</script>

<style>

</style>