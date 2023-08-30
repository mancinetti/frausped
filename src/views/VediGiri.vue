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
          <ion-col size="1"></ion-col>
          <!--          <ion-col size="1">Sede </ion-col>
 -->
          <ion-col size="4">Giro </ion-col>
          <ion-col size="4">Corriere </ion-col>
          <ion-col size="1" style="text-align: center">Co </ion-col>
          <ion-col size="1" style="text-align: center">Pr</ion-col>
          <ion-col size="1" style="text-align: center">Nop</ion-col>
        </ion-row>
        <ion-row
          v-for="item in items"
          :key="item.id"
          style="background-color: lightgrey; border: 1px solid grey"
        >
          <ion-col size="1" class="ion-text-center">
            <input
              type="radio"
              v-if="item.azienda_produzione == azicorr && item.id_giro != selected"
              :value="item.id_giro"
              :id="'radio' + item.id_giro"
              v-model="selected"
            />

            <ion-icon
              v-if="item.azienda_produzione == azicorr && item.id_giro == selected"
              :md="mdicon"
              :id="'sel' + item.id_giro"
            ></ion-icon>
          </ion-col>
          <!--           <ion-col size="1"> {{ item.azienda_produzione }} </ion-col>
 -->
          <ion-col size="4">
            {{ item.descrizione_giro }}
          </ion-col>

          <ion-col size="4">
            {{ item.denominazione_vettore }}
          </ion-col>
          <ion-col size="1" style="text-align: center">
            {{ item.totcol }}
          </ion-col>
          <ion-col size="1" style="text-align: center">
            {{ item.tocolpre }}
          </ion-col>
          <ion-col size="1" style="text-align: center">
            {{ item.tocolnop }}
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-toolbar>
        <ion-button type="button" @Click="setGiro()">Conferma Giro </ion-button>
      </ion-toolbar>
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
const { getGiriFromServer } = Visual();

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
      }
      //   console.log("check" + document.getElementById("sel" + id));
      //     if (document.getElementById("radio" + id).checked == true) alert("checked");
    },
    setGiro() {
      for (let i = 0; i < this.items.length; i++) {
        if (this.selected == this.items[i].id_giro) {
          if (
            self.confirm(
              "Confermi la selezione del giro " + this.items[i].descrizione_giro
            ) == true
          ) {
            localStorage.sessione_corrente =
              this.items[i].id_giro + "|" + this.items[i].descrizione_giro;
            self.location.href = "/folder/etichetta";
          }
        }
      }
    },
  },
  setup() {
    const mdicon = ref(paperPlaneSharp);
    const items = ref([{}]);
    const selected = ref(0);
    const el_checked = ref(false);
    const tmpgiro = localStorage.sessione_corrente;
    const azicorr = ref(localStorage.sede_preparazione);

    if (tmpgiro === undefined || tmpgiro == "") {
      selected.value = "";
    } else {
      const vtmp = tmpgiro.split("|");
      selected.value = vtmp[0];
    }
    async function getItems() {
      items.value = await getGiriFromServer();
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
