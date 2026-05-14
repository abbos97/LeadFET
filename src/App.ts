/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { onServiceError } from "./utils/ServiceError";
import { onDocumentDiff, updateViewTrigger } from "./components/TextCompare/TextPanelBuilder";
import { LoadingDlg } from "./components/Modals/LoadingDlg";
import { serverCompare } from "./components/TextCompare/ServerCompare";
import { ViewerDetailsPanel, DetailPanelType } from "./components/ViewerPanel/ViewerDetailsPanel";
import { LayoutManager, Layout } from "./managers/LayoutManager";
import { ColorPicker } from "./components/ColorPicker/ColorPicker";
import { RasterManager, RasterCompareColors } from "./managers/RasterManager";
import { TextCache } from "./components/TextCache/TextCache";

export interface AppParams {
   startupMode: Layout;
   defaultColors: RasterCompareColors;
   collapseSidePanels: boolean;
   autoGetColoredImages: boolean;
}

export class App {
   private readonly viewer1 = 'splitViewer1';
   private readonly viewer1Default = `${lt.Document.DocumentFactory.serviceHost}/${lt.Document.DocumentFactory.servicePath}/Samples/compare-original.pdf`;
   private readonly viewer2 = 'splitViewer2';
   private readonly viewer2Default = `${lt.Document.DocumentFactory.serviceHost}/${lt.Document.DocumentFactory.servicePath}/Samples/compare-modified.pdf`;

   private layoutManager: LayoutManager;
   private rasterManager: RasterManager;

   private splitViews: lt.Document.Viewer.DocumentViewer[] = [];
   private rasterViewer: lt.Document.Viewer.DocumentViewer = null;
   private loadDlg: LoadingDlg = new LoadingDlg();
   private detailPanels: ViewerDetailsPanel[] = [];
   private textCache: TextCache = new TextCache();
   public textCompare: lt.Document.Viewer.CompareView;
   public lastDiff: lt.Document.Compare.DocumentDifference = null;

   constructor(startSettings: AppParams) {
      const doc1 = JSON.parse(localStorage.getItem('compareDoc1') || '{}');
      const doc2 = JSON.parse(localStorage.getItem('compareDoc2') || '{}');
      const token = localStorage.getItem('compareToken');

      this.splitViews.push(this.createDocumentViewer(document.getElementById(this.viewer1)));
      this.splitViews.push(this.createDocumentViewer(document.getElementById(this.viewer2)));
      const rasterViewer = this.createDocumentViewer(document.getElementById('rasterOutputViewer'), DetailPanelType.output);
      this.rasterViewer = rasterViewer;
      
      this.loadFromPost(this.splitViews[0], doc1, token).then(() => {
         this.loadFromPost(this.splitViews[1], doc2, token);
      })
      
      // this.loadFromUri(this.splitViews[0], this.viewer1Default);
      // this.loadFromUri(this.splitViews[1], this.viewer2Default);

      const imgViewerMap = this.splitViews.map(x => x.view.imageViewer);
      imgViewerMap.push(rasterViewer.view.imageViewer);
      lt.Controls.ImageViewer.sync(imgViewerMap);

      this.textCompare = new lt.Document.Viewer.CompareView(this.splitViews);
      this.rasterManager = new RasterManager(this.splitViews, rasterViewer, startSettings.defaultColors, startSettings.autoGetColoredImages, this.textCompare);
      this.layoutManager = new LayoutManager(this.splitViews, this.detailPanels, this.rasterManager, this.textCompare);

      this.textCompare.onDiffChange = (diff: lt.Document.Compare.DocumentDifference) => {
         this.lastDiff = diff;
         onDocumentDiff(diff, this);
      }
      this.textCompare.onActiveDiffChange = (diff: lt.Document.Compare.PageCharactersDifference) => {
         onDocumentDiff(this.lastDiff, this, diff);
      }

      this.textCompare.shouldGetText = (page: number, document: lt.Document.LEADDocument) => {
         console.log(`About to get text from page: ${page} from document: ${document.documentId}`);

         if (!this.textCompare.isEnabled) {
            this.textCache.add({
               document: document,
               pageNumber: page
            });

            return false;
         }

         return true;
      }

      if (startSettings.startupMode == Layout.Raster){
         this.textCompare.stop();
         this.textCompare.enableRasterPreview = true;
      }

      this.layoutManager.switchLayout(startSettings.startupMode);
      if (startSettings.collapseSidePanels)
         this.layoutManager.collapsePanels(startSettings.collapseSidePanels);

      this.bindTriggers();

      const openLocal1 = document.getElementById('splitViewer1-openUrl')
      const splitViewerOpenLocal1 = document.getElementById('splitViewer1-openLocal')
      const splitViewerOpenCache1 = document.getElementById('splitViewer1-openCache')
      
      const openLocal2 = document.getElementById('splitViewer2-openUrl')
      const splitViewerOpenLocal2 = document.getElementById('splitViewer2-openLocal')
      const splitViewerOpenCache2 = document.getElementById('splitViewer2-openCache')

      openLocal1!.style.display = "none";
      splitViewerOpenLocal1!.style.display = "none";
      splitViewerOpenCache1!.style.display = "none";
      
      openLocal2!.style.display = "none";
      splitViewerOpenLocal2!.style.display = "none";
      splitViewerOpenCache2!.style.display = "none";

      openLocal1?.replaceWith(openLocal1.cloneNode(true))
      splitViewerOpenLocal1?.replaceWith(splitViewerOpenLocal1.cloneNode(true))
      splitViewerOpenCache1?.replaceWith(splitViewerOpenCache1.cloneNode(true))
      
      openLocal2?.replaceWith(openLocal2.cloneNode(true))
      splitViewerOpenLocal2?.replaceWith(splitViewerOpenLocal2.cloneNode(true))
      splitViewerOpenCache2?.replaceWith(splitViewerOpenCache2.cloneNode(true))
   
   }

   public dispose = () => {
      // Add any cleanup logic here.
   }


   private createDocumentViewer = (element: HTMLElement, type: DetailPanelType = DetailPanelType.standard) => {
      const createOptions = new lt.Document.Viewer.DocumentViewerCreateOptions();
      createOptions.viewContainer = element;
      createOptions.useAnnotations = true;

      const viewer = lt.Document.Viewer.DocumentViewerFactory.createDocumentViewer(createOptions);
      this.initAnnotations(viewer);

      const panZoom = lt.Document.Viewer.DocumentViewerCommands.interactivePanZoom;
      viewer.commands.run(panZoom, null);
      viewer.view.lazyLoad = true;
      viewer.tag = element.id;

      viewer.operation.add(this.operationEvent);
      this.trackZoom(viewer);
      const panel = new ViewerDetailsPanel(viewer, this.loadDlg, type);
      this.detailPanels.push(panel);


      this.enableInertiaScroll(viewer);
      return viewer;
   }

   private initAnnotations = (viewer: lt.Document.Viewer.DocumentViewer) => {
      const manager = viewer.annotations.automationManager;
      manager.renderingEngine = new lt.Annotations.Rendering.AnnHtml5RenderingEngine();
      viewer.annotations.initialize();
      viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.annotationsUserModeRun, null);
   }


   private loadFromUri = (viewer: lt.Document.Viewer.DocumentViewer, documentUrl: string) => {
      if (!viewer) return;

      const loadDocumentOptions = new lt.Document.LoadDocumentOptions();
      lt.Document.DocumentFactory.loadFromUri(documentUrl, loadDocumentOptions)
         .done((leadDocument: lt.Document.LEADDocument) => {
            viewer.setDocument(leadDocument);
            viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewFitWidth, null);
         })
         .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
            const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown)
            onServiceError(serviceError);
         });
   }

   private loadFromPost = (viewer: lt.Document.Viewer.DocumentViewer, doc: any, token: string):Promise<void> => {
      return fetch('http://smartlogic.bio-soft.co.kr:32038/api/commonPrint/print-test2', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token
         },
         body: JSON.stringify({
            factory_code: doc.FACTORY_CODE,
            acc_type: 'ACCTYPE01',
            doc_no: doc.DOC_NO,
            doc_revision: doc.DOC_REVISION,
            file_id: doc.FILE_ID,
            file_name: doc.FILE_NAME,
            recall_code: 1,
            remark: '',
            created_who: doc.CREATED_WHO
         })
      }).then(res => res.blob()).then(blob => {
         return new Promise<void>((resolve) => {
            const loadDocumentOptions = new lt.Document.LoadDocumentOptions();
            lt.Document.DocumentFactory.loadFromFile(blob, loadDocumentOptions).done((loadDocument: lt.Document.LEADDocument) => {
               viewer.setDocument(loadDocument);
               viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewFitWidth, null)
               resolve();
            }).fail((jqXHR: any, statusText: string, errorThrown: string) => {
               console.error('Load failed:', statusText, errorThrown);
            })
         })
      })
   }

   private enableInertiaScroll = (documentViewer: lt.Document.Viewer.DocumentViewer) => {
      // These commands have ImageViewerPanZoomInteractiveMode in the tag, update the value
      const commandNames = [
         lt.Document.Viewer.DocumentViewerCommands.interactivePanZoom,
         lt.Document.Viewer.DocumentViewerCommands.interactivePan,
      ];
      commandNames.forEach(name => {
         const mode = documentViewer.commands.getCommand(name).tag;
         if (mode != null) {
            mode.inertiaScrollOptions.isEnabled = true;
         }
      });
   };

   private operationEvent = (sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs) => {
      const viewer = sender as lt.Document.Viewer.DocumentViewer;
      const detailPanel = this.detailPanels.filter(x => x.viewer === viewer)[0];
      if (e.operation === lt.Document.Viewer.DocumentViewerOperation.setDocument && e.isPostOperation) {
         if (detailPanel.type == DetailPanelType.standard)
            this.textCache.clearDocument(e.data2 as lt.Document.LEADDocument);

         if(this.rasterViewer.hasDocument && viewer !== this.rasterViewer)
            this.rasterManager.cleanOutputPanel();

         if (viewer !== this.rasterViewer)
            this.resetViewers();
         detailPanel.updateDocumentState();
      }

      if (e.operation === lt.Document.Viewer.DocumentViewerOperation.currentPageNumberChanged && e.isPostOperation)
         detailPanel.updatePageState();
   }

   private trackZoom = (documentViewer: lt.Document.Viewer.DocumentViewer) => {
      let lastScaleFactor = 0;
      const viewer = documentViewer.view.imageViewer;
      viewer.transformChanged.add(() => {
         if (!this.detailPanels.length)
            return;

         const detailPanel = this.detailPanels.filter(x => x.viewer === documentViewer)[0];
         const currentScaleFactor = viewer.scaleFactor;
         if (lastScaleFactor !== currentScaleFactor)
            detailPanel.updateZoomState();

         lastScaleFactor = currentScaleFactor;
      });
   }

   private bindTriggers = () => {
      // Document Panel Triggers
      const textTrigger = document.getElementById('compareTrigger');
      textTrigger.onclick = this.textCompareTrigger;

      const serverCompareTrigger = document.getElementById('serverCompareTrigger');
      serverCompareTrigger.onclick = this.serverDocumentCompareTrigger;

      const syncTriggerText = document.getElementById('syncTriggerText');
      syncTriggerText.onclick = this.syncTrigger;

      const overlayTriggerText = document.getElementById('overlayTriggerText');
      overlayTriggerText.onclick = this.layoutManager.overlayTrigger;

      const rasterTrigger = document.getElementById('rasterTrigger');
      rasterTrigger.onclick = this.swapToRasterTrigger;

      // Raster Panel Triggers
      const syncTriggerRaster = document.getElementById('syncTriggerRaster');
      syncTriggerRaster.onclick = this.syncTrigger;

      const overlayTriggerRaster = document.getElementById('overlayTriggerRaster');
      overlayTriggerRaster.onclick = this.layoutManager.overlayTrigger

      const documentTrigger = document.getElementById('documentTrigger');
      documentTrigger.onclick = this.swapToDocumentTrigger;

      const settingsTrigger = document.getElementById('textSettingsTrigger');
      settingsTrigger.onclick = this.toggleTextSettings;

      this.initColorPickers();
   }

   private toggleTextCompare = async (val: boolean) => {
      if (val) {
         this.textCompare.start();

         const cacheLength = this.textCache.cache.length;
         if (cacheLength !== 0) {
            const shouldContinue = confirm(`${cacheLength} pages have been viewed since Text Compare was last enabled.  For optimal results, we will need to fetch the text for these pages before resuming the compare. \n\nShould we grab them now?`
            );
            if (shouldContinue) {
               await this.getMissingText();
            }

         }
      } else {
         this.textCompare.stop();
      }

      updateViewTrigger(this.textCompare);
   }

   private getMissingText = async () => {

      for (const entry of this.textCache.cache) {
         const doc = entry.document;

         this.loadDlg.show(false, false, `Retrieving text for document: ${doc.documentId}, page: ${entry.pageNumber}`, null, null);
         const viewer = (doc.documentId === this.splitViews[0].document.documentId) ? this.splitViews[0] : this.splitViews[1];

         await this.textCache.getTextSynchronous(entry, viewer);
      }

      this.textCache.clearAll();
      this.loadDlg.hide();
   }

   public resetViewers = () => {
      const command = lt.Document.Viewer.DocumentViewerCommands.pageGoto;
      this.splitViews.forEach(view => view.commands.run(command, 1));
   }

   public invalidateInsertViewer = () => this.splitViews.filter(x => x.tag === this.viewer2)[0].view.invalidate(lt.LeadRectD.empty);
   public invalidateDeleteViewer = () => this.splitViews.filter(x => x.tag === this.viewer1)[0].view.invalidate(lt.LeadRectD.empty);
   public invalidateAllViews = () => {
      this.splitViews.forEach((view) => {
         view.view.invalidate(lt.LeadRectD.empty);
      })
   }

   /**
    * ******************************************************************************************
    * * ******************************* TRIGGERS ***********************************************
    * ******************************************************************************************
    */

   private textCompareTrigger = async () => {
      if (!this.textCompare) return;

      if (this.textCompare.isEnabled) {
         this.toggleTextCompare(false);

         this.textCompare.set_selectedDeletion(null);
         this.textCompare.set_selectedInsertion(null);

         onDocumentDiff(null, this);
      }
      else {
         await this.toggleTextCompare(true);
         onDocumentDiff(this.lastDiff, this);
      }

      this.invalidateAllViews();
   }

   private serverDocumentCompareTrigger = () => {
      serverCompare(this.splitViews, this.loadDlg);
   }

   private syncTrigger = () => {
      const elems: HTMLElement[] = [].slice.call(document.querySelectorAll('.sync-icon'));
      elems.forEach((context) => {
         if (context.classList.contains('active-icon')) {
            lt.Controls.ImageViewer.unsyncGroup(this.splitViews[0].view.imageViewer.syncId);
            context.classList.remove('active-icon');
         }
         else {
            this.syncViewers();
            context.classList.add('active-icon');
         }
      });
   }

   private syncViewers = () => {
      const map = this.splitViews.map(x => x.view.imageViewer);
      map.push(this.rasterManager.outputViewer.view.imageViewer);

      lt.Controls.ImageViewer.sync(map);
   }

   private swapToRasterTrigger = () => {
      this.layoutManager.switchLayout(Layout.Raster);
      this.toggleTextCompare(false);
      this.textCompare.set_selectedDeletion(null);
      this.textCompare.set_selectedInsertion(null);
      onDocumentDiff(null, this);
   }

   private swapToDocumentTrigger = () => {
      this.layoutManager.switchLayout(Layout.Document);
   }

   private initColorPickers = () => {
      const deletion = new ColorPicker('textDeletionColor', { initialColor: this.textCompare.deleteColor });
      deletion.onColorChange = (color: string) => this.textCompare.deleteColor = color;

      const insertions = new ColorPicker('textInsertionColor', { initialColor: this.textCompare.insertColor });
      insertions.onColorChange = (color: string) => this.textCompare.insertColor = color;

      const selected = new ColorPicker('textSelectionColor', { initialColor: this.textCompare.selectedColor });
      selected.onColorChange = (color: string) => this.textCompare.selectedColor = color;
   }

   private toggleTextSettings = () => {
      const maxHeight = '40px';
      const row = document.getElementById('textSettings');
      const settingsTrigger = document.getElementById('textSettingsTrigger');

      if (settingsTrigger.classList.contains('active-icon')) {
         settingsTrigger.classList.remove('active-icon');
         row.style.maxHeight = '0';
      }
      else {
         settingsTrigger.classList.add('active-icon');
         row.style.maxHeight = maxHeight;
      }
   }
}