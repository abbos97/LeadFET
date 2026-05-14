/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { UriDlg } from "../Modals/UriDlg";
import { CacheDlg } from "../Modals/CacheDlg";
import { LoadingDlg } from "../Modals/LoadingDlg";
import { loadLocalClick } from "../Modals/LoadLocalDlg/LoadLocalDlg";
import { toggleButton } from "../../utils/EnableDisable";
import { print } from "../Modals/Print";
import { exportClick } from "../Modals/Export";

export enum DetailPanelType {
   standard, // Standard detail panel for viewers
   output // detail panel for output
}

export class ViewerDetailsPanel {
   public viewer: lt.Document.Viewer.DocumentViewer;
   public type: DetailPanelType;
   private uriDlg: UriDlg = null;
   private cacheDlg: CacheDlg = null;
   private loadingDlg: LoadingDlg;

   public constructor(viewer: lt.Document.Viewer.DocumentViewer, loadingDlg: LoadingDlg, type: DetailPanelType = DetailPanelType.standard) {
      if (!viewer) throw new Error('Invalid viewer instance provided');
      if (!loadingDlg) throw new Error('Invalid loading dialog instance provided');
      this.type = type;

      this.viewer = viewer;
      this.loadingDlg = loadingDlg;

      this.init();
   }

   public dispose = () => {
      this.viewer = null;

      if (this.uriDlg)
         this.uriDlg.removeModal();

      this.uriDlg = null;

      if (this.cacheDlg)
         this.cacheDlg.removeModal();

      this.cacheDlg = null;
      this.loadingDlg = null;
   }

   private init = () => {
      if(this.type === DetailPanelType.standard) {
         this.bindUriDlg();
         this.bindCacheDlg();
         this.bindLocalDlg();
      }

      if(this.type === DetailPanelType.output) {
         this.bindPrint();
         this.bindExport();
      }

      this.bindCurrentPage();
      this.bindNextPage();
      this.bindPreviousPage();
      this.bindZoomSelect();
      this.bindZoomIn();
      this.bindZoomOut();
   }

   private bindPrint = () => {
      document.getElementById(`${this.viewer.tag}-print`).onclick = () => {
         print(this.viewer, this.loadingDlg);
      }
   }

   private bindExport = () => {
      document.getElementById(`${this.viewer.tag}-export`).onclick = () => {
         exportClick(this.viewer, this.loadingDlg);
      }
   }

   private bindUriDlg = () => {
      document.getElementById(`${this.viewer.tag}-openUrl`).onclick = () => {
         if (this.cacheDlg)
            this.cacheDlg.removeModal();

         this.uriDlg = new UriDlg(this.viewer.view.imageViewer.mainDiv, this.loadingDlg, this.viewer, () => this.uriDlg = null);
      }
   }

   private bindCacheDlg = () => {
      document.getElementById(`${this.viewer.tag}-openCache`).onclick = () => {
         if (this.uriDlg)
            this.uriDlg.removeModal();

         this.cacheDlg = new CacheDlg(this.viewer.view.imageViewer.mainDiv, this.loadingDlg, this.viewer, () => this.cacheDlg = null);
      }
   }

   private bindLocalDlg = () => {
      document.getElementById(`${this.viewer.tag}-openLocal`).onclick = () => {
         loadLocalClick(this.loadingDlg, this.viewer);
      }
   }

   private bindCurrentPage = () => {
      const currentPage = document.getElementById(`${this.viewer.tag}-currentPage`) as HTMLInputElement;
      currentPage.onkeydown = (e) => {
         const code = (lt.LTHelper.browser === lt.LTBrowser.internetExplorer || lt.LTHelper.browser === lt.LTBrowser.edge)? e.key : e.code;

         // Only check for enter pressed
         if (code !== 'Enter')
            return

         const val = +currentPage.value;

         if (!val || isNaN(val) || val < 0 || val > this.viewer.pageCount) {
            this.updateCurrentPageNumber();
            return;
         }

         this.viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.pageGoto, val);
      }
      currentPage.onblur = () => {
         this.updateCurrentPageNumber();
      }
   }

   private bindNextPage = () => {
      const nextPage = document.getElementById(`${this.viewer.tag}-nextPage`) as HTMLInputElement;
      const command = lt.Document.Viewer.DocumentViewerCommands.pageNext;
      this.bindCommandButton(nextPage, command);
   }

   private bindPreviousPage = () => {
      const previousPage = document.getElementById(`${this.viewer.tag}-previousPage`) as HTMLInputElement;
      const command = lt.Document.Viewer.DocumentViewerCommands.pagePrevious;
      this.bindCommandButton(previousPage, command);
   }

   private bindZoomIn = () => {
      const zoomIn = document.getElementById(`${this.viewer.tag}-zoomIn`);
      const command = lt.Document.Viewer.DocumentViewerCommands.viewZoomIn;
      this.bindCommandButton(zoomIn, command);
   }

   private bindZoomOut = () => {
      const zoomOut = document.getElementById(`${this.viewer.tag}-zoomOut`);
      const command = lt.Document.Viewer.DocumentViewerCommands.viewZoomOut;
      this.bindCommandButton(zoomOut, command);
   }

   private bindCommandButton = (ele: HTMLElement, command: string) => {
      ele.onclick = () => {
         this.viewer.commands.run(command, null);
      }

      ele.onkeydown = (e) => {
         if (e.code !== 'Enter')
            return;

         this.viewer.commands.run(command, null);
      }
   }

   private bindZoomSelect = () => {
      const select = document.getElementById(`${this.viewer.tag}-zoomHolder`) as HTMLSelectElement;
      select.onchange = (e) => {
         e.preventDefault();
         const value = e.currentTarget['value'];
         switch (value) {
            case "Actual Size":
               this.viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewActualSize, null);
               break;
            case "Fit Width":
               this.viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewFitWidth, null);
               break;
            case "Fit Page":
               this.viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewFitPage, null);
               break;
            default:
               const percent = +value;
               this.viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewZoomPercentage, percent * 100);
               break;
         }
      }
   }

   private updateCurrentPageNumber = () => {
      const currentPage = document.getElementById(`${this.viewer.tag}-currentPage`) as HTMLInputElement;
      currentPage.value = this.viewer.currentPageNumber.toString();
   }

   public updatePageState = () => {
      this.updateCurrentPageNumber();

      const currentPage = this.viewer.currentPageNumber;
      const prevPage = document.getElementById(`${this.viewer.tag}-previousPage`);
      if (currentPage === 1)
         toggleButton(false, prevPage)
      else
         toggleButton(true, prevPage)

      const nextPage = document.getElementById(`${this.viewer.tag}-nextPage`);
      if (currentPage === this.viewer.pageCount)
         toggleButton(false, nextPage)
      else
         toggleButton(true, nextPage)
   }

   public updateDocumentState = () => {
      const nameLabel = document.getElementById(`${this.viewer.tag}-name`);
      const idLabel = document.getElementById(`${this.viewer.tag}-id`);
      const maxPages = document.getElementById(`${this.viewer.tag}-maxPages`);
      const currentPage = document.getElementById(`${this.viewer.tag}-currentPage`) as HTMLInputElement;

      if (!this.viewer.hasDocument) {
         if(nameLabel)
            nameLabel.innerText = '';
         if(idLabel)
            idLabel.innerText = '';
         maxPages.innerText = '0';
         currentPage.value = '0';

         return;
      }


      const doc = this.viewer.document;
      if(nameLabel)
         nameLabel.innerText = doc.name;
      if(idLabel)
         idLabel.innerText = `ID: ${doc.documentId}`;
      maxPages.innerText = doc.pages.count.toString();
      currentPage.value = this.viewer.currentPageNumber.toString();
   }

   public updateZoomState = () => {
      const select = document.getElementById(`${this.viewer.tag}-zoomHolder`) as HTMLSelectElement;

      const eleTag = `${this.viewer.tag}-selectedZoom`
      let selectedOption = document.getElementById(eleTag) as HTMLOptionElement;
      if (!selectedOption) {
         selectedOption = document.createElement('option');
         selectedOption.disabled = true;
         selectedOption.value = 'default';
         selectedOption.id = eleTag;
         select.insertBefore(selectedOption, select.firstElementChild);
      }

      selectedOption.selected = true;
      selectedOption.text = `${(this.viewer.view.imageViewer.scaleFactor * 100).toFixed(1)}%`;
   }

   public togglePanel = (val: boolean) => {
      const infoPanel = document.getElementById(`${this.viewer.tag}-infoPanel`);
      if (!val) {
         infoPanel.style.display = 'flex';
         this.viewer.view.imageViewer.onSizeChanged();
      }
      else {
         infoPanel.style.display = 'none';
         if (this.uriDlg)
            this.uriDlg.removeModal();

         if (this.cacheDlg)
            this.cacheDlg.removeModal();
      }
   }

   public getRoot = () => document.getElementById(`${this.viewer.tag}-infoPanel`);

   public togglePanelTransition = (val: boolean) => {
      const infoPanel = document.getElementById(`${this.viewer.tag}-infoPanel`);
      if (!val) {
         infoPanel.style.maxHeight = null;
      }
      else {
         infoPanel.style.maxHeight = '0';
         if (this.uriDlg)
            this.uriDlg.removeModal();

         if (this.cacheDlg)
            this.cacheDlg.removeModal();
      }
   }
}