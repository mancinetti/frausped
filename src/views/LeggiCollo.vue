<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title
          >{{ foglio }} <b>{{ codice }}</b
          ><br />Legge Collo {{ ordine }}/{{ riga }}/{{ progressivo }}
          {{ sede }}</ion-title
        >
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <div v-if="lettura == 0" id="container">
      <div class="scanner-wrapper">
        <div class="camera"></div>
      </div>
    </div>
    <ion-item v-if="lettura == 1 || lettura == 9">
      <div v-if="cl == 'red'" class="red">{{ mess }}</div>
      <div v-if="cl == 'green'" class="green">{{ mess }}</div>
    </ion-item>
    <br />
    <div class="reader_pronto" v-if="lettura == 0">Pronto per la lettura</div>
    <div class="reader_ok" v-if="lettura == 1">Etichetta letta</div>
    <ion-toolbar>
      <ion-button v-if="lettura == 0" type="button" @Click="Leggi()"
        >Leggi Codice
      </ion-button>
      <ion-button v-if="lettura == 9" type="button" @Click="Leggi()"
        >Rileggi Codice
      </ion-button>
      <ion-button v-if="lettura == 1" type="button" @click="GoEtichetta()"
        >Nuova Etichetta Sped. </ion-button
      ><br />
      <ion-button v-if="lettura != 1" type="button" @click="GoNoCollo()">
        Dichiara Collo non Presente
      </ion-button>
      <ion-button v-if="lettura != 1" type="button" @click="GoEtichetta()"
        >Torna a lettura Etichetta
      </ion-button>
    </ion-toolbar>
  </ion-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { leggiBarcode } from "@/composables/leggiBarcode";
import { Visual } from "@/composables/Visual";
const { BarQrCode, retDebuCollo } = leggiBarcode();
const { sendToServer, getEtichetta, getCollo } = Visual();
import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/vue";

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
      this.LeggiCodice();
    },
    GoCollo() {
      //      self.location.href='/folder/collo'
      this.router.push({ path: "/folder/collo" });
    },
    GoEtichetta() {
      self.location.href = "/folder/etichetta";
      //     this.router.push({ path: '/folder/collo' })
    },
    GoNoCollo() {
      this.SetNoCollo();
    },
  },

  setup() {
    const lettura = ref(0);
    lettura.value = 0;
    const mess = ref("");
    const attesa = ref("");
    const cl = ref("red");
    const web = 0;
    const progressivo = ref("");
    const codice = ref("");
    const foglio = ref("");
    const sede = ref("");
    const ordine = ref("");
    const riga = ref("");
    async function SetNoCollo() {
      if (self.confirm("Confermi la mancanza del collo ?") == false) return;
      lettura.value = 0;
      const dati_etich = localStorage.etichetta;
      const etich = getEtichetta(dati_etich);
      const res = await sendToServer("receive", etich, 9);
      //       alert("risposta = " + res);
      if (res == "200") {
        mess.value = "risposta dal server: Etichetta aggiornata:Collo Mancante";
        cl.value = "green";
      } else if (res == "99") {
        mess.value = "risposta dal server: Errore comunicazione";
        cl.value = "red";
      }
      lettura.value = 1;
    }
    async function LeggiCodice() {
      //      cl.value = sendAudio({ flag: true });
      //     console.log(cl.value);
      lettura.value = 0;
      const dati_etich = localStorage.etichetta;
      console.log(dati_etich);
      const etich = getEtichetta(dati_etich);
      ordine.value = etich.num_ordine;
      riga.value = etich.num_riga;
      progressivo.value = etich.progressivo;
      codice.value = etich.codice;
      foglio.value = etich.num_foglio;
      sede.value = etich.sede;
      console.log("etichetta", etich);
      document.querySelector("body").classList.add("body.scanner-active");
      //      alert("lettura qr/bc");
      let collo_area = "";
      if (web == 1) collo_area = retDebuCollo();
      else collo_area = await BarQrCode();

      const collo = getCollo(collo_area);
      if (collo.codice == "") {
        alert("il Codice letto non appartiene ad un collo");
        return;
      }
      /*       alert(
            "codice collo = " +
            collo.codice + " Codice su Etichetta = " + etich.codice
          );
          console.log(collo, "collo*", collo.codice + "* etic *" + etich.codice + "*"); */
      if (etich.codice.trim() == collo.codice.trim()) {
        cl.value = "green";
        const res = await sendToServer("receive", etich, 1);
        //       alert("risposta = " + res);
        if (res == "200") mess.value = "risposta dal server: Etichetta aggiornata";
        else if (res == "99") {
          mess.value = "risposta dal server: Errore comunicazione";
          cl.value = "red";
        } else {
          const response = res.split("|");
          alert("risposta dal server: conclusa preparazione foglio " + response[1]);
        }
        document.querySelector("body").classList.remove("scanner-active");
        localStorage.collo = collo_area;
        lettura.value = 1;
        //  mess.value = TestStatus('1');
      } else {
        lettura.value = 9;
        cl.value = "red";
        mess.value =
          "codice collo = " + collo.codice + " Codice su Etichetta = " + etich.codice;
      }
    }
    onMounted(() => {
      console.log("mounted");
      LeggiCodice();
    });
    return {
      LeggiCodice,
      SetNoCollo,
      mess,
      cl,
      attesa,
      lettura,
      progressivo,
      sede,
      foglio,
      codice,
      ordine,
      riga,
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

.reader_pronto {
  text-align: center;
  width: 150px;
  height: 20px;
  margin-left: 30em;
  margin-right: 20px;
  border-color: 1px solid blue;
  border-radius: 25px;
  background-color: rgb(77, 0, 128);
}

.reader_ok {
  text-align: center;
  width: 150px;
  height: 20px;
  margin-left: 30em;
  margin-right: 20px;
  border-color: 1px solid blue;
  border-radius: 25px;
  background-color: green;
}

.red {
  text-align: center;
  padding: 50px 0;
  margin-top: 10px;
  margin-left: 50px;
  width: 200px;
  height: 150px;
  display: block;
  border-color: 1px solid red;
  border-radius: 25px;
  background-color: red;
}

.green {
  text-align: center;
  padding: 50px 0;
  margin-top: 10px;
  margin-left: 50px;
  width: 150px;
  height: 100px;
  display: block;
  border-color: 1px solid green;
  border-radius: 25px;
  background-color: green;
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

#container a {
  text-decoration: none;
}
</style>
