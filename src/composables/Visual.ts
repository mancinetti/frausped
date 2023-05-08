 
import axios from "axios";
import { Storage } from "@ionic/storage";
axios.defaults.baseURL = "http://www.frauweb.frau.it";
export interface st {
  flag: boolean;
  class: string;
}
/**
 * EJNULS,EJTOET,EJPRET,EJAZIE,EJCOCL,EJCOCS,EJCOPA,EJNUOR:
               EJPOOR,EJCOVE,EJANNO,EJSTAG,EJCLRA,EJDVRA,EJDEVE,EJTAGL:
               EJDATR
 */
export interface etichetta {
  num_foglio: string;
  tot_etichette: string;
  progressivo: string;
  sede: string;
  codice_cliente: string;
  codice_destinatario: string;
  codice: string;
  num_ordine: string;
  num_riga: string;
  codice_spedizioniere: string;
  anno: string;
  stagione: string;
  ragione_sociale: string;
  ragione_sociale_destinatario: string;
  denominazione_spedizioniere: string;
  identificativo_giro: string;
   taglie: string;
}
export interface collo {
  codice: string;
}
const storage = new Storage({
  name: "__mydb",
});
storage.create();
 
export function Visual() {
  const sendAudio = (st: st) => {
    if (st.flag == true) {
      new Audio("/assets/sounds/okmsg.mp3").play();
      st.class = "green";
    } else {
      new Audio("/assets/sounds/errmsg.mp3").play();
      st.class = "red";
    }
    return st.class;
  };
  const getGiriFromServer = async ()=>{
    return(await GiriFromServer('getGiri',''));
}
const getGiro = async (id:string)=>{
  return(await GiriFromServer('statoGiro',id));
}
const GiriFromServer = async (task: string, id:string)=>{
    let risposta: any;
    const azienda = localStorage.sede_preparazione;
     
    const url =
    "http://frauweb.frau.it/spedizioni/ajax/index.php?action=ajax&task="+task+"&id_giro="+id+'&sede_preparazione='+azienda ;
    const config = {
      url,
      method: "get",
      headers: { Accept: "application/json, text/plain, *" },
    };
    await axios
      .request(config)
      .then((response) => {
  //      console.log(response.data);
       risposta=response.data; 
      
     })
      .catch((error) => {
  //      console.log(error.message);
        alert(error.message);
      });
    
      return(risposta);
  }
    const sendToServer = async (
      task: string,
    data: etichetta,
    status: number
  ) => {
    let risposta: any;
    const url =
      "http://frauweb.frau.it/spedizioni/ajax/index.php?action=ajax&task=" +
      task;
    const fd = new FormData();
    (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
      console.log(key, data[key]);
    });
    fd.append("idlotspe", data["num_foglio"]);
    fd.append("num_collo", data["progressivo"]);
    fd.append("num_ordine", data["num_ordine"]);
    fd.append("num_riga", data["num_riga"]);
    fd.append("stato", status.toString());
    fd.append("action", "ajax");
    fd.append("task", task);
    //    console.log(data,fd);
    const config: object = {
      mode: "no-cors",
      Accept: "application/json, text/plain, *",
    };

    await axios
      .post(url, fd, config)
      .then((response) => {
        console.log("response ajax ", response.data);
        risposta = response.data;
        getStorage();
      })
      .catch((error) => {
        alert("error " + error.message);
        console.error("There was an error!", error.message);
      });
/*     console.log("storage", storage);
    const resp = await storage.get("test");
    console.log("risposta storage", resp);
 */
    return risposta;
  };
  const getStorage = async () => {
    const res = await storage.get("test");
    return res;
    //   alert(res);
  };
  const getCollo = (raw: string): collo => {
    const arr = raw.split("_");
    const obj: collo = {
      codice: arr[1],
    };
    if (arr[1] == undefined ||arr[0]!='S')
    {
      obj.codice='';
    }
    return obj;
  };
  const getEtichetta = (raw: string): etichetta => {
    const arr = raw.split("|");
    const obj: etichetta = {
      num_foglio: arr[0],
      tot_etichette: arr[1],
      progressivo: arr[2],
      sede: arr[3],
      codice_cliente: arr[4],
      codice_destinatario: arr[5],
      codice: arr[6],
      num_ordine: arr[7],
      num_riga: arr[8],
      codice_spedizioniere: arr[9],
      anno: arr[10],
      stagione: arr[11],
      ragione_sociale: arr[12],
      ragione_sociale_destinatario: arr[13],
      denominazione_spedizioniere: arr[14],
      identificativo_giro: arr[15],
      taglie: arr[16],
      
    };
    if (obj.num_ordine == undefined && obj.num_riga == undefined||obj.codice_destinatario==undefined)
    {
      obj.num_foglio='9999999';
    }
    return obj;
  };
  return {
    sendAudio,
      sendToServer,
    getEtichetta,
    getCollo,
    getStorage,
    getGiriFromServer,getGiro
  };
}
