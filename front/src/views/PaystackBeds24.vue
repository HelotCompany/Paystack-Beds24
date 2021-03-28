<template>
  <div class="container is-max-desktop px-4 mt-6" style="height: 100%">
    <h1 class="has-text-centered title">Paystack + Beds24</h1>
    <h4 class="has-text-centered subtitle mb-6">Manage your account effectively</h4>
    <form class="mb-6">
      <div class="columns is-multiline is-centered">
        <div class="column is-6">
          <b-field 
            label="First Name">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.firstName">
            </b-input>
          </b-field>
        </div>
        <div class="column is-6">
          <b-field 
            label="Last Name">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.lastName">
            </b-input>
          </b-field>
        </div>
        <div class="column is-6">
          <b-field 
            label="Email">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.email">
            </b-input>
          </b-field>
        </div>
        <div class="column is-6">
          <b-field 
            label="Phone">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.phone">
            </b-input>
          </b-field>
        </div>
        <div class="column is-12">
          <b-field 
            label="Paystack Public Key">
            <b-input 
              custom-class="custum-input"
              v-model="infoData.paystackKey">
            </b-input>
          </b-field>
        </div>
        <div class="column is-3">
          <b-button 
            type="is-primary"
            expanded
            label="Save"
            class="has-text-weight-bold"/>
        </div>
      </div>
    </form>
    <div class="columns is-centered">
      <div class="column is-narrow">
        <div class="level is-mobile" style="height: 100%">
          <div class="level-left mr-3">
            <div class="cercle cercle__inactive"></div>
          </div>
          <div class="level-right mr-6">
            <span class="has-text-weight-bold">Inactive</span>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <b-button
          type="is-primary"
          expanded
          label="Subscribe"
          class="has-text-weight-bold"/>
      </div>
    </div>
    <div>
      <b-field 
        label="Bed24 Key">
        <b-input 
          custom-class="custum-input"
          v-model="bed24Key">
        </b-input>
      </b-field>
      <b-field 
        label="Payment Url">
        <b-input 
          custom-class="custum-input"
          v-model="payementUrl">
        </b-input>
      </b-field>
    </div>
  </div>
</template>

<script>

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
      bed24Key: '',
      payementUrl: '',
      privacyPolicy: true,
    }
  }
}
</script>
