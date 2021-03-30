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
      const loadingComponent = this.$buefy.loading.open();
      try {
        console.log('this.$route', this.$route);
        if (this.$route.params.id) {
          const doc = await db.collection("users").doc(this.$route.params.id).get();
          if (!doc.exists) this.$router.replace({ name: 'PaystackBeds24' });
          if (!(this.$route.query.session_id)) this.$router.replace({ name: 'PaystackBeds24' });
          await checkoutSession(this.$route.query.session_id);
          let bed24Key = '';
          let payementUrl = '';
          if (this.$route.query.paysuccess) {
            bed24Key = this.generateHexString(60);
            payementUrl = `${config.BASE_URL}p/${this.$route.params.id}`;
          }
          await db.collection("users").doc(this.$route.params.id).update({
            paysuccess: !!this.$route.query.paysuccess,
            session_id: this.$route.query.session_id,
            bed24Key,
            payementUrl,
          });
        }
        loadingComponent.close();
        this.$router.replace({ name: 'PaystackBeds24' })
      } catch (error) {
        loadingComponent.close();
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
