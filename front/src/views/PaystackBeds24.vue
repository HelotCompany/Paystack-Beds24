<template>
  <div class="container is-max-desktop px-4 mt-6" style="height: 100%">
    <div class="level is-mobile">
      <div class="level-left"></div>
      <div class="level-item">
        <div>
          <div class="">
            <h1 class="has-text-centered title">Paystack + Beds24</h1>
          </div>
          <div class="">         
            <h4 class="has-text-centered subtitle">Manage your account effectively</h4>
          </div>
        </div>
      </div>
      <div class="level-right">
        <b-button 
            type="is-primary"
            expanded
            label="Logout"
            icon-right="logout"
            class="has-text-weight-bold"
            @click="logout()"/>
      </div>
    </div>
    <form class="mb-6">
      <div class="columns is-multiline is-centered">
        <div class="column is-6">
          <b-field 
            label="First Name"
            :type="infoError.firstName ? 'is-danger' : ''"
            :message="infoError.firstName">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.firstName"
              :disabled="isEditData && !edit">
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
              v-model="infoData.lastName"
              :disabled="isEditData && !edit">
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
              v-model="infoData.email"
              :disabled="isEditData && !edit">
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
              v-model="infoData.phone"
              :disabled="isEditData && !edit">
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
              v-model="infoData.paystackKey"
              :disabled="isEditData && !edit">
            </b-input>
          </b-field>
        </div>
        <div class="column is-3" v-if="edit">
          <b-button 
            type="is-primary"
            expanded
            label="Cancel"
            class="has-text-weight-bold"
            @click="edit = false"/>
        </div>
        <div class="column is-3" v-if="!isEditData || edit">
          <b-button 
            type="is-primary"
            expanded
            label="Save"
            class="has-text-weight-bold"
            @click="save()"/>
        </div>
        <div class="column is-3" v-else>
          <b-button 
            type="is-primary"
            expanded
            label="Edit"
            class="has-text-weight-bold"
            @click="edit = true"/>
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
          @click="subscribe()"/>
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
import { mapMutations, mapGetters } from 'vuex';
import { actionSubscribe } from '@/services/stripe';
import { emailValidation } from '@/services/validation';
import { db, auth } from '@/pluging/firebase';
import getCurrentUser from '@/services/firebase';

export default {
  data() {
    return {
      infoData: {
        firstName: '',
        lastName: '',
        email: '',
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
      user: null,
      time: 4000,
      bed24Key: 'jnjJSDHUEDNSDUbsdbcdoicdncjefcuejcuehdcied_cenfdbchebd_efdncjcejcjeznjbb7CEBIè_77678èCENCEUHDIEU',
      payementUrl: 'odciefnjKBHDKSQJB_dej_B7EHDU3D3UDeç_d_d3EDYU3HDUA3_H3E73EDU3HD83IZDUHIFIOIuyudhuezgfhiehfd',
      isEditData: false,
      edit: false,
    }
  },
  computed: {
    ...mapGetters(['userEmail']),
    isCurrentUser() {
      return this.user && this.user.uid
    }
  },
  methods: {
    ...mapMutations({
      setEmail: 'SET_EMAIL',
    }),
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
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
        });
        loadingComponent.close();
      }
    },
    async save() {
      if (!this.validation()) return;
      const loadingComponent = this.$buefy.loading.open();
      try {
        await db.collection("users").doc(this.user.uid).set(this.infoData);
        this.$buefy.toast.open({
          message: 'Information saved successfully',
          type: 'is-success',
        });
        this.edit = false;
        this.isEditData = true;
        loadingComponent.close();
      } catch (error) {
        loadingComponent.close();
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
        });
      }
    },
    async getDataUser() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        this.user = await getCurrentUser();
        this.infoData.email = this.user.email;
        const doc = await db.collection("users").doc(this.user.uid).get();
        if (doc.exists) {
          this.infoData = doc.data();
          this.isEditData = true;
        }
        loadingComponent.close();
      } catch (error) {
        loadingComponent.close();
        if (error === null) {
          this.setEmail('');
          this.$router.push('/');
          return;
        }
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
        });
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
    async logout() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        await auth.signOut();
        this.setEmail('');
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
    async suscriptionManagment() {
      if (!this.$route.query.type) {
        // TO DO
      }
      const loadingComponent = this.$buefy.loading.open();
      try {
        // TO DO
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
  async mounted() {
    await this.getDataUser();
    if (this.$route.query.type) {
      // TO DO
    }
  }
}
</script>
