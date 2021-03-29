<template>
  <div class="container is-max-desktop px-4 mt-6" style="height: 100%">
    <h1 class="has-text-centered title">Paystack + Beds24</h1>
    <h4 class="has-text-centered subtitle mb-6">Manage your account effectively</h4>
    <form class="mb-6">
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
            label="Paystack Public Key"
            :type="infoError.paystackKey ? 'is-danger' : ''"
            :message="infoError.paystackKey">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.paystackKey">
            </b-input>
          </b-field>
        </div>
        <div class="column is-3">
          <b-button 
            type="is-primary"
            expanded
            label="Save"
            class="has-text-weight-bold"
            @click="save"/>
        </div>
      </div>
    </form>
    <div class="columns is-centered">
      <div class="column is-narrow">
        <div class="level is-mobile" style="height: 100%">
          <div class="level-left mr-3">
            <div class="cercle cercle__inactive"></div>
          </div>
          <div class="level-right mr-6">
            <span class="has-text-weight-bold">Inactive</span>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <b-button
          type="is-primary"
          expanded
          label="Subscribe"
          class="has-text-weight-bold"
          @click="subscribe"/>
      </div>
    </div>
    <div>
      <b-field 
        label="Bed24 Key">
        <b-input 
          custom-class="custum-input"
          :value="bed24Key"
          expanded
          disabled>
        </b-input>
        <p class="control">
          <b-button
            type="is-primary"
            @click="copyToClipboard(bed24Key)">
            <img src="@/assets/images/copy-icon.svg" width="25" alt="">
          </b-button>
        </p>
      </b-field>
      <b-field 
        label="Payment Url">
        <b-input 
          custom-class="custum-input"
          :value="payementUrl"
          expanded
          disabled>
        </b-input>
        <p class="control">
          <b-button
            type="is-primary"
            @click="copyToClipboard(payementUrl)">
            <img src="@/assets/images/copy-icon.svg" width="25" alt="">
          </b-button>
        </p>
      </b-field>
    </div>
  </div>
</template>

<script>
import { actionSubscribe } from '@/services/stripe';
import { emailValidation } from '@/services/validation';

export default {
  data() {
    return {
      infoData: {
        firstName: 'Jean', // Default values to pass the validation
        lastName: 'PAUL', // Default values to pass the validation
        email: 'jeanpaul@gmail.com', // Default values to pass the validation
        phone: '000000000', // Default values to pass the validation
        paystackKey: '78298NjhxjnchdnuujunBUUb87878B_7YUVGYG76', // Default values to pass the validation
      },
      infoError: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        paystackKey: '',
      },
      time: 4000,
      bed24Key: 'jnjJSDHUEDNSDUbsdbcdoicdncjefcuejcuehdcied_cenfdbchebd_efdncjcejcjeznjbb7CEBIè_77678èCENCEUHDIEU',
      payementUrl: 'odciefnjKBHDKSQJB_dej_B7EHDU3D3UDeç_d_d3EDYU3HDUA3_H3E73EDU3HD83IZDUHIFIOIuyudhuezgfhiehfd',
    }
  },
  methods: {
    async subscribe() {
      if (!emailValidation(this.infoData.email)) {
        this.$buefy.toast.open({
          message: `Email address ${this.infoData.email} is not valid`,
          type: 'is-danger',
        });
        return;
      }
      const loadingComponent = this.$buefy.loading.open();
      try {
        await actionSubscribe({ email: this.infoData.email});
        loadingComponent.close();
      } catch (error) {
        console.log(error);
        loadingComponent.close();
      }
    },
    async save() {
      if (!this.validation()) return;
      const loadingComponent = this.$buefy.loading.open();
      try {
        // save in firebase
        loadingComponent.close();
      } catch (error) {
        console.log(error);
        loadingComponent.close();
      }
    },
    validation() {
      let valid = true;
      const that = this;
      if (!emailValidation(this.infoData.email)) {
        valid = false;
        this.infoError.email = 'Email address is not valid';
        setTimeout(() => that.infoError.email = '', this.time);
      }
      if (!this.infoData.firstName) {
        valid = false;
        this.infoError.firstName = 'First name is not valid';
        setTimeout(() => that.infoError.firstName = '', this.time);
      }
      if (!this.infoData.lastName) {
        valid = false;
        this.infoError.lastName = 'Last name is not valid';
        setTimeout(() => that.infoError.lastName = '', this.time);
      }
      if (!this.infoData.phone) {
        valid = false;
        this.infoError.phone = 'Phone is not valid';
        setTimeout(() => that.infoError.phone = '', this.time);
      }
      if (!this.infoData.paystackKey) {
        valid = false;
        this.infoError.paystackKey = 'Paystack Public Key';
        setTimeout(() => that.infoError.paystackKey = '', this.time);
      }
      return valid;
    },
    copyToClipboard(value) {
      const domCreate = document.createElement('input');
      document.body.appendChild(domCreate);
      domCreate.setAttribute('value', value);
      domCreate.select();
      try {
        const isCopied = document.execCommand('copy');
        if (isCopied) this.$buefy.toast.open({
          message: 'Copy to clipboard',
          type: 'is-success',
        });
        else this.$buefy.toast.open({
          message: 'Error while copying',
          type: 'is-danger',
        });
      } catch (e) {
        this.$buefy.toast.open({
          message: 'Error while copying',
          type: 'is-danger',
        });
      }
    },
  },
  mounted() {
    if (this.$route.query.type) {
      this.$buefy.toast.open({
        message: this.$route.query,
        type: 'is-success',
      });
    }
  }
}
</script>
