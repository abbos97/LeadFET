/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { onServiceError } from "../../../utils/ServiceError";
import { LoadingDlg } from "../LoadingDlg";
import { loadFromLocal, ILoadFromLocalParams, LoadFromLocalParams } from "./LocalLocal";

const createHiddenInput = (dlg: LoadingDlg, viewer: lt.Document.Viewer.DocumentViewer): HTMLInputElement => {
   const input: HTMLInputElement = document.createElement('input');
   input.type = 'file';
   input.style.display = 'none';
   input.id = `${viewer.tag}-localDlg`;

   input.onchange = (e) => {
      const files = (e.srcElement as HTMLInputElement).files;
      if(!files || !files.length)
         return;

      input.disabled = true;

      const file = files[0];
      const loadLocal: ILoadFromLocalParams = new LoadFromLocalParams(file);
      const onError = (error) => {
         dlg.hide();
         onServiceError(error);
         input.disabled = false;
         input.value = null;
      };
      dlg.show(false, true, 'Uploading Document', null, null);
      loadLocal.uploadProgressCallback = (progress: number) => dlg.progress(progress);
      loadLocal.uploadSuccessCallback = () => dlg.show(false, false, 'Loading Document', null, null);
      loadLocal.uploadFailCallback = onError;
      loadLocal.loadFailCallback = onError;
      loadLocal.loadAlwaysCallback = () => {
         dlg.hide();
         input.disabled = false;
         input.value = null;
      }
      loadLocal.loadSuccessCallback = (document) =>  viewer.setDocument(document);

      loadFromLocal(loadLocal);
   }

   document.body.appendChild(input);
   return input;
}


const loadLocalClick = (dlg: LoadingDlg, viewer: lt.Document.Viewer.DocumentViewer) => {
   let ele = document.getElementById(`${viewer.tag}-localDlg`);
   if(!ele)
      ele = createHiddenInput(dlg, viewer);

   ele.click();
}

export { loadLocalClick };