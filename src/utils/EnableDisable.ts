/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
const toggleButton = (val: boolean, ele: HTMLElement) => {
   if(!val){
      ele.style.pointerEvents = 'none';
      ele.style.opacity = '.5';
   }else{
      ele.style.pointerEvents ='auto';
      ele.style.opacity = '1';
   }
}

export {toggleButton};