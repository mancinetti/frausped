<template>
  <div class="grid" ref="gridDivRef" id="gridDiv">
    <ion-grid>
      <ion-row>
        <ion-col>
          <div>Data evento</div>
        </ion-col>
        <ion-col>
          <div>Luogo</div>
        </ion-col>
        <ion-col>
          <div>descrizione</div>
        </ion-col>
      </ion-row>

      <ion-row v-for="original in items" v-bind:key="original">
        <ion-col>
          <div>{{ original.data_evento }}</div>
        </ion-col>
        <ion-col>
          <div>{{ original.luogo }}</div>
        </ion-col>
        <ion-col>
          <div>{{ original.descrizione }}</div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>
  

<script >
import { ref, onBeforeMount, onMounted } from "vue";
import axios from "axios";
axios.defaults.baseURL = "http://www.trainind.com";
import { IonGrid } from "@ionic/vue";
export default {
  name: "Grid_cmp",
  props: {
    lat: null,
    lng: null,
  },
  components: {
    IonGrid,
  },
  data() {
    return {
      numcols: 0,
      items: [{}],
    };
  },
  methods: {
    display(lat,lng){
      console.log(lat,lng)
    }


  },
  mounted() {
    let url =
      "http://www.trainind.com/leggieventidaapp?latitude=" +
      this.lat +
      "&longitude=" +
      this.lng;
    console.log(url);
    let config = {
      url,
      method: "get",
      headers: { Accept: "application/json, text/plain, *" },
    };
    axios.request(config).then((response) => {
      //console.log(response.data)
      this.items = response.data.original;
      console.log(this.items);
    });
  },
};
</script>


