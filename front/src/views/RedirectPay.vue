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
import { postFormHTML } from '@/services/general';
import { checkoutPaystackBooking } from '@/api';

export default {
  data() {
    return {}
  },
  computed: {},
  methods: {
    async redirect() {
      if (!(this.$route.query.reference && this.$route.query.trxref && this.$route.params.id && this.$route.params.bookId)) {
        this.$router.go(-2);
        return;
      }
      try {
        const result = (await checkoutPaystackBooking({
          hotelId: this.$route.params.id,
          bookid: this.$route.params.bookId,
          txnid: this.$route.query.trxref,
          status: 1
        })).data;
        postFormHTML('https://api.beds24.com/custompaymentgateway/notify.php', {
          key: result.bed24Key,
          bookid: this.$route.params.bookId,
          txnid: this.$route.query.trxref,
          status: 1
        })
        this.$buefy.toast.open({
          message: 'Beds24 is notify',
          type: 'is-primary',
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
