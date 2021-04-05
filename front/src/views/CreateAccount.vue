<template>
  <div class="columns is-marginless" style="height: 100%">
    <div class="column has-background-primary columns is-flex-direction-column is-centered is-marginless is-hidden-mobile">
      <div class="column columns is-marginless">
        <img src="@/assets/images/illustration-createAccount.svg" alt="">
      </div>
      <div class="column is-narrow has-text-white">
        <Copywrinting/>
      </div>
    </div>
    <div class="column columns is-marginless is-flex-direction-column" style="height: 100%">
      <div class="column is-narrow">
        <h1 class="has-text-centered is-size-2 has-text-weight-medium">Paystack + Beds24</h1>
        <h4 class="has-text-centered subtitle">Manage your account effectively</h4>
      </div>
      <div class="column is-narrow px-6">
        <form class="columns is-multiline is-centered">
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
                v-model="infoData.email"
                disabled>
              </b-input>
            </b-field>
          </div>
          <div class="column is-6">
            <b-field 
              label="Phone"
              :type="infoError.phone ? 'is-danger' : ''"
              :message="infoError.phone">
              <b-select v-model="infoError.callingCode">
                <option
                    v-for="code in callingCodes"
                    :value="code"
                    :key="code">
                    +{{ code }}
                </option>
              </b-select>
              <b-input 
                custom-class="custum-input"
                v-model="infoData.phone">
              </b-input>
            </b-field>
          </div>
          <div class="column is-6">
            <b-field 
              label="Country"
              :type="infoError.country ? 'is-danger' : ''"
              :message="infoError.country">
              <b-autocomplete
                v-model="nameContrie"
                :data="filteredContries"
                icon="magnify"
                clearable
                field="name"
                @select="option => infoData.country = option">
                <template #empty>No results found</template>
              </b-autocomplete>
            </b-field>
          </div>
          <div class="column is-6">
            <b-field 
              label="Currency">
              <b-input 
                custom-class="custum-input"
                v-model="currencie"
                disabled>
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
          <div class="column is-narrow">
            <b-button
              type="is-primary"
              label="Save"
              class="has-text-weight-bold px-6"
              @click="save()"/>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { validation } from '@/services/validation';
import { initSubscription, getAllContries } from '@/api';
import getCurrentUser from '@/services/firebase';
import Copywrinting from '@/components/general/Copywrinting.vue';

export default {
  components: {
    Copywrinting,
  },
  data() {
    return {
      infoData: {
        firstName: '',
        lastName: '',
        email: this.email,
        phone: '',
        paystackKey: '',
        country: '',
        callingCode: '',
      },
      infoError: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        paystackKey: '',
        country: '',
      },
      time: 4000,
      user: null,
      contries: [],
      callingCodes: [],
      nameContrie: '',
    }
  },
  computed: {
    ...mapGetters({
      email: 'userEmail',
    }),
    filteredContries() {
      return this.contries.filter((option) => {
        return option.name
          .toString()
          .toLowerCase()
          .indexOf(this.nameContrie.toLowerCase()) >= 0
      })
    },
    currencie() {
      if (!this.infoData.country) return '';
      return this.infoData.country.currencies[0] ? this.infoData.country.currencies[0].code : '';
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
          type: 'is-success',
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
  },
  async mounted() {
    try {
      this.user = await getCurrentUser();
      this.contries = (await getAllContries()).data;
      this.callingCodes = this.contries
        .map(el => el.callingCodes)
        .flat()
        .reduce((acc, val) => {
          if (!val) return acc;
          if (!acc.includes(val)) acc.push(val.replace(' ', ''));
          return acc;
        }, []);
      this.callingCodes.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
      this.infoData.email = this.email;
    } catch (error) {
      this.$router.push({ name: 'Register' });
    }
  }
}
</script>
