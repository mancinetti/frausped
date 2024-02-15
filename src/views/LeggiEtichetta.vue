<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="title"
          >Etichetta spedizione {{ decod_sede }}<br />
          <b>{{ descrizione_sessione }}</b
          ><br />
          Colli: <span style="color: blue">{{ stato_sessione.num_coas }}</span
          >/ <span style="color: green"> {{ stato_sessione.num_corl }}</span
          >/
          <span style="color: rgb(56, 9, 97)"> {{ stato_sessione.num_coba }}</span>
          <br />
          Avanzamento: <span style="color: blue">{{ avanzamento_sessione.tocoas }}</span
          >/ <span style="color: green"> {{ avanzamento_sessione.torili }}</span
          >/
          <span style="color: rgb(56, 9, 97)"> {{ avanzamento_sessione.toboac }}</span>
        </ion-title>
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
        <div class="reader_pronto" v-if="chiusura == 1">Colli completati</div>
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
      <ion-button
        v-if="lettura == 1 && sciolte == '2'"
        type="button"
        @click="() => $router.push({ path: '/folder/borse' })"
        >Conferma Borse/Accessori
      </ion-button>
      <ion-button v-if="lettura == 1" type="button" @click="Leggi()"
        >Rileggi Et.
      </ion-button>
      <ion-button v-if="chiusura == 1" type="button" @click="ChiudiSessione()"
        >Chiudi Sessione
      </ion-button>
      <!--       <div v-if="cl == 'red'" class="red">{{ mess }}</div>
      <div v-if="cl == 'green'" class="green">{{ mess }}</div>
 -->
    </ion-toolbar>
  </ion-page>
</template>

<script>
import { ref, onMounted, reactive } from "vue";
import { leggiBarcode } from "@/composables/leggiBarcode";
import { Visual } from "@/composables/Visual";
const { BarQrCode, Test, retDebuData } = leggiBarcode();
const {
  sendToServer,
  getEtichetta,
  getStorage,
  getAvanzamentoSessione,
  execChiudiSessione,
} = Visual();
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
    ChiudiSessione() {
      //   this.stopInte();
      if (self.confirm("Confermi la chiusura della sessione ?") == true) {
        this.setChiudiSessione();
        self.location.href = "/folder/sessioni";
      }

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
    const descrizione_sessione = ref("");
    const stato_sessione = reactive({});
    const avanzamento_sessione = reactive({});
    const mess = ref("");
    const attesa = ref("");
    const id_sessione = ref(0);
    const cl = ref("red");
    const web = 0;
    const chiusura = ref(0);
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
    //    console.log(props);
    async function getNumeriSessione(id_sess) {
      ///      stato_sessione.value = await getStatoSessione(id_sessione);
      avanzamento_sessione.value = await getAvanzamentoSessione(id_sess);
      avanzamento_sessione.tocoas = avanzamento_sessione.value.tocoas;
      avanzamento_sessione.torili = avanzamento_sessione.value.torili;
      avanzamento_sessione.toboac = avanzamento_sessione.value.toboac;

      if (avanzamento_sessione.tocoas == stato_sessione.num_coas) {
        chiusura.value = 1;
      }
    }
    async function setChiudiSessione() {
      console.log(id_sessione);
      await execChiudiSessione(id_sessione.value);
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
      const sessione = etich.value.sessione.trim();
      decod_letta.value = decodSede(sede);
      if (localStorage.sede_preparazione != sede) {
        alert("Il codice letto è della sede " + decod_letta.value);
        return;
      }
      //      console.log(id_sessione, etich.value);
      if (id_sessione.value != sessione && sessione != 0) {
        alert(
          "Il codice letto non appartiene alla sessione corrente " +
            "\n corrente=" +
            id_sessione.value +
            "\nLetto=" +
            sessione
        );
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
          etich.value.codice_destinatario +
          " " +
          etich.value.ragione_sociale_destinatario;
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
      const asso = codice.value.substr(8, 2);
      const cod = codice.value.trim();
      if (cod.length == 11) {
        sciolte.value = 1;
      } else {
        if (asso == "99" || asso == "CI") {
          sciolte.value = 2;
        } else {
          sciolte.value = 0;
          if (res == "200") {
            setTimeout(() => {
              self.location.href = "/folder/collo";
            }, 3000);
          }
        }
      }
      // console.log("*" + codice.value + "*", asso, sciolte.value);
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
        const tmpsess = localStorage.sessione_corrente;
        if (tmpsess === "") {
          descrizione_sessione.value = "";
          self.location.href = "/folder/sessioni";
        } else {
          const vtmp = tmpsess.split("|");
          id_sessione.value = vtmp[0];
          descrizione_sessione.value = vtmp[1];
          stato_sessione.num_coas = vtmp[2];
          stato_sessione.num_corl = vtmp[3];
          stato_sessione.num_coba = vtmp[4];

          getNumeriSessione(id_sessione.value);
          LeggiCodice();
        }
      }
    );
    return {
      LeggiCodice,
      BarQrCode,
      getEtichetta,
      getNumeriSessione,
      setChiudiSessione,
      Test,
      mess,
      cl,
      attesa,
      router,
      getStorage,
      lettura,
      chiusura,
      sciolte,
      foglio,
      progressivo,
      destinatario,
      codice,
      id_sessione,
      cliente,
      decod_sede,
      decod_letta,
      etichetta_letta,
      descrizione_sessione,
      stato_sessione,
      avanzamento_sessione,
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
