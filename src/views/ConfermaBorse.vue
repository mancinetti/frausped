<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title
          >Etichetta spedizione<br />
          Giro {{ descrizione_giro }} {{ stato_giro.totcol }}/{{ stato_giro.tocolpre }}/{{
            stato_giro.tocolnop
          }}</ion-title
        >
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <div id="container">
      <div class="card">
        <ion-item>
          <div class="item item-divider borse">
            <b>Etichetta Per Borse/Accessori </b>
          </div>
        </ion-item>
        <ion-item>
          <p>Cliente:</p>
          <div class="field">{{ cliente }}</div>
        </ion-item>
        <ion-item v-if="destinatario != ''">
          <p>Destinatario:</p>
          <div class="field">{{ destinatario }}</div>
        </ion-item>
        <ion-item>
          <p>Ordine/riga/progressivo:</p>
          <div class="field">{{ progressivo }}</div>
        </ion-item>

        <!--        <ion-item>
          <p>Sede:</p>
          <div class="field">{{ decod_sede[sede] }}</div>
        </ion-item>
 -->
        <ion-item>
          <p>Foglio preparazione:</p>
          <div class="field">{{ foglio }}</div>
        </ion-item>
        <ion-item>
          <p>Codice collo:</p>
          <div class="field">
            <b>{{ codice }}</b>
          </div>
        </ion-item>
      </div>
    </div>
    <ion-item v-if="lettura == 1 || lettura == 9">
      <div v-if="cl == 'red'" class="red">{{ mess }}</div>
      <div v-if="cl == 'green'" class="green">{{ mess }}</div>
    </ion-item>
    <ion-toolbar>
      <ion-button v-if="lettura != 1" type="button" @click="Conferma()"
        >Conferma
      </ion-button>
      <ion-button v-if="lettura == 1" type="button" @click="GoEtichetta()"
        >vai a Lettura Etichette
      </ion-button>
    </ion-toolbar>
  </ion-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { Visual } from "@/composables/Visual";
const { sendToServer, getEtichetta, getStorage, getGiro } = Visual();
import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";

export default {
  components: {
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
  },
  props: {
    update: String,
  },
  methods: {
    GoEtichetta() {
      self.location.href = "/folder/etichetta";
      //     this.router.push({ path: '/folder/collo' })
    },
    Conferma() {
      this.SetBorse();
      // this.GoEtichetta();
    },
  },

  setup(props) {
    const lettura = ref(0);
    const borse = ref(0);
    const descrizione_giro = ref("");
    const stato_giro = ref({});
    const mess = ref("");
    const attesa = ref("");
    const cl = ref("red");
    const etich = ref({});
    const router = useRouter();
    const progressivo = ref("");
    const foglio = ref("");
    const codice = ref("");
    const cliente = ref("");
    const destinatario = ref("");
    const decod_sede = ref();
    const etichetta_letta = ref(0);
    const taglie = ref("");
    console.log(props);
    async function getNumeriGiro(id_giro) {
      stato_giro.value = await getGiro(id_giro);
    }
    async function SetBorse() {
      const dati_etich = localStorage.etichetta;
      const etich = getEtichetta(dati_etich);
      const res = await sendToServer("receive", etich, 1);
      console.log("*" + res + "*");

      //     res = res.strsub(0, 1);
      lettura.value = 1;
      if (res == "200") {
        mess.value = "risposta dal server: Etichetta aggiornata";
        cl.value = "green";
      } else if (res == "99") {
        mess.value = "risposta dal server: Errore comunicazione";
        cl.value = "red";
      }
      //     alert(mess.value);
    }
    async function LeggiCodice() {
      const etich_area = localStorage.etichetta;
      etich.value = getEtichetta(etich_area);
      //    console.log(etich.value);
      foglio.value = etich.value.num_foglio;
      const sede = etich.value.sede;
      switch (sede) {
        case "F":
          decod_sede.value = "San giovanni";
          break;
        case "M":
          decod_sede.value = "Montecchia";
          break;
      }
      codice.value = etich.value.codice;
      progressivo.value =
        etich.value.num_ordine +
        "/" +
        etich.value.num_riga +
        "/" +
        etich.value.progressivo;
      cliente.value = etich.value.codice_cliente + " " + etich.value.ragione_sociale;
      if (etich.value.codice_destinatario.trim() != "")
        destinatario.value =
          etich.value.codice_destinatario + " " + etich.value.ragione_destinatario;
      else destinatario.value = "";
      etichetta_letta.value = 1;
      const res = await sendToServer("checkSped", etich.value, 1);
      console.log("risposta = ", res);
      if (res == "200") {
        localStorage.etichetta = etich_area;
        lettura.value = 0;
      } else if (res == "99") alert("Etichetta non trovata sul server");
      else if (res == "90") alert("Sede non coerente");
      else if (res == "91") alert("Etichetta già preparata");
      else if (res == "92") {
        if (
          self.confirm(
            "Per questa etichetta si è già dichiarato collo non presente: Si va comunque alla lettura del collo ?"
          ) == true
        ) {
          localStorage.etichetta = etich_area;
          lettura.value = 9;
        }
      } else {
        alert(res);
        localStorage.etichetta = etich_area;
        lettura.value = 9;
      }
      if (codice.value.length == 11) {
        borse.value = 1;
      } else {
        borse.value = 0;
      }
    }
    /*     const stopInte = () => {
      clearInterval(int.value);
      elapsedTime = 0;
    };
 */ onMounted(
      () => {
        LeggiCodice();
        console.log("mounted");
        cl.value = "";
        lettura.value = 0;
        const tmpgiro = localStorage.sessione_corrente;
        if (tmpgiro === "") {
          descrizione_giro.value = "";
          self.location.href = "/folder/sessioni";
        } else {
          const vtmp = tmpgiro.split("|");
          descrizione_giro.value = vtmp[1];
          getNumeriGiro(vtmp[0]);
        }
      }
    );
    return {
      LeggiCodice,

      getEtichetta,
      getNumeriGiro,

      mess,
      cl,
      attesa,
      router,
      getStorage,
      lettura,
      borse,
      foglio,
      progressivo,
      destinatario,
      codice,
      cliente,
      decod_sede,
      etichetta_letta,
      descrizione_giro,
      stato_giro,
      taglie,
      SetBorse,
    };
  },
};
</script>

<style scoped>
.scanner-wrapper {
  width: 600px;

  border-left: 1px solid grey;
  border-right: 1px solid grey;
}

.red {
  margin-top: 100px;
  margin-left: 50px;
  width: 200px;
  height: 100px;
  display: block;
  background-color: red;
}

.reader_pronto {
  text-align: center;
  width: 150px;
  height: 20px;
  margin-left: 10em;
  margin-right: 20px;
  border-color: 1px solid blue;
  border-radius: 25px;
  background-color: rgb(90, 138, 168);
}

.reader_ok {
  text-align: center;
  width: 150px;
  height: 20px;
  margin-left: 10em;
  margin-right: 20px;
  border-color: 1px solid blue;
  border-radius: 25px;
  background-color: green;
}

.green {
  margin-top: 100px;
  margin-left: 50px;
  width: 200px;
  height: 100px;
  display: block;
  background-color: green;
}

.card {
  margin-left: 0px !important;
}

.field {
  margin-left: 5px;
  font-weight: bold;
  text-align: left;
}

.camera {
  margin: 0;
  max-width: 640px;
  max-height: 300px;
  display: block;
  border-color: 1px solid blue;
}

body.scanner-active {
  --background: transparent;
  --ion-background-color: transparent;

  max-width: 640px;
  max-height: 300px;
  margin-left: 0px;
  border-color: 1px solid blue;

  display: block;
}

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

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}
.borse {
  text-align: center;
  padding: 10px;
  width: 400px;
  height: 40px;
  font-size: large;
  font-weight: bold;
  margin-left: 3em;
  margin-right: 20px;
  color: white;
  border-color: 1px solid rgb(3, 20, 13);
  border-radius: 25px;
  background-color: rgb(8, 71, 33);
}

#container a {
  text-decoration: none;
}
</style>
