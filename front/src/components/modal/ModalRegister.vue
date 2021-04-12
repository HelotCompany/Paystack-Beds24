<template>
  <div>
    <form>
      <div class="modal-card" style="width: 960px">
        <header class="modal-card-head">
          <p class="modal-card-title">Update your account information</p>
        </header>
        <section class="modal-card-body">
          <div class="columns is-multiline is-centered">
            <div class="column is-6">
              <b-field 
                label="First Name"
                :type="infoError.firstName ? 'is-danger' : ''"
                :message="infoError.firstName">
                <b-input 
                  custom-class="custum-input"
                  v-model="infoData.firstName">
                </b-input>
              </b-field>
            </div>
            <div class="column is-6">
              <b-field 
                label="Last Name"
                :type="infoError.lastName ? 'is-danger' : ''"
                :message="infoError.lastName">
                <b-input 
                  custom-class="custum-input"
                  v-model="infoData.lastName">
                </b-input>
              </b-field>
            </div>
            <div class="column is-6">
              <b-field 
                label="Email"
                :type="infoError.email ? 'is-danger' : ''"
                :message="infoError.email">
                <b-input 
                  custom-class="custum-input"
                  v-model="infoData.email">
                </b-input>
              </b-field>
            </div>
            <div class="column is-6">
              <b-field 
                label="Phone"
                :type="infoError.phone ? 'is-danger' : ''"
                :message="infoError.phone">
                <b-input 
                  custom-class="custum-input"
                  v-model="infoData.phone">
                </b-input>
              </b-field>
            </div>
            <div class="column is-12">
              <b-field 
                label="Paystack Secret Key"
                :type="infoError.paystackKey ? 'is-danger' : ''"
                :message="infoError.paystackKey">
                <b-input 
                  custom-class="custum-input"
                  v-model="infoData.paystackKey">
                </b-input>
              </b-field>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <b-button 
            type="is-primary"
            label="Save"
            class="has-text-weight-bold px-6"
            @click="save()"/>
        </footer>
      </div>
    </form>
  </div>
</template>

<script>
import { validation } from '@/services/validation';
import { initSubscription } from '@/api';

export default {
  props: {
    email: String,
    userId: String,
  },
  data() {
    return {
      infoData: {
        firstName: '',
        lastName: '',
        email: this.email,
        phone: '',
        paystackKey: '',
      },
      infoError: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        paystackKey: '',
      },
      time: 4000
    }
  },
  methods: {
    async save() {
      if (!validation(this.infoData, this.infoError, this.time)) return;
      const loadingComponent = this.$buefy.loading.open();
      try {
        const response = (await initSubscription({
          ...this.infoData,
          userId: this.userId,
        })).data;
        const stripe = window.Stripe(response.publishableKey);
        await stripe.redirectToCheckout({
          sessionId: response.sessionId
        });
        this.$buefy.toast.open({
          message: 'Information saved successfully',
          type: 'is-primary',
        });
        this.$emit('close');
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