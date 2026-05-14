/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
export interface ColorPickerOptions {
   initialColor?: string;
}

export interface RGBA {
   r: number;
   g: number;
   b: number;
   a: number
}

export class ColorPicker {
   private readonly fallbackColor = 'red';
   private root: HTMLElement;
   private options: ColorPickerOptions;
   private activeColor: string;

   public constructor(root: string, options: ColorPickerOptions) {
      const ele = document.getElementById(root);
      if (!ele)
         throw new Error('Invalid root element id provided');

      this.root = ele;
      this.options = options;

      this.init()
   }

   public get color() {
      return this.activeColor;
   }

   public onColorChange: (color: string) => void = null;

   public dispose = () => {
      this.root.innerHTML = '';
      if (lt.LTHelper.browser !== lt.LTBrowser.internetExplorer)
         this.root.classList.remove('ColorContainer');
      else
         return;
   }

   public reset = () => {
      this.dispose();
      this.init();
   }

   private init = () => {
      if (lt.LTHelper.browser === lt.LTBrowser.internetExplorer || lt.LTHelper.browser === lt.LTBrowser.edge || lt.LTHelper.browser === lt.LTBrowser.safari)
         this.initFallback();
      else
         this.initHTML5();
   }

   private initFallback = () => {
      const color = (this.options && this.options.initialColor) ? this.options.initialColor : this.fallbackColor;

      this.root.classList.add('ColorContainer');
      // Build preview color swatch
      const swatch = document.createElement('div');
      swatch.classList.add('ColorSwatch');
      swatch.style.backgroundColor = color
      this.root.appendChild(swatch)

      // // Build drop-down arrow
      const arrow = document.createElement('div');
      arrow.classList.add('Arrow');
      this.root.appendChild(arrow)

      $(`#${this.root.id}`).spectrum({
         color: color,
         change: (changeColor) => {
            const outputColor = changeColor.toRgbString();
            this.activeColor = outputColor;
            swatch.style.backgroundColor = outputColor;

            if (this.onColorChange)
               this.onColorChange(outputColor);
         }
      });
   }

   private initHTML5 = () => {
      // Color classes are defined in ColorPicker.scss

      this.root.classList.add('ColorContainer');
      const color = (this.options && this.options.initialColor) ? this.options.initialColor : this.fallbackColor;

      // Build preview color swatch
      const swatch = document.createElement('div');
      swatch.classList.add('ColorSwatch');
      swatch.style.backgroundColor = color
      this.root.appendChild(swatch)

      // Build drop-down arrow
      const arrow = document.createElement('div');
      arrow.classList.add('Arrow');
      this.root.appendChild(arrow)

      // Add a hidden back-input
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'color';
      hiddenInput.value = this.colorToHex(color);

      hiddenInput.style.display = 'none';
      this.root.appendChild(hiddenInput);

      // Pass click events on the color-picker to the input element.
      this.root.onclick = () => {
         hiddenInput.click();
      }

      hiddenInput.onchange = (e: Event) => {
         this.colorHandle(e, swatch);
      }
   }

   private colorHandle = (e: Event, preview: HTMLElement) => {
      const color = (e.target as HTMLInputElement).value;

      if (!this.isValidColor(color)) {
         return;
      }

      this.activeColor = this.colorToRGBA(color) as string;
      preview.style.backgroundColor = color;
      if (this.onColorChange)
         this.onColorChange(this.colorToRGBA(color) as string);
   }

   private isValidColor = (color: string) => {

      // If the color matches our internal fallback color, then we know its valid
      if (color === this.fallbackColor)
         return true;

      const test = document.createElement('div');
      test.style.color = this.fallbackColor;
      test.style.color = color;

      let isValid = true;
      if (test.style.color === this.fallbackColor || test.style.color === '')
         isValid = false;

      test.remove();
      return isValid;
   }

   private colorToHex = (color: string): string => {
      if (!color) throw new Error("Invalid color string passed");

      const rgba = this.colorToRGBA(color, true) as RGBA;

      let r = rgba.r.toString(16);
      let g = rgba.g.toString(16);
      let b = rgba.b.toString(16);
      // We will ignore alpha values

      if (r.length == 1)
         r = `0${r}`;

      if (g.length == 1)
         g = `0${g}`;

      if (b.length == 1)
         b = `0${b}`;

      return `#${r}${g}${b}`;
   }

   private colorToRGBA = (color: string, asRgba = false): string | RGBA => {
      if (!color) throw new Error("Invalid color string passed");

      const temp = document.createElement('div');
      temp.style.color = color;
      document.body.appendChild(temp);

      const style = window.getComputedStyle(temp).color;

      const parsedColor = style.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      if (!parsedColor) throw new Error("Failed to parse color");

      const rgba: RGBA = {
         r: parseInt(parsedColor[1]),
         g: parseInt(parsedColor[2]),
         b: parseInt(parsedColor[3]),
         a: parsedColor.length === 5 && parsedColor[4] ? +parsedColor[4] : 1
      };

      temp.remove();
      if (asRgba)
         return rgba;

      return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
   }
}