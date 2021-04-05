<template>
  <div class="container is-max-desktop px-4" style="height: 100%">
    <div class="columns is-vcentered is-centered is-mobile" style="height: 100%">
      <div class="column is-5">
        <img src="@/assets/images/firmware-animate.svg">
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/pluging/firebase';
import config from '@/api/config';
import { checkoutSession } from '@/api';

export default {
  data() {
    return {}
  },
  computed: {},
  methods: {
    async redirect() {
      try {
        if (!(this.$route.query.session_id)) this.$router.replace({ name: 'Dashboard' });
        const session = (await checkoutSession(this.$route.query.session_id)).data;
        const doc = await db.collection('users').doc(session.metadata.userId).get();
        if (!doc.exists) this.$router.replace({ name: 'Dashboard' });
        let bed24Key = '';
        let payementUrl = '';
        if (this.$route.query.paysuccess) {
          bed24Key = this.generateHexString(60);
          payementUrl = `${config.BASE_URL}p/${session.metadata.userId}`;
        }
        await db.collection('users').doc(session.metadata.userId).update({
          subscriptionId: session.subscription,
          bed24Key,
          payementUrl,
        });
        this.$router.replace({ name: 'Dashboard' })
      } catch (error) {
        this.$buefy.toast.open({
          message: `${error.message}`,
          type: 'is-danger',
        });
      }
    },
    generateHexString(length) {
      var ret = "";
      while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
      }
      return ret.substring(0,length);
    }
  },
  async mounted() {
    await this.redirect();
  }
}
</script>
