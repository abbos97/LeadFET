/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { LoadingDlg } from "../LoadingDlg";

export interface GetColorizedImageRequest {
   documentId: string;
   pageNumber: number;
   backgroundColor: string;
   foregroundColor: string;
}


const getColorizedImage = (viewer: lt.Document.Viewer.DocumentViewer, backgroundColor: string, foregroundColor: string) => {
   if(!viewer)
      throw new Error('Viewer is null.');

   if(!backgroundColor)
      throw new Error('Invalid background color provided.');

   if(!foregroundColor)
      throw new Error('Invalid foreground color provided.')

   const page = viewer.currentPageNumber;
   const item = viewer.view.imageViewer.items.get_item(page - 1);

   const request: GetColorizedImageRequest = {
      documentId : viewer.document.documentId,
      pageNumber: page,
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor
   };

   const url = `${lt.Document.DocumentFactory.serviceUri}/Compare/GetColorPage?documentId=${request.documentId}&pageNumber=${request.pageNumber}&backgroundColor=${encodeURIComponent(request.backgroundColor)}&foregroundColor=${encodeURIComponent(request.foregroundColor)}`;
   if(url === item.url)
      return;

   item.url = url.toString();
   viewer.view.imageViewer.invalidateItem(item);
}

export {getColorizedImage};