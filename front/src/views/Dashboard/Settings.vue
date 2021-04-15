<template>
  <div class="container">
    <h1 class="title has-text-centered">Settings</h1>
    <div class="is-flex is-justify-content-center">
      <form class="columns is-multiline is-centered" style="max-width: 800px">
        <div class="column is-12">
          <b-field 
            label="Bed24 Key">
            <template #label>
              Bed24 Key
              <b-tooltip type="is-color-background">
                <b-icon
                  icon="help-circle"
                  type="is-success"
                  size="is-small">
                </b-icon>
                <template v-slot:content>
                  <b>Bed24 Key:</b> <br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </template>
              </b-tooltip>
            </template>
            <b-input 
              custom-class="custum-input"
              v-model="user.bed24Key"
              disabled
              expanded>
            </b-input>
            <p class="control">
              <b-button
                type="is-disabled"
                class="has-text-primary"
                @click="copyToClipboard(user.bed24Key)">
                <img src="@/assets/images/copy-icon.svg" width="25" alt="">
              </b-button>
            </p>
          </b-field>
        </div>
        <div class="column is-12">
          <b-field 
            label="Payment Url">
            <template #label>
              Payment Url
              <b-tooltip type="is-color-background">
                <b-icon
                  icon="help-circle"
                  type="is-success"
                  size="is-small">
                </b-icon>
                <template v-slot:content>
                  <b>Payment Url:</b> <br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </template>
              </b-tooltip>
            </template>
            <b-input 
              custom-class="custum-input"
              v-model="user.payementUrl"
              disabled
              expanded>
            </b-input>
            <p class="control">
              <b-button
                type="is-disabled"
                class="has-text-primary"
                @click="copyToClipboard(user.payementUrl)">
                <img src="@/assets/images/copy-icon.svg" width="25" alt="">
              </b-button>
            </p>
          </b-field>
        </div>
        <div class="column is-12">
          <b-field 
            label="Post data">
            <template #label>
              Post data
              <b-tooltip type="is-color-background">
                <b-icon
                  icon="help-circle"
                  type="is-success"
                  size="is-small">
                </b-icon>
                <template v-slot:content>
                  <b>Post data:</b> <br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </template>
              </b-tooltip>
            </template>
            <b-input 
              custom-class="custum-input"
              v-model="code"
              disabled
              expanded>
            </b-input>
            <p class="control">
              <b-button
                type="is-disabled"
                class="has-text-primary"
                @click="copyToClipboard(code)">
                <img src="@/assets/images/copy-icon.svg" width="25" alt="">
              </b-button>
            </p>
          </b-field>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
    code() {
      const currencie = this.user ? this.user.currencie || this.user.country.currencies[0].code : ''
      return `currency=${currencie}&bookid=[BOOKID]&amount=[PAYMENTAMOUNT]&email=[GUESTEMAIL]&description=Deposit Payment for [PROPERTYNAME]`
    },
  },
  methods: {
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
          type: 'is-primary',
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
  },
  async mounted() {}
}
</script>

<style>

</style>