/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { LoadingDlg } from "./LoadingDlg";

const container = 'printBlock'

const print = (viewer: lt.Document.Viewer.DocumentViewer, loadingDlg: LoadingDlg) => {
   const printOptions = new lt.Document.Viewer.PrintDocumentOptions();
   printOptions.usePdfPrinting = true;
   printOptions.parent = document.getElementById(container);
   printOptions.showAnnotations = false;
   printOptions.pdfPrintAsRaster = true;

   loadingDlg.show(false, false, 'Printing...', '', null);
   viewer.print(printOptions)
      .fail((err: Error) => {
         alert(`There was an issue printing: ${err}`);
      })
      .always(() => {
         loadingDlg.hide();
      })
      .progress((e: any) => {
         if(lt.LTHelper.browser === lt.LTBrowser.internetExplorer && typeof(e) === 'string')
            loadingDlg.hide();
      });
}


export { print };