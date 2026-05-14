/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { LoadingDlg } from "./LoadingDlg";
import { onServiceError } from "../../utils/ServiceError";
import { toggleButton } from "../../utils/EnableDisable";

export class CacheDlg {
   private root: HTMLElement;
   private loadingDlg: LoadingDlg;
   private viewer: lt.Document.Viewer.DocumentViewer;
   private onExit: () => void;

   constructor(viewerEle: HTMLElement, loadingDlg: LoadingDlg, viewer: lt.Document.Viewer.DocumentViewer, onExit: () => void){
      if(!viewerEle) throw new Error('Invalid root element provided');
      if(!loadingDlg) throw new Error('Null loading dialog provided');
      if(!viewer) throw new Error('Null viewer provided');
      if(!onExit) throw new Error('Null exit callback provided');

      this.root = this.buildModal(viewer);
      this.loadingDlg = loadingDlg;
      this.viewer = viewer;
      this.onExit = onExit;
      viewerEle.parentNode.insertBefore(this.root, viewerEle.nextSibling);

      this.updateShowButton(false);
   }

   private updateShowButton = (val: boolean) => {
      const cacheButton = document.getElementById(`${this.viewer.tag}-openCache`);
      toggleButton(val, cacheButton);
   }

   public removeModal = () => {
      const endCallback = () => {
         this.root.parentNode.removeChild(this.root);
         this.updateShowButton(true);
         this.root = null;
         this.loadingDlg = null;
         this.viewer = null;
         this.onExit();
      }
      this.root.addEventListener('animationend', () => endCallback());

      if (lt.LTHelper.browser === lt.LTBrowser.internetExplorer)
         window.setTimeout(() => {
            endCallback();
         }, 500)

      this.root.classList.add('cm-exiting');
      this.root.style.animationFillMode = 'forwards';
   }

   private buildModal = (viewer: lt.Document.Viewer.DocumentViewer) => {
      const dlg = document.createElement('div');
      dlg.classList.add('compact-modal');
      dlg.classList.add('hflex');
      dlg.id = `${viewer.tag}-cacheDlg`;

      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('vcenter');
      input.style.marginLeft = '5px';
      input.style.width = '300px';
      dlg.appendChild(input);

      const pasteCacheButton = document.createElement('button');
      pasteCacheButton.classList.add('vcenter');
      pasteCacheButton.innerText = 'Get Current ID';
      pasteCacheButton.style.marginLeft = '5px';
      pasteCacheButton.disabled = !viewer.hasDocument;
      pasteCacheButton.onclick = () => {
         input.value = viewer.document.documentId;
      }
      dlg.appendChild(pasteCacheButton);

      const loadButton = document.createElement('button');
      loadButton.classList.add('vcenter');
      loadButton.innerText = 'Load';
      loadButton.style.marginLeft = '5px';
      loadButton.style.marginRight = '5px';
      loadButton.onclick = () => {
         const id = input.value;
         if(!id){
            alert('Please enter in a cache ID');
            return;
         }

         this.loadFromCache(id, loadButton);
      }

      dlg.appendChild(loadButton);

      const closeButton = document.createElement('button');
      closeButton.classList.add('vcenter');
      closeButton.classList.add('right');
      closeButton.innerText = 'Close' ;
      closeButton.style.marginRight = '5px';
      closeButton.onclick = () => this.removeModal();

      dlg.appendChild(closeButton);

      return dlg;
   }

   private loadFromCache = (id: string, loadButton:HTMLButtonElement) => {
      loadButton.disabled = true;

      this.loadingDlg.show(false, false, 'Loading Document', null, null);
      lt.Document.DocumentFactory.loadFromCache(id)
         .done((document) => {
            this.viewer.setDocument(document);
            this.removeModal();
         })
         .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
            const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown)
            onServiceError(serviceError);
            loadButton.disabled = false;
         })
         .always(() => this.loadingDlg.hide());
   }
}