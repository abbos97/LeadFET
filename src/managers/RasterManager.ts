/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { RasterCompareRequest, getRasterResult } from "../components/RasterResultPanel/CompareModel";
import { LoadingDlg } from "../components/Modals/LoadingDlg";
import { RasterSettingsDlg } from "../components/Modals/RasterSettingsDlg/RasterSettingsDlg";
import { toggleButton } from "../utils/EnableDisable";

export interface RasterCompareColors {
   originalBackground: string;
   originalForeground: string;
   modifiedBackground: string;
   modifiedForeground: string;
   outputExternal: string;
   outputBackground: string;
   outputMatch: string;
   outputAddition: string;
   outputDeletion: string;
   outputChange: string
}

export class RasterManager {
   private viewers: lt.Document.Viewer.DocumentViewer[];
   private _activeViewer: lt.Document.Viewer.DocumentViewer = null;
   private set activeViewer(value: lt.Document.Viewer.DocumentViewer) {
      this._activeViewer = value;
      this.activeViewerCallback(value);
      this.updateActiveViewer();
   }
   private get activeViewer(): lt.Document.Viewer.DocumentViewer {
      return this._activeViewer;
   }
   private previousId: string = '';
   private lockKeyEvents = false;
   private compareView: lt.Document.Viewer.CompareView;

   public outputViewer: lt.Document.Viewer.DocumentViewer = null;
   public enabled: boolean;
   public suppressClickUpdates: boolean;
   public settingsDlg: RasterSettingsDlg = null;
   public nudgeThreshold: number = 10;
   public rotateThreshold: number = 1;
   public onKeyDownTrigger: (e: KeyboardEvent) => void = null;
   public autoGetColorPages: boolean = false;
   public constructor(viewers: lt.Document.Viewer.DocumentViewer[], outputViewer: lt.Document.Viewer.DocumentViewer, colors: RasterCompareColors, auto: boolean, compareView: lt.Document.Viewer.CompareView) {
      this.viewers = viewers;
      this.outputViewer = outputViewer;

      this.enabled = false;
      this.suppressClickUpdates = false;
      this.viewers.forEach(x => {
         this.addViewerBindings(x);
      });
      this.activeViewer = this.viewers[0];
      this.compareView = compareView;
      this.settingsDlg = new RasterSettingsDlg(viewers[0], viewers[1], colors, compareView);
      this.autoGetColorPages = auto;
      window.document.addEventListener("keydown", this.keydownEvent);
      this.applyUIBindings();
   }

   public cleanOutputPanel = () => {
      const outputTrigger = document.getElementById('toggleOutputTrigger');
      this.hideOutputViewer(outputTrigger, true);

      if (!this.outputViewer.hasDocument)
         return;

      toggleButton(false, outputTrigger);
      this.outputViewer.setDocument(null);
   }

   public addViewerBindings = (viewer: lt.Document.Viewer.DocumentViewer) => {
      const root = document.getElementById(viewer.tag);

      root.onclick = (e: Event) => {
         if (this.activeViewer !== viewer && !this.suppressClickUpdates)
            this.activeViewer = viewer;
      }
   }

   public keydownEvent = (e: KeyboardEvent) => {
      if (!this.enabled)
         return;

      this.onKeyDown(this.activeViewer.view.imageViewer, e);
   }

   private onKeyDown = (imgViewer: lt.Controls.ImageViewer, e: KeyboardEvent) => {
      if ((!e.ctrlKey && !e.altKey && !e.shiftKey) || this.lockKeyEvents)
         return;

      const item = imgViewer.getFirstVisibleItem(lt.Controls.ImageViewerItemPart.view);
      if (!item) return;

      if (this.onKeyDownTrigger)
         this.onKeyDownTrigger(e);

      if (e.ctrlKey && !e.shiftKey) {
         switch (e.key) {
            case 'Up':
            case 'ArrowUp':
               e.stopPropagation();
               this.moveUp(item)
               break;
            case 'Down':
            case 'ArrowDown':
               e.stopPropagation();
               this.moveDown(item)
               break;
            case 'Left':
            case 'ArrowLeft':
               e.stopPropagation();
               this.moveLeft(item)
               break;
            case 'Right':
            case 'ArrowRight':
               e.stopPropagation();
               this.moveRight(item)
               break;
            case 'Enter':
               e.stopPropagation();
               this.rasterCompare();
               break;
            case 's':
               e.stopPropagation();
               e.preventDefault();
               if (!this.outputViewer.hasDocument)
                  return;

               const outputToggle = document.getElementById('toggleOutputTrigger');
               this.toggleOutputViewerTrigger(outputToggle);
               break;
         }
      }

      if (e.altKey) {
         switch (e.key) {
            case 'Left':
            case 'ArrowLeft':
               e.stopPropagation();
               e.preventDefault();
               this.rotate(item, -this.rotateThreshold)
               break;
            case 'Right':
            case 'ArrowRight':
               e.stopPropagation();
               e.preventDefault();
               this.rotate(item, this.rotateThreshold)
               break;
         }
      }

      if (e.ctrlKey && e.shiftKey) {
         switch (e.key) {
            case 'Left':
            case 'ArrowLeft':
               e.stopPropagation();
               this.setActiveLeft();
               break;
            case 'Right':
            case 'ArrowRight':
               e.stopPropagation();
               this.setActiveRight();
               break;
         }
      }
   }

   private moveUp = (item: lt.Controls.ImageViewerItem) => {
      item.offsetBy(lt.LeadPointD.create(0, this.nudgeThreshold * -1));
   }

   private moveDown = (item: lt.Controls.ImageViewerItem) => {
      item.offsetBy(lt.LeadPointD.create(0, this.nudgeThreshold));
   }

   private moveLeft = (item: lt.Controls.ImageViewerItem) => {
      item.offsetBy(lt.LeadPointD.create(this.nudgeThreshold * -1, 0));
   }

   private moveRight = (item: lt.Controls.ImageViewerItem) => {
      item.offsetBy(lt.LeadPointD.create(this.nudgeThreshold, 0));
   }

   private rotate = (item: lt.Controls.ImageViewerItem, angle: number) => {
      item.rotateAngle = item.rotateAngle + angle;
      this.activeViewer.view.imageViewer.updateTransform();
      this.activeViewer.view.imageViewer.zoom(lt.Controls.ControlSizeMode.none, this.activeViewer.view.imageViewer.scaleFactor, this.activeViewer.view.imageViewer.defaultZoomOrigin);
   }

   private updateNudgeThreshold = () => {
      const slider = document.getElementById('nudgeSlider') as HTMLInputElement
      const input = document.getElementById(`nudgeValue`) as HTMLInputElement;

      const value = `${this.nudgeThreshold}`;
      if (slider.value !== value)
         slider.value = value;

      if (input.value !== value)
         input.value = value;
   }

   private updateRotateThreshold = () => {
      const slider = document.getElementById('rotateSlider') as HTMLInputElement
      const input = document.getElementById(`rotateValue`) as HTMLInputElement;

      const value = `${this.rotateThreshold}`;
      if (slider.value !== value)
         slider.value = value;

      if (input.value !== value)
         input.value = value;
   }

   private getActiveItem = () => {
      if (!this.activeViewer)
         return null;

      const pageNumber = this.activeViewer.currentPageNumber;

      return this.activeViewer.view.imageViewer.items.get_item(pageNumber - 1);
   }
   /**
    * ******************************************************************************************
    * * ******************************* Bindings ***********************************************
    * ******************************************************************************************
    */

   private applyUIBindings = () => {
      const leftTrigger = document.getElementById('setActiveLeft');
      leftTrigger.onclick = this.setActiveLeft;

      const rightTrigger = document.getElementById('setActiveRight');
      rightTrigger.onclick = this.setActiveRight;

      const nudgeThreshold = document.getElementById('nudgeSlider') as HTMLInputElement;
      if (lt.LTHelper.browser === lt.LTBrowser.internetExplorer)
         nudgeThreshold.onchange = this.onNudgeThresholdInput;
      else
         nudgeThreshold.oninput = this.onNudgeThresholdInput;

      nudgeThreshold.value = this.nudgeThreshold.toString();

      const nudgeLeft = document.getElementById('nudgeLeft');
      nudgeLeft.onclick = () => this.moveLeft(this.getActiveItem());

      const nudgeRight = document.getElementById('nudgeRight');
      nudgeRight.onclick = () => this.moveRight(this.getActiveItem());

      const nudgeUp = document.getElementById('nudgeUp');
      nudgeUp.onclick = () => this.moveUp(this.getActiveItem());

      const nudgeDown = document.getElementById('nudgeDown');
      nudgeDown.onclick = () => this.moveDown(this.getActiveItem());

      const rotateThreshold = document.getElementById('rotateSlider') as HTMLInputElement
      if (lt.LTHelper.browser === lt.LTBrowser.internetExplorer)
         rotateThreshold.onchange = this.onRotateThresholdInput;
      else
         rotateThreshold.oninput = this.onRotateThresholdInput;

      rotateThreshold.value = this.rotateThreshold.toString();

      const rotateClockwise = document.getElementById('clockwise');
      rotateClockwise.onclick = () => this.rotate(this.getActiveItem(), this.rotateThreshold);

      const rotateCounterClockwise = document.getElementById('counter-clockwise');
      rotateCounterClockwise.onclick = () => this.rotate(this.getActiveItem(), -this.rotateThreshold);

      const rasterSettings = document.getElementById('rasterSettingsTrigger');
      rasterSettings.onclick = () => this.settingsDlg.inner.show();

      const outputToggle = document.getElementById('toggleOutputTrigger');
      toggleButton(false, outputToggle);
      outputToggle.onclick = () => {
         this.toggleOutputViewerTrigger(outputToggle);
      }

      const rasterCompareTrigger = document.getElementById('rasterCompareTrigger');
      rasterCompareTrigger.onclick = () => {
         this.rasterCompare();
      }
      const nudge = document.getElementById(`nudgeValue`) as HTMLInputElement;
      nudge.value = this.nudgeThreshold.toString();

      const rotate = document.getElementById(`rotateValue`) as HTMLInputElement;
      rotate.value = this.rotateThreshold.toString();

      this.bindNudgeThreshold();
      this.bindRotateThreshold();
   }

   private bindNudgeThreshold = () => {
      const nudge = document.getElementById(`nudgeValue`) as HTMLInputElement;
      nudge.onblur = () => {
         const val = +nudge.value;
         if (!val || isNaN(val) || val < 0 || val > 100) {
            this.updateNudgeThreshold();
            nudge.value = `${this.nudgeThreshold}`;
            return;
         }

         this.nudgeThreshold = val;
         nudge.value = `${this.nudgeThreshold}`;
         this.updateNudgeThreshold();
      }
   }

   private bindRotateThreshold = () => {
      const rotate = document.getElementById(`rotateValue`) as HTMLInputElement;
      rotate.onblur = () => {
         const val = +rotate.value;
         if (!val || isNaN(val) || val < 0 || val > 90) {
            this.updateRotateThreshold();
            rotate.value = `${this.rotateThreshold}`;
            return;
         }

         this.rotateThreshold = val;
         this.updateRotateThreshold();
      }
   }

   private setActiveLeft = () => {
      this.activeViewer = this.viewers[0];
   }

   private setActiveRight = () => {
      this.activeViewer = this.viewers[1];
   }

   private activeViewerCallback = (activeViewer: lt.Document.Viewer.DocumentViewer) => {
      const tag: string = activeViewer.tag;
      const activeHolder = document.getElementById('activeViewer')
      if (tag.indexOf('1') !== -1)
         activeHolder.innerText = 'Left';

      if (tag.indexOf('2') !== -1)
         activeHolder.innerText = 'Right';
   }

   private onNudgeThresholdInput = (e: Event) => {
      const newThreshold = +(e.currentTarget as HTMLInputElement).value;
      if (isNaN(newThreshold))
         return;

      this.nudgeThreshold = newThreshold;
      this.updateNudgeThreshold();

      e.stopPropagation();
   }

   private onRotateThresholdInput = (e: Event) => {
      const newThreshold = +(e.currentTarget as HTMLInputElement).value;
      if (isNaN(newThreshold))
         return;

      this.rotateThreshold = newThreshold;
      this.updateRotateThreshold();

      e.stopPropagation();
   }

   private toggleOutputViewerTrigger = (context: HTMLElement) => {
      const toggle = context.classList.contains('active-icon');
      this.hideOutputViewer(context, toggle);
   }

   private hideOutputViewer = (context: HTMLElement, val: boolean) => {
      const outputPanel = this.outputViewer.view.imageViewer.mainDiv.parentElement.parentElement;
      if (val) {
         if (context)
            context.classList.remove('active-icon');
         outputPanel.style.zIndex = null;
         outputPanel.style.opacity = null;
      }
      else {
         if (context)
            context.classList.add('active-icon');
         outputPanel.style.zIndex = '4';
         outputPanel.style.opacity = '1';
      }
   }

   private rasterCompare = () => {
      const originalViewer = this.viewers[0].view.imageViewer;
      const modifiedViewer = this.viewers[1].view.imageViewer;
      const originalItem = originalViewer.items.item(this.viewers[0].currentPageNumber - 1);
      const modifiedItem = modifiedViewer.items.item(this.viewers[1].currentPageNumber - 1);
      // convert it to document coordinates.
      let originalPoint = originalItem.offset;
      originalPoint = this.viewers[0].document.pointToDocument(originalPoint);
      let modifiedPoint = modifiedItem.offset;
      modifiedPoint = this.viewers[1].document.pointToDocument(modifiedPoint);

      const request: RasterCompareRequest = {
         originalDocumentId: this.viewers[0].document.documentId,
         originalPageNumber: this.viewers[0].currentPageNumber,
         originalOffset: originalPoint,
         originalRotationAngle: originalItem.rotateAngle,
         modifiedDocumentId: this.viewers[1].document.documentId,
         modifiedPageNumber: this.viewers[1].currentPageNumber,
         modifiedOffset: modifiedPoint,
         modifiedRotationAngle: modifiedItem.rotateAngle,
         threshold: this.settingsDlg.threshold,
         originalBackground: null,
         originalForeground: null,
         modifiedBackground: null,
         modifiedForeground: null,
         outputAddition: this.settingsDlg.colors.outputAddition,
         outputBackground: this.settingsDlg.colors.outputBackground,
         outputChange: this.settingsDlg.colors.outputChange,
         outputDeletion: this.settingsDlg.colors.outputDeletion,
         outputExternal: this.settingsDlg.colors.outputDeletion,
         outputMatch: this.settingsDlg.colors.outputMatch,
         userData: lt.Document.DocumentFactory.serviceUserData
      };

      const loadDlg = new LoadingDlg();
      loadDlg.show(false, false, 'Comparing images...', '', null);
      this.lockKeyEvents = true;
      const errorHandler = (err?: string) => {
         alert('There was an issue comparing the images');
         console.log(`There was an issue comparing the images: ${err}`)
         loadDlg.hide();
         this.lockKeyEvents = false;
      }
      getRasterResult(request)
         .then((outputId: string) => {
            if (!outputId) {
               errorHandler()
               return;
            }

            // We have the output ID for the document now.
            lt.Document.DocumentFactory.loadFromCache(outputId)
               .done((d) => {
                  const outputTrigger = document.getElementById('toggleOutputTrigger');
                  const zoom = this.viewers[0].view.imageViewer.scaleFactor;
                  this.outputViewer.setDocument(d);
                  this.outputViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewZoomPercentage, zoom * 100);
                  this.hideOutputViewer(outputTrigger, false);
                  loadDlg.hide();
                  this.lockKeyEvents = false;
                  toggleButton(true, outputTrigger);
                  if (this.previousId)
                     lt.Document.DocumentFactory.deleteFromCache(this.previousId);

                  this.previousId = outputId;
               })
         });
   }

   public updateActiveViewer = (clear: boolean = false) => {
      const activeViewer = (clear) ? null : this.activeViewer;
      this.viewers.forEach((viewer) => {
         const container = document.getElementById(viewer.tag).parentElement;
         if (viewer === activeViewer)
            container.classList.add('selected-border')
         else
            container.classList.remove('selected-border')
      })
   }
}