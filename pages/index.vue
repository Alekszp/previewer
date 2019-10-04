<template>
  <b-card-group columns class="p-3">
    <div v-for="(product, index) in $store.state.productsList" :key="index">
      <b-card style="width: 250px" :img-src="product.img" img-top :title="product.title">
        <b-card-text>{{product.text}}.</b-card-text>
        <nuxt-link :to="{ path: `/product/${product.id}`}">
          <b-button variant="primary">Details</b-button>
        </nuxt-link>
      </b-card>
    </div>
  </b-card-group>
</template>