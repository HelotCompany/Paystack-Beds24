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
            label="Paystack Secret Key"
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
        <div class="level is-mobile" style="height: 100%" v-if="user && user.subscriptionId">
          <div class="level-left mr-3">
            <div class="cercle" :class="[ subscriptionValid ? 'cercle__active' : 'cercle__inactive' ]"></div>
          </div>
          <div class="level-right mr-6">
            <span class="has-text-weight-bold"> {{ subscriptionLabel }} </span>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <b-button
          type="is-primary"
          expanded
          label="Go to partal"
          class="has-text-weight-bold"
          @click="goToPortal"/>
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
import { checkoutSubscription, createCustomerPortalSession } from '@/api';
import { actionSubscribe } from '@/services/stripe';
import { validation } from '@/services/validation';
import { db, auth } from '@/pluging/firebase';
import getCurrentUser from '@/services/firebase';
import ModalRegister from '@/components/modal/ModalRegister';

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
      bed24Key: '',
      payementUrl: '',
      isEditData: false,
      edit: false,
      subscriptionValid: false,
      subscriptionLabel: 'Inactive',
      eventUser: null,
    }
  },
  watch: {},
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
      if (!(
        this.user.firstName === this.infoData.firstName &&
        this.user.lastName === this.infoData.lastName &&
        this.user.email === this.infoData.email &&
        this.user.phone === this.infoData.phone &&
        this.user.paystackKey === this.infoData.paystackKey
      )) {
        this.$buefy.toast.open({
          message: 'Please save your data before continuing !!!',
          type: 'is-danger',
        });
        return;
      }
      const loadingComponent = this.$buefy.loading.open();
      try {
        await actionSubscribe({
          email: this.infoData.email,
          userId: this.user.uid
        });
        loadingComponent.close();
      } catch (error) {
        loadingComponent.close();
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger',
        });
      }
    },
    async goToPortal() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        const data = (await createCustomerPortalSession(this.user.uid)).data;
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
    async save() {
      if (!validation(this.infoData, this.infoError, this.time)) return;
      const loadingComponent = this.$buefy.loading.open();
      try {
        await db.collection('users').doc(this.user.uid).update({...this.infoData});
        const doc = await db.collection('users').doc(this.user.uid).get();
        this.user = {
          ...this.user,
          ...doc.data(),
        }
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
        this.eventUser = await db.collection('users').doc(this.user.uid).onSnapshot(async (doc) => {
          if (doc.exists) {
            const info = doc.data();
            this.user = {
              ...this.user,
              ...info,
            }
            this.infoData = {
              firstName: info.firstName,
              lastName: info.lastName,
              email: info.email,
              phone: info.phone,
              paystackKey: info.paystackKey,
            };
            if (this.user.subscriptionId) {
              const subscription = (await checkoutSubscription(this.user.subscriptionId)).data;
              if (['active', 'trialing'].includes(subscription.status)) {
                this.subscriptionValid = true;
                if (subscription.status === 'active') this.subscriptionLabel = 'Active';
                if (subscription.status === 'trialing') this.subscriptionLabel = 'Trialing';
              }
            }
            this.bed24Key = info.bed24Key ? info.bed24Key : '';
            this.payementUrl = info.payementUrl ? info.payementUrl : '';
            this.isEditData = true;
          } else {
            this.$buefy.modal.open({
              parent: this,
              component: ModalRegister,
              hasModalCard: true,
              customClass: '',
              trapFocus: true,
              canCancel: [],
              with: 960,
              props: {
                email: this.user.email,
                userId: this.user.uid,
              },
              events: {
                close: async () => {
                  await this.getDataUser();
                }
              }
            })
          }
          loadingComponent.close();
        });
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
    copyToClipboard(value) {
      if (!value) return;
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
  },
  async mounted() {
    await this.getDataUser();
  },
  destroyed() {
    if (this.eventUser !== null) this.eventUser();
  }
}
</script>
