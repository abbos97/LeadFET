/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { ViewerDetailsPanel, DetailPanelType } from "../components/ViewerPanel/ViewerDetailsPanel";
import { RasterManager } from "./RasterManager";
import { toggleButton } from "../utils/EnableDisable";

export enum Layout {
   Document,
   Raster
}

export class LayoutManager {
   private originalViewer: lt.Document.Viewer.DocumentViewer;
   private modifiedViewer: lt.Document.Viewer.DocumentViewer;
   private viewers: lt.Document.Viewer.DocumentViewer[];
   private currentOpacity: number = .5;
   private detailPanes: ViewerDetailsPanel[];
   private rasterManager: RasterManager;
   private sidePanelsCollapsed: boolean = false;
   private compareView: lt.Document.Viewer.CompareView = null;

   public activeLayout: Layout;
   /** Whether the viewers are currently overlayed */
   public overlayed: boolean

   public constructor(viewers: lt.Document.Viewer.DocumentViewer[], panes: ViewerDetailsPanel[], rasterManager: RasterManager, view: lt.Document.Viewer.CompareView) {
      if (!viewers || viewers.length !== 2)
         throw new Error('Exactly two viewers must be provided to the LayoutManager');

      this.originalViewer = viewers[0];
      this.modifiedViewer = viewers[1];
      this.viewers = viewers;
      this.detailPanes = panes;
      this.rasterManager = rasterManager;
      this.rasterManager.onKeyDownTrigger = this.layoutKeydownEvent;
      this.compareView = view;

      this.activeLayout = Layout.Document;
      this.overlayed = false;
      this.initClickEvents();
   }

   public toggleOverlay = (val: boolean) => {
      this.toggleDetailPanels(val);

      const leftPanel = this.modifiedViewer.view.imageViewer.mainDiv.parentElement.parentElement;
      const rightPanel = this.originalViewer.view.imageViewer.mainDiv.parentElement.parentElement;

      if (val) {
         leftPanel.style.width = '100%';
         leftPanel.style.height = '100%';
         leftPanel.style.position = 'absolute';
         leftPanel.style.opacity = this.currentOpacity.toString();
         leftPanel.style.margin = '0';
         leftPanel.style.border = '0';
         leftPanel.style.left = '0'

         rightPanel.style.width = '100%';
         rightPanel.style.height = '100%';
         rightPanel.style.margin = '0';
         rightPanel.style.border = '0';

         if (this.activeLayout === Layout.Raster)
            this.rasterManager.suppressClickUpdates = true;
      } else {
         leftPanel.style.width = '50%';
         leftPanel.style.height = '';
         leftPanel.style.position = 'relative';
         leftPanel.style.opacity = '1';
         leftPanel.style.height = '';
         leftPanel.style.margin = null;
         leftPanel.style.borderLeft = '4px solid';
         leftPanel.style.left = null;

         rightPanel.style.width = '50%';
         rightPanel.style.height = '';
         rightPanel.style.margin = null;
         rightPanel.style.borderRight = '4px solid';

         if (this.activeLayout === Layout.Raster)
            this.rasterManager.suppressClickUpdates = false;
      }

      this.overlayed = val;
      this.resizeViewers();
   }

   public switchLayout = (layout: Layout) => {
      if (layout === this.activeLayout)
         return;

      switch (layout) {
         case Layout.Document:
            this.initDocumentLayout();
            break;
         case Layout.Raster:
            this.initRasterLayout();
            break;
      }
   }

   private layoutKeydownEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey) {
         switch (e.key) {
            case 'q':
               e.preventDefault();
               e.returnValue = false;
               e.stopPropagation();
               this.overlayTrigger();
               break;
         }
      }
   }

   private initRasterLayout = () => {
      this.rasterManager.enabled = true;
      this.rasterManager.suppressClickUpdates = false;
      this.rasterManager.updateActiveViewer();

      this.updateActivePanel(Layout.Raster);
      this.viewers.forEach((viewer) => {
         viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.pageFirst, null);
         viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.layoutSingle, null);
      });
      this.compareView.enableRasterPreview = true;
      this.activeLayout = Layout.Raster;
   }

   private initDocumentLayout = () => {
      this.compareView.enableRasterPreview = false;
      this.rasterManager.enabled = false;
      this.rasterManager.suppressClickUpdates = true;
      this.rasterManager.updateActiveViewer(true);

      if (!this.overlayed)
         this.toggleDetailPanels(false);

      this.updateActivePanel(Layout.Document);
      this.rasterManager.cleanOutputPanel();
      this.viewers.forEach((viewer) => {
         const item = viewer.view.imageViewer.getFirstVisibleItem(lt.Controls.ImageViewerItemPart.view);
         // Rest any shifting that occured in Raster Mode
         item.offset = lt.LeadPointD.create(0, 0);
         item.rotateAngle = 0;

         viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.pageFirst, null);
         viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.layoutVertical, null);

         // We will set a delayed onSizeChanged call so that we can properly size the viewer after
         // any transitions complete.
         window.setTimeout(() => {
            viewer.view.imageViewer.onSizeChanged();
         }, 1200)
      });
      this.activeLayout = Layout.Document;
   }

   private toggleDetailPanels = (val: boolean) => {
      this.detailPanes.forEach((panel, index: number) => {
         if (panel.type !== DetailPanelType.standard)
            return;

         if (index === 0)
            this.addTransitionRefresh(panel.getRoot());
         panel.togglePanelTransition(val);
      });
   }

   private updateActivePanel = (layout: Layout) => {
      let marginOffset = (lt.LTHelper.browser === lt.LTBrowser.internetExplorer) ? '-30%' : '-23%';
      if (this.sidePanelsCollapsed)
         marginOffset = '-3%';

      const documentPanel = document.getElementById('textPanel');
      this.addTransitionRefresh(documentPanel);
      const rasterPanel = document.getElementById('rasterPanel');

      switch (layout) {
         case Layout.Document:
            rasterPanel.style.marginRight = marginOffset;
            documentPanel.style.marginLeft = null;
            break;
         case Layout.Raster:
            rasterPanel.style.marginRight = null;
            documentPanel.style.marginLeft = marginOffset;
            break;
      }
   }

   private initClickEvents = () => {
      const elems: HTMLElement[] = [].slice.call(document.querySelectorAll('.collapse-holder'));
      elems.forEach((ele) => {
         ele.onclick = () => {
            this.collapsePanels(!this.sidePanelsCollapsed);
         }
      })
   }

   public collapsePanels = (val: boolean) => {
      const documentPanel = document.getElementById('textPanel');
      this.addTransitionRefresh(documentPanel);
      const rasterPanel = document.getElementById('rasterPanel');

      const elems: HTMLElement[] = [].slice.call(document.querySelectorAll('.collapsible'));

      if (val) {
         documentPanel.style.width = '48px';
         rasterPanel.style.width = '48px';
         elems.forEach((ele) => {
            ele.style.width = '0';
            ele.style.overflow = 'hidden';
            ele.style.opacity = '0';
         })
      } else {
         documentPanel.style.width = null;
         rasterPanel.style.width = null;

         elems.forEach((ele) => {
            ele.style.width = null;
            ele.style.overflow = null;
            ele.style.opacity = '1';
         });
      }
      const showTabs: HTMLElement[] = [].slice.call(document.querySelectorAll('.show-tab'));
      const hideTabs: HTMLElement[] = [].slice.call(document.querySelectorAll('.hide-tab'));
      showTabs.forEach((tab) => {
         tab.classList.remove('show-tab');
         tab.classList.add('hide-tab');
      });

      hideTabs.forEach((tab) => {
         tab.classList.remove('hide-tab');
         tab.classList.add('show-tab');
      });

      this.sidePanelsCollapsed = val;
      this.updateActivePanel(this.activeLayout);
   }

   private resizeViewers = () => {
      this.viewers.forEach((viewer) => {
         viewer.view.imageViewer.onSizeChanged()
         viewer.view.imageViewer.scrollOffset = lt.LeadPointD.create(0, 0);
      });
   }

   private addTransitionRefresh = (root: HTMLElement) => {
      let shouldContinue = true;

      // Since all of the layouts are flexed, the inner Document Viewers will fill the available space.
      // However, the size of each viewers items will not be adjusted until we call `onSizeChanged()`.
      // If we call onSizeChange after the transition is over, it will be very jaring and jerky.
      //
      // Instead, while the transition is occurring we will periodically send out ticks to update the size of the viewers.
      // The lower the tick rate, the smoother the transition will look.  However, this is an expensive operation
      // especially when annotations are being used.  We will increase the tick rate rate in Document mode since
      // that is the only time annotations may be on the screen.
      const timeout = (this.activeLayout === Layout.Document) ? 150 : 50;
      const timeOut = () => {
         window.setTimeout(() => {
            this.resizeViewers();

            if (!shouldContinue)
               return;

            timeOut();
         }, timeout);
      }

      const onTransitionStart = () => {
         timeOut();
      }

      const onTransitionEnd = () => {
         shouldContinue = false;
         root.removeEventListener('transitionend', onTransitionEnd);
         root.removeEventListener('transitionstart', onTransitionStart);
      }

      root.addEventListener('transitionend', onTransitionEnd);
      root.addEventListener('transitionstart', onTransitionStart);
   }

   public overlayTrigger = () => {
      const elems: HTMLElement[] = [].slice.call(document.querySelectorAll('.overlay-icon'));
      elems.forEach((context) => {
         if (context.classList.contains('active-icon'))
            context.classList.remove('active-icon');
         else
            context.classList.add('active-icon');
      });
      const value = !this.overlayed;
      const rasterSyncTrigger = document.getElementById('syncTriggerRaster');
      const documentSyncTrigger = document.getElementById('syncTriggerText');

      if (value && !rasterSyncTrigger.classList.contains('active-icon'))
         rasterSyncTrigger.click();

      toggleButton(!value, rasterSyncTrigger);
      toggleButton(!value, documentSyncTrigger);
      this.toggleOverlay(value);
   }
}