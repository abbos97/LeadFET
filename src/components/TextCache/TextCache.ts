/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
export interface CacheItem {
   document: lt.Document.LEADDocument;
   pageNumber: number;
}

export class TextCache {

   public cache: CacheItem[]

   constructor() {
      this.cache = [];
   }


   public add = (item: CacheItem) => {
      if(this.hasEntry(item))
         return;

      this.cache.push(item);
   }

   public clearDocument = (document: lt.Document.LEADDocument) => {
      this.cache = this.cache.filter(x=> x.document.documentId !== document.documentId);
   }

   public clearAll = () => {
      this.cache = [];
   }

   public hasEntry = (item: CacheItem) => {
      const entry = this.cache.find((e) => {
         return e.document.documentId === item.document.documentId && e.pageNumber === item.pageNumber;
      });

      return !!entry;
   }

   public getTextSynchronous = (entry: CacheItem, viewer: lt.Document.Viewer.DocumentViewer) => {
      const promise = new Promise<void>((resolve, reject) => {
         const operation = (sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs) => {
            if(e.operation == lt.Document.Viewer.DocumentViewerOperation.getText && e.isPostOperation){
               viewer.operation.remove(operation);
               resolve();
            }
         }
         viewer.operation.add(operation);
         viewer.text.getDocumentPageText(entry.pageNumber);
      });

      return promise;
   }
}