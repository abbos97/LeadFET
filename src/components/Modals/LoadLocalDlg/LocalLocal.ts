/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
interface ILoadFromLocalParams {
   file: any;
   loadSuccessCallback: (document: lt.Document.LEADDocument) => void;
   loadingDialogCallback?: (show: boolean) => void;
   uploadSuccessCallback?: () => void;
   uploadFailCallback?: (serviceError: lt.Document.ServiceError) => void;
   uploadProgressCallback?: (progress: number) => void;
   loadFailCallback?: (serviceError: lt.Document.ServiceError) => void;
   loadAlwaysCallback?: () => void;
   loadAnnotationsFailCallback?: (document: lt.Document.LEADDocument, error: any) => void;
}

class LoadFromLocalParams {
   public file: any = null;
   public loadSuccessCallback: (document: lt.Document.LEADDocument) => void = null;

   public annFile?: any = null;
   public loadOptions?: lt.Document.LoadDocumentOptions = null;
   public loadingDialogCallback?: (show: boolean) => void = null;
   public uploadSuccessCallback?: () => void = null;
   public uploadFailCallback?: (serviceError: lt.Document.ServiceError) => void = null;
   public uploadProgressCallback?: (progress: number) => void = null;
   public loadFailCallback?: (serviceError: lt.Document.ServiceError) => void = null;
   public loadAlwaysCallback?: () => void = null;
   loadAnnotationsFailCallback?: (document: lt.Document.LEADDocument, error:any) => void = null;

   public constructor(file: any) {
      if(!file) throw new Error("Invalid file provided");

      this.file = file;
   }
}

const loadFromLocal = (params: ILoadFromLocalParams) => {
   if (!params || !params.file || !params.loadSuccessCallback) throw new Error('Invalid LoadFromLocalParams provided.');

   const statusChanged = (show: boolean) => { if (params.loadingDialogCallback) params.loadingDialogCallback(show); }
   statusChanged(true);

   const uploadPromise = lt.Document.DocumentFactory.uploadFile(params.file);
   uploadPromise.done((uploadedDocumentUrl: string) => {
      if (params.uploadSuccessCallback)
         params.uploadSuccessCallback();

      let loadOptions = new lt.Document.LoadDocumentOptions();
      loadOptions.name = (params.file as File).name;
      if (lt.LTHelper.device === lt.LTDevice.desktop)
         loadOptions.maximumImagePixelSize = 4096;
      else
         loadOptions.maximumImagePixelSize = 2048;

      const promise = lt.Document.DocumentFactory.loadFromUri(uploadedDocumentUrl, loadOptions);
      promise.done((document: lt.Document.LEADDocument) => params.loadSuccessCallback(document));

      promise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string) => {
         const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
         statusChanged(false);

         if (serviceError.isAbortError) return; // action aborted, return silently

         if (params.loadFailCallback) params.loadFailCallback(serviceError);
      });

      promise.always(() => {
         if (params.loadAlwaysCallback)
            params.loadAlwaysCallback();
      });
   });

   uploadPromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string) => {
      const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
      statusChanged(false);

      if (serviceError.isAbortError) return; // action aborted, return silently

      if (params.uploadFailCallback) params.uploadFailCallback(serviceError);
   });

   uploadPromise.progress((progressOb: lt.Document.DocumentUploadProgress): void => {
      const progress = Math.round(progressOb.progress);
      if (params.uploadProgressCallback)
         params.uploadProgressCallback(progress);
   });

}

export {loadFromLocal, ILoadFromLocalParams, LoadFromLocalParams};