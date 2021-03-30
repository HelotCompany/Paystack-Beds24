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
import axios from 'axios';
import { db } from '@/pluging/firebase';

export default {
  data() {
    return {}
  },
  computed: {},
  methods: {
    async redirect() {
      if (!(this.$route.query.reference && this.$route.query.trxref && this.$route.params.bookId)) return;
      try {
        await db.collection('transaction_paystack').doc(this.$route.query.reference).update({
          trxref: this.$route.query.trxref,
        });
        const formData = new FormData();
        formData.append('bookid', this.$route.params.bookId);
        formData.append('key', this.$route.query.reference);
        formData.append('status', 1);
        formData.append('txnid', this.$route.query.trxref);
        await axios({
          method: 'post',
          url: 'https://api.beds24.com/custompaymentgateway/notify.php',
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
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
