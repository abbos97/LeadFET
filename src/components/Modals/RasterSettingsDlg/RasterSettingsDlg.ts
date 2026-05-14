/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { ColorPicker } from "../../ColorPicker/ColorPicker";
import { getColorizedImage } from "./GetColorizedImage";

export interface IRasterSettingsDlg<T> {
   hide: T,
   reset: T,
   getColorizedLeft: T,
   getColorizedRight: T,
   leftBackground: T,
   leftForeground: T,
   rightBackground: T,
   rightForeground: T,
   outputBackground: T,
   outputMatch: T,
   outputExternal: T,
   outputAddition: T,
   outputDeletion: T,
   outputChange: T,
   thresholdInput: T,
   thresholdSlider: T
}

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

export class RasterSettingsDlg {
   public inner: lt.Demos.Dialogs.InnerDialog = null;
   public colors: RasterCompareColors = null;
   public threshold: number = 30;
   private defaultThreshold: number = 30;
   private defaultColors = null;
   private el: IRasterSettingsDlg<string> = null;
   private leftViewer: lt.Document.Viewer.DocumentViewer = null;
   private rightViewer: lt.Document.Viewer.DocumentViewer = null;
   private view: lt.Document.Viewer.CompareView = null;

   public constructor(leftViewer: lt.Document.Viewer.DocumentViewer, rightViewer: lt.Document.Viewer.DocumentViewer, colors: RasterCompareColors, view: lt.Document.Viewer.CompareView) {
      const root = $("#dlgRasterSettings");
      this.el = {
         hide: 'rasterSettings-hide',
         reset: 'rasterSettings-reset',
         getColorizedLeft: 'rasterSettings-getLeftColored',
         getColorizedRight: 'rasterSettings-getRightColored',
         leftBackground: 'rasterSettings-leftBackground',
         leftForeground: 'rasterSettings-leftForeground',
         rightBackground: 'rasterSettings-rightBackground',
         rightForeground: 'rasterSettings-rightForeground',
         outputBackground: 'rasterSettings-outputBackground',
         outputMatch: 'rasterSettings-outputMatch',
         outputExternal: 'rasterSettings-outputExternal',
         outputAddition: 'rasterSettings-outputAddition',
         outputDeletion: 'rasterSettings-outputDeletion',
         outputChange: 'rasterSettings-outputChange',
         thresholdInput: 'colorThresholdInput',
         thresholdSlider: 'colorThresholdSlider'
      }
      this.leftViewer = leftViewer;
      this.rightViewer = rightViewer;
      this.defaultColors = colors;
      this.view = view;
      this.inner = new lt.Demos.Dialogs.InnerDialog(root);
      this.inner.transitionToggle.update({
         interruptionAction: lt.Demos.Utils.TransitionToggleInterruptionAction.wait,
         interruptionWaitTime: 200
      });

      this.colors = this.getDefaultColors();
      this.view.originalBackgroundColor = this.colors.originalBackground;
      this.view.originalForegroundColor = this.colors.originalForeground;
      this.view.modifiedBackgroundColor = this.colors.modifiedBackground;
      this.view.modifiedForegroundColor = this.colors.modifiedForeground;

      this.bindColorUIElements();
      this.bindThresholdElements();

      document.getElementById(this.el.hide).onclick = this.hide;
   }

   private hide = () => this.inner.hide();

   private getDefaultColors = () => {
      const colors: RasterCompareColors = {
         ...this.defaultColors
      };

      return colors;
   }

   private bindThresholdElements = () => {
      const input = document.getElementById(this.el.thresholdInput) as HTMLInputElement;
      const slider = document.getElementById(this.el.thresholdSlider) as HTMLInputElement;

      const onChange = () => {
         const value = `${this.threshold}`;
         if (slider.value !== value)
            slider.value = value;

         if (input.value !== value)
            input.value = value;
      }

      input.onblur = () => {
         const val = +input.value;
         if (!val || isNaN(val) || val < 0 || val > 255) {
            input.value = `${this.threshold}`;
            onChange();
            return;
         }

         this.threshold = val;
         input.value = `${this.threshold}`;
         onChange();
      }

      slider.oninput = (e: Event) => {
         const newThreshold = +(e.currentTarget as HTMLInputElement).value;
         if (isNaN(newThreshold))
            return;

         this.threshold = newThreshold;
         onChange()
      }
   }


   private bindColorUIElements = () => {

      /** Color initializers */
      const leftBackground = new ColorPicker(this.el.leftBackground, { initialColor: this.colors.originalBackground });
      leftBackground.onColorChange = (color: string) => {
         this.colors.originalBackground = color;
         this.view.originalBackgroundColor = color;
      }

      const leftForeground = new ColorPicker(this.el.leftForeground, { initialColor: this.colors.originalForeground });
      leftForeground.onColorChange = (color: string) => {
         this.colors.originalForeground = color;
         this.view.originalForegroundColor = color;
      }

      const rightBackground = new ColorPicker(this.el.rightBackground, { initialColor: this.colors.modifiedBackground });
      rightBackground.onColorChange = (color: string) => {
         this.colors.modifiedBackground = color;
         this.view.modifiedBackgroundColor = color;
      }

      const rightForeground = new ColorPicker(this.el.rightForeground, { initialColor: this.colors.modifiedForeground });
      rightForeground.onColorChange = (color: string) => {
         this.colors.modifiedForeground = color;
         this.view.modifiedForegroundColor = color;
      }

      const outputBackground = new ColorPicker(this.el.outputBackground, { initialColor: this.colors.outputBackground });
      outputBackground.onColorChange = (color: string) => this.colors.outputBackground = color;

      const outputMatch = new ColorPicker(this.el.outputMatch, { initialColor: this.colors.outputMatch });
      outputMatch.onColorChange = (color: string) => this.colors.outputMatch = color;

      const outputExternal = new ColorPicker(this.el.outputExternal, { initialColor: this.colors.outputExternal });
      outputExternal.onColorChange = (color: string) => this.colors.outputExternal = color;

      const outputAddition = new ColorPicker(this.el.outputAddition, { initialColor: this.colors.outputAddition });
      outputAddition.onColorChange = (color: string) => this.colors.outputAddition = color;

      const outputDeletion = new ColorPicker(this.el.outputDeletion, { initialColor: this.colors.outputDeletion });
      outputDeletion.onColorChange = (color: string) => this.colors.outputDeletion = color;

      const outputChange = new ColorPicker(this.el.outputChange, { initialColor: this.colors.outputChange });
      outputChange.onColorChange = (color: string) => this.colors.outputChange = color;

      const resetColorTrigger = document.getElementById(this.el.reset);
      resetColorTrigger.onclick = () => {
         this.colors = this.getDefaultColors();
         leftBackground.reset();
         leftForeground.reset();
         rightBackground.reset();
         rightForeground.reset();
         outputAddition.reset();
         outputBackground.reset();
         outputChange.reset();
         outputDeletion.reset();
         outputExternal.reset();
         outputMatch.reset();
         this.threshold = this.defaultThreshold;
         const threshold = `${this.threshold}`;

         const input = document.getElementById(this.el.thresholdInput) as HTMLInputElement;
         input.value = threshold;
         const slider = document.getElementById(this.el.thresholdSlider) as HTMLInputElement;
         slider.value = threshold;

         this.view.resetColor(this.colors.originalBackground, this.colors.modifiedBackground, this.colors.originalForeground, this.colors.modifiedForeground);
      }
   }
}