<template>
  <div class="container is-max-desktop px-4" style="height: 100%">
    <div class="columns is-vcentered is-centered is-mobile" style="height: 100%">
      <div class="column is-5">
        <b-message type="is-success">
          The payment was made successfully
        </b-message>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/pluging/firebase';
import { postFormHTML } from '@/services/general';

export default {
  data() {
    return {}
  },
  computed: {},
  methods: {
    async redirect() {
      if (!(this.$route.query.reference && this.$route.query.txnid && this.$route.params.id && this.$route.params.bookId)) return;
      try {
        const doc = await db.collection("users").doc(this.$route.params.id).get();
        if (!doc.exists) return;
        const info = doc.data();
        postFormHTML('https://api.beds24.com/custompaymentgateway/notify.php', {
          key: info.bed24Key,
          bookid: this.$route.params.bookId,
          txnid: this.$route.query.txnid,
          status: 1
        })
        this.$buefy.toast.open({
          message: 'Beds24 is notify',
          type: 'is-success',
        }); 
      } catch (error) {
        this.$buefy.toast.open({
          message: `Error when notifying Bead24: ${error.message}`,
          type: 'is-danger',
        });
      }
    }
  },
  async mounted() {
    await this.redirect();
  }
}
</script>
