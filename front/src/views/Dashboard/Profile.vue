<template>
  <div class="container">
    <h1 class="title has-text-centered">Profile</h1>
    <div class="is-flex is-justify-content-center">
      <form class="columns is-multiline is-centered" style="max-width: 800px">
        <div class="column is-6">
          <b-field 
            label="First Name"
            :type="infoError.firstName ? 'is-danger' : ''"
            :message="infoError.firstName">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.firstName"
              :disabled="!edit">
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
              :disabled="!edit">
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
            <b-select v-model="infoData.callingCode" :disabled="!edit">
              <option
                v-for="code in callingCodes"
                :value="code"
                :key="code">
                +{{ code }}
              </option>
            </b-select>
            <b-input 
              custom-class="custum-input"
              v-model="infoData.phone"
              :disabled="!edit"
              expanded>
            </b-input>
          </b-field>
        </div>
        <div class="column is-12">
          <b-field 
            label="Currencie"
            :type="infoError.currencie ? 'is-danger' : ''"
            :message="infoError.currencie">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.currencie"
              :disabled="!edit">
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
              :disabled="!edit">
            </b-input>
          </b-field>
        </div>
        <div class="column is-narrow">
          <b-button
            type="is-primary"
            label="Edit"
            class="has-text-weight-bold px-6"
            @click="edit = true"
            v-if="!edit"/>
          <div class="buttons" v-else>
            <b-button
              type=""
              label="Cancel"
              class="has-text-weight-bold px-6"
              @click="cancel()"/>
            <b-button
              type="is-primary"
              label="Save"
              class="has-text-weight-bold px-6"
              @click="save()"/>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { getAllContries } from '@/api';
import { validation } from '@/services/validation';
import { db } from '@/pluging/firebase';

export default {
  data() {
    return {
      infoData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        paystackKey: '',
        callingCode: '',
        currencie: '',
      },
      infoError: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        paystackKey: '',
        currencie: '',
      },
      time: 4000,
      contries: [],
      callingCodes: [],
      nameContrie: '',
      fiels: [
        'email',
        'firstName',
        'lastName',
        'callingCode',
        'phone',
        'paystackKey',
        'currencie',
      ],
      edit: false
    }
  },
  watch: {
    user: {
      handler: function (val) {
        this.infoData.firstName = val.firstName;
        this.infoData.lastName = val.lastName;
        this.infoData.email = val.email;
        this.infoData.phone = val.phone;
        this.infoData.paystackKey = val.paystackKey;
        this.infoData.callingCode = val.callingCode;
        this.infoData.currencie = val.currencie || val.country.currencies[0].code || '';
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'user',
    }),
    user: {
      get() {
        return this.getUser;
      },
      set(val) {
        this.setUser(val);
      }
    }
  },
  methods: {
    ...mapMutations({
      setUser: 'SET_USER',
    }),
    async save() {
      if (!validation(this.infoData, this.infoError, this.time, this.fiels)) return;
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
          type: 'is-primary',
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
    cancel() {
      this.infoData.firstName = this.user.firstName;
      this.infoData.lastName = this.user.lastName;
      this.infoData.email = this.user.email;
      this.infoData.phone = this.user.phone;
      this.infoData.paystackKey = this.user.paystackKey;
      this.infoData.callingCode = this.user.callingCode;
      this.infoData.currencie = this.user.currencie || this.user.country.currencies[0].code || '';
      this.edit = false;
    }
  },
  async mounted() {
    try {
      this.contries = (await getAllContries()).data;
      this.callingCodes = this.contries
        .map(el => el.callingCodes)
        .flat()
        .reduce((acc, val) => {
          if (!val) return acc;
          if (!acc.includes(val)) acc.push(val.replace(' ', ''));
          return acc;
        }, []);
      this.callingCodes.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    } catch (error) {
      this.$router.push({ name: 'Register' });
    }
  }
}
</script>

<style>

</style>