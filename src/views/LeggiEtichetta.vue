<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="title"
          >Etichetta spedizione {{ decod_sede }}<br />
          Giro <b>{{ descrizione_giro }}</b
          ><br />
          Colli: <span style="color: blue">{{ stato_giro.totcol }}</span
          >/
          <span style="color: white; background-color: green">
            {{ stato_giro.tocolpre }}</span
          >/ <span style="color: red"> {{ stato_giro.tocolnop }}</span></ion-title
        >
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <div id="container">
      <div class="scanner-wrapper">
        <div class="camera"></div>
      </div>
    </div>
    <div v-if="etichetta_letta == 1">
      <div class="card">
        <ion-item>
          <div class="item item-divider">
            <b>Etichetta letta: (sede {{ decod_letta }})</b>
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
        <div v-if="sciolte == 1" class="sciolte">PAIA SCIOLTE</div>
      </div>
    </div>
    <ion-toolbar>
      <ion-item>
        <div class="reader_pronto" v-if="lettura == 0">Pronto per la lettura</div>
        <div class="reader_ok" v-if="lettura == 1">Etichetta letta</div>
      </ion-item>
      <ion-button v-if="lettura == 0" type="button" @Click="Leggi()"
        >Leggi Etichetta Spedizione
      </ion-button>
      <ion-button
        v-if="lettura == 1 && sciolte == '0'"
        type="button"
        @click="() => $router.push({ path: '/folder/collo' })"
        >Leggi Collo
      </ion-button>
      <ion-button
        v-if="lettura == 1 && sciolte == '1'"
        type="button"
        @click="() => $router.push({ path: '/folder/sciolti' })"
        >Conferma Paia Sciolte
      </ion-button>
      <ion-button v-if="lettura == 1" type="button" @click="Leggi()"
        >Rileggi Et.
      </ion-button>
      <!--       <div v-if="cl == 'red'" class="red">{{ mess }}</div>
      <div v-if="cl == 'green'" class="green">{{ mess }}</div>
 -->
    </ion-toolbar>
  </ion-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { leggiBarcode } from "@/composables/leggiBarcode";
import { Visual } from "@/composables/Visual";
const { BarQrCode, Test, retDebuData } = leggiBarcode();
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
    Leggi() {
      //   this.stopInte();
      this.lettura = 0;
      this.LeggiCodice();
      /*       this.mess = this.TestStatus();
      this.cl = this.sendAudio({ flag: true });
      alert("cl" + this.cl + this.mess);
 */
    },
    GoCollo() {
      self.location.href = "/folder/collo";
    },
    GoEtichetta() {
      self.location.href = "/folder/etichetta";
      //     this.router.push({ path: '/folder/collo' })
    },
  },

  setup(props) {
    const lettura = ref(0);
    const sciolte = ref(0);
    const descrizione_giro = ref("");
    const stato_giro = ref({});
    const mess = ref("");
    const attesa = ref("");
    const cl = ref("red");
    const web = 0;
    const etich = ref({});
    const router = useRouter();
    const progressivo = ref("");
    const foglio = ref("");
    const codice = ref("");
    const cliente = ref("");
    const destinatario = ref("");
    const decod_sede = ref();
    const decod_letta = ref();
    const etichetta_letta = ref(0);
    console.log(props);
    async function getNumeriGiro(id_giro) {
      stato_giro.value = await getGiro(id_giro);
    }
    async function LeggiCodice() {
      //      cl.value = sendAudio({ flag: true });
      //     console.log(cl.value);
      etichetta_letta.value = 0;
      document.querySelector("body").classList.add("body.scanner-active");
      //      alert("lettura qr/bc");
      let etich_area = "";
      if (web == 1) etich_area = retDebuData();
      else etich_area = await BarQrCode();
      //    alert(etich_area);
      etich.value = getEtichetta(etich_area);
      //    console.log(etich.value);
      foglio.value = etich.value.num_foglio;
      if (foglio.value == "9999999") {
        alert("Il codice letto non è un'etichetta di spedizione");
        return;
      }
      const sede = etich.value.sede;
      decod_letta.value = decodSede(sede);
      if (localStorage.sede_preparazione != sede) {
        alert("Il codice letto è della sede " + decod_letta.value);
        return;
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
        lettura.value = 1;
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
          lettura.value = 1;
        }
      } else {
        alert(res);
        localStorage.etichetta = etich_area;
        lettura.value = 1;
      }
      if (codice.value.length == 11) {
        sciolte.value = 1;
      } else {
        sciolte.value = 0;
      }
      document.querySelector("body").classList.remove("scanner-active");
      //    getStorage();
      //   let isPaused = false;
      /*       let int = setInterval(function () {
        if (!isPaused) {
          elapsedTime++;
          if (elapsedTime == 20) {
            cl.value = sendAudio({ flag: false });
            attesa.value = "";
          } else attesa.value = "Elapsed Seconds: " + elapsedTime;
        }
      }, 10);
 */
    }
    function decodSede(sede) {
      switch (sede) {
        case "F":
          return "San giovanni";

        case "M":
          return "Montecchia";
        default:
          return "";
      }
    }

    /*     const stopInte = () => {
      clearInterval(int.value);
      elapsedTime = 0;
    };
 */ onMounted(
      () => {
        decod_sede.value = decodSede(localStorage.sede_preparazione);
        cl.value = "";
        lettura.value = 0;
        const tmpgiro = localStorage.giro_corrente;
        if (tmpgiro === "") {
          descrizione_giro.value = "";
          self.location.href = "/folder/giri";
        } else {
          const vtmp = tmpgiro.split("|");
          descrizione_giro.value = vtmp[1];
          getNumeriGiro(vtmp[0]);
        }
      }
    );
    return {
      LeggiCodice,
      BarQrCode,
      getEtichetta,
      getNumeriGiro,
      Test,
      mess,
      cl,
      attesa,
      router,
      getStorage,
      lettura,
      sciolte,
      foglio,
      progressivo,
      destinatario,
      codice,
      cliente,
      decod_sede,
      decod_letta,
      etichetta_letta,
      descrizione_giro,
      stato_giro,
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
  margin-top: 50px;
  margin-left: 20px;
  width: 200px;
  height: 200px;
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
.sciolte {
  text-align: center;
  padding: 10px;
  width: 250px;
  height: 40px;
  font-size: large;
  font-weight: bold;
  margin-left: 3em;
  margin-right: 20px;
  border-color: 1px solid blue;
  border-radius: 25px;
  background-color: rgb(205, 208, 23);
}

.green {
  margin-top: 50px;
  margin-left: 20px;
  width: 200px;
  height: 200px;
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
.title {
  font-size: 0.8em;
  color: blue;
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

#container a {
  text-decoration: none;
}
</style>
