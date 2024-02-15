<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.params.id }} </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="grid-font ion-margin" :fixed="true">
        <ion-row style="background-color: grey">
          <!--          <ion-col size="1">Sede </ion-col>
 -->
          <ion-col size="1"> </ion-col>
          <ion-col size="4">Sessione </ion-col>
          <ion-col size="3">Data spedizione </ion-col>
          <ion-col size="4" style="text-align: left">Ass/Sciolti/Borse</ion-col>
          <!--          <ion-col size="1" style="text-align: center">Paia sciolte</ion-col>
          <ion-col size="1" style="text-align: center">Borse</ion-col>
 -->
        </ion-row>
        <ion-row
          v-for="item in items"
          :key="item.id"
          style="background-color: lightgrey; border: 1px solid grey"
        >
          <ion-col size="1" class="ion-text-center">
            <input
              type="radio"
              v-if="item.azienda_produzione == azicorr && item.id_sessione != selected"
              :value="item.id_sessione"
              :id="'radio' + item.id_sessione"
              v-model="selected"
              v-on:click="setSessione(item.id_sessione)"
            />

            <ion-icon
              v-if="item.azienda_produzione == azicorr && item.id_sessione == selected"
              :md="mdicon"
              :id="'sel' + item.id_sessione"
              v-model="item.id_sessione"
              v-on:click="setSessione(item.id_sessione)"
            ></ion-icon>
          </ion-col>
          <!--           <ion-col size="1"> {{ item.azienda_produzione }} </ion-col>
 -->
          <ion-col size="4">
            {{ item.descrizione_sessione }}
          </ion-col>
          <ion-col size="3">
            {{ item.data_prevista_spedizione }}
          </ion-col>

          <ion-col size="4" style="text-align: left">
            {{ item.num_coas }} - {{ item.num_corl }} - {{ item.num_coba }}
          </ion-col>
          <!--           <ion-col size="1" style="text-align: center">
           
          </ion-col>
          <ion-col size="1" style="text-align: center">
            
          </ion-col>
 -->
        </ion-row>
      </ion-grid>
      <!--       <ion-toolbar>
        <ion-button type="button" @Click="setSessione()"
          >Conferma Sessione Spedizione
        </ion-button>
      </ion-toolbar>
 -->
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
} from "@ionic/vue";

import { Visual } from "@/composables/Visual";
const { getSessioniFromServer } = Visual();

import { ref, onMounted } from "vue";
import { paperPlaneSharp } from "ionicons/icons";
export default {
  components: {
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonContent,
    IonCol,
    IonGrid,
    IonRow,
    IonIcon,
  },
  props: {
    id_evento: String,
    timestamp: String,
  },
  methods: {
    CheckRadio(id) {
      // alert(id);
      if (document.getElementById("sel" + id) != null) {
        this.el_checked = true;
        this.setSessione();
      }
      //   console.log("check" + document.getElementById("sel" + id));
      //     if (document.getElementById("radio" + id).checked == true) alert("checked");
    },
    setSessione(id) {
      for (let i = 0; i < this.items.length; i++) {
        if (id == this.items[i].id_sessione) {
          /*           if (
            self.confirm(
              "Confermi la selezione della sessione" + this.items[i].descrizione_sessione
            ) == true
          ) {
 */
          localStorage.sessione_corrente =
            this.items[i].id_sessione +
            "|" +
            this.items[i].descrizione_sessione +
            "|" +
            this.items[i].num_coas +
            "|" +
            this.items[i].num_corl +
            "|" +
            this.items[i].num_coba;
          // console.log(localStorage);

          self.location.href = "/folder/etichetta";
          break;
        }
      }
    },
  },
  setup() {
    const mdicon = ref(paperPlaneSharp);
    const items = ref([{}]);
    const selected = ref(0);
    const el_checked = ref(false);
    const tmpsessione = localStorage.sessione_corrente;
    const azicorr = ref(localStorage.sede_preparazione);

    if (tmpsessione === undefined || tmpsessione == "") {
      selected.value = "";
    } else {
      const vtmp = tmpsessione.split("|");
      selected.value = vtmp[0];
    }
    async function getItems() {
      items.value = await getSessioniFromServer();
      for (let i = 0; i < items.value.length; i++) {
        const item = items.value[i];
        const annosp = item.data_prevista_spedizione.substr(0, 4);
        const mesesp = item.data_prevista_spedizione.substr(5, 2);
        const giornosp = item.data_prevista_spedizione.substr(8, 2);
        items.value[i].data_prevista_spedizione = giornosp + "-" + mesesp + "-" + annosp;
      }
    }
    onMounted(() => {
      getItems();
    });
    return { getItems, items, selected, mdicon, el_checked, azicorr };
  },
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

ion_col {
  background-color: rgb(35, 9, 79);
  border: solid 1px #140202;
  color: #180202;
}

.grid-font {
  font-size: 0.8em;
  width: 95%;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
