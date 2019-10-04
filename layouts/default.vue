<template>
  <div>
   <nav-header />
     <div class="app-content">
       <nuxt />
     </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import header from "~/components/Header";

export default {
  transition: "bounce",
  components: {
    'nav-header': header
  },
  
};
</script>

<style>
.app-content {
  min-height: 90vh;
  padding: 20px;
}
</style>
