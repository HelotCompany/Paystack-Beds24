<template>
  <div class="columns is-marginless" style="height: 100%">
    <div class="column is-narrow has-background-white">
      <Sidebar/>
    </div>
    <div class="column columns is-marginless is-flex-direction-column is-justify-content-space-between">
      <div class="column is-narrow">
        <Topbar/>
      </div>
      <div class="column">
        <router-view/>
      </div>
      <div class="column is-narrow">
        <Copywrinting/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import Sidebar from '@/components/Dashboard/Sidebar.vue';
import Topbar from '@/components/Dashboard/Topbar.vue';
import Copywrinting from '@/components/general/Copywrinting.vue';
import getCurrentUser from '@/services/firebase';
import { db } from '@/pluging/firebase';
import { checkoutSubscription } from '@/api';

export default {
  components: {
    Sidebar,
    Topbar,
    Copywrinting,
  },
  data() {
    return {
      eventUser: null,
    }
  },
  watch: {},
  computed: {
    ...mapGetters({
      userEmail: 'userEmail',
      getUser: 'user'
    }),
    isCurrentUser() {
      return this.user && this.user.uid
    },
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
      setEmail: 'SET_EMAIL',
      setUser: 'SET_USER',
    }),
    async getDataUser() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        let user = await getCurrentUser();
        this.eventUser = await db.collection('users').doc(user.uid).onSnapshot(async (doc) => {
          if (doc.exists) {
            const info = doc.data();
            user = {
              ...user,
              ...info,
            }
            if (user.subscriptionId) {
              const subscription = (await checkoutSubscription(user.subscriptionId)).data;
              if (['active', 'trialing'].includes(subscription.status)) {
                user.subscriptionValid = true;
                if (subscription.status === 'active') user.subscriptionLabel = 'Active';
                if (subscription.status === 'trialing') user.subscriptionLabel = 'Trial';
              }
            }
            this.user = user;
          } else {
            this.$router.push({ name: 'CreateAccount' });
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
  },
  async mounted() {
    await this.getDataUser();
  },
  destroyed() {
    if (this.eventUser !== null) this.eventUser();
  }
}
</script>

<style>

</style>