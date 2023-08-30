 
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
export function leggiBarcode() {
   const BarQrCode = async () => {
       BarcodeScanner.prepare();

   const res = await startScan();
   return(res);
  };
  const Test = () => {
   alert('test')
  };
  const retDebuData = () => {
//  const testetic="257427| 27|  1|F|043613|      |B910OLIV99 |39752| 74|  |2023|2|TERESI CALZATURE srl      ";
//  const testetic="257237|  2|  1|F|070117|      |41L7NEstE  |35976|  2|17|2021|2|MONTI DI MONTI V.& F.  snc    |  ";
   //const testetic="256933|13|1|M|070600|51|95L7NERO039|35488|7||2021|2|GASPERONIGIANLUCA|GASPERONIGIANLUCA||17|35-0;36-0;37-0;38-0;39-0;40-0;41-2";
    const testetic="273439| 0|  1|F|060400|      |09A0VISOZ  |39639| 10|  |2023|2|BASSAN SHOES di ULIVIANO BASSA|                              |                              |  16|";                                                                                                                                                                                                                                                          
    
   return(testetic);
};
const retDebuCollo = () => {
  const testetic="S_41L7NEstE ";
 return(testetic);
};
return { BarQrCode ,Test,retDebuData,retDebuCollo};
}
const startScan = async () => {
 
  BarcodeScanner.hideBackground();
  const result = await BarcodeScanner.startScan();
  if (result.hasContent) {
    stopScan();
   return(result.content)
   }
};
function stopScan() {
  BarcodeScanner.showBackground();
   BarcodeScanner.stopScan();
}
 
