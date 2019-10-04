<template>
  <div>
    <b-row v-if="!isLoading">
      <b-col cols="4" md="auto">
        <b-card style="width: 350px" :img-src="productInfo.img" img-top :title="productInfo.title">
          <b-card-text>{{productInfo.text}}.</b-card-text>
        </b-card>
      </b-col>
      <b-col cols="8" md="auto">
        <b-row v-if="$store.state.authorization" class="mb-3">
          <vue-star-rating v-model="rating" class="mb-3"></vue-star-rating>
          <b-form-textarea
            v-model="text"
            placeholder="Enter something..."
            rows="3"
            max-rows="6"
            class="mb-3"
          ></b-form-textarea>
          <b-button @click="sendReview" variant="success">Send</b-button>
        </b-row>
        <h3>Reviews {{reviews.length}}</h3>
        <b-list-group v-for="(review, index) in reviews" :key="index">
          <b-list-group-item class="mb-2">
            <h5>
              {{review.created_by.username}}
              <small>at {{formatDate(review.created_at)}}</small>
            </h5>

            <div>Rate: {{review.rate}}</div>
            <div>Comment: {{review.text}}</div>
          </b-list-group-item>
        </b-list-group>
        <b-row></b-row>
      </b-col>
    </b-row>

    <div v-else class="spinnerCenter">
      <b-spinner type="grow" variant="info" label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import Cookie from "js-cookie";
import starRating from "vue-star-rating";

export default {
  name: "product",
  components: {
    "vue-star-rating": starRating
  },
  data() {
    return {
      isLoading: false,
      productInfo: {},
      reviews: [],
      text: "",
      rating: 0
    };
  },
  created() {
    this.getProductreviews();
    this.productInfo = _.find(this.$store.state.productsList, product => {
      return product.id === parseInt(this.$route.params.id, 10);
    });
  },
  methods: {
    formatDate(date) {
      return moment(date).format("DD MMMM YYYY, hh:mm:ss ");
    },
    async getProductreviews() {
      this.isLoading = true;
      await axios
        .get(
          `http://smktesting.herokuapp.com/api/reviews/${this.$route.params.id}`
        )
        .then(res => {
          this.reviews = res.data.reverse();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async sendReview() {
      if (!this.$store.state.authorization) {
        this.$bvToast.toast("You should be authorized at first", {
          title: "WARNING",
          autoHideDelay: 3000
        });
        return;
      }
      if (this.text.length < 5 && this.rating <= 0) {
        this.$bvToast.toast(
          "Review should contain at least 6 symbols and rating should be more than 0",
          {
            title: "WARNING",
            autoHideDelay: 3000
          }
        );
      } else {
        let token = Cookie.get("token");
        await axios({
          url: `http://smktesting.herokuapp.com/api/reviews/${this.$route.params.id}`,
          method: "post",
          headers: { Authorization: `Token ${token}` },
          data: {
            rate: this.rating,
            text: this.text
          }
        }).then(res => {
          let review = {
            rate: this.rating,
            text: this.text,
            created_by: {
              username: this.$store.state.authUser
            },
            created_at:  moment().format("DD MMMM YYYY, hh:mm:ss ")
          }
          this.reviews.unshift(review)
          this.rating = 0
          this.text = ""
        });
      }
    }
  }
};
</script>
<style scoped>
.spinnerCenter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
}
</style>
