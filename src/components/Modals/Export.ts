/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { LoadingDlg } from "./LoadingDlg";
import { onServiceError } from "../../utils/ServiceError";

export interface IConvertParams {
   document: lt.Document.LEADDocument;
   jobData: lt.Document.DocumentConverterJobData;
   hasChanged: boolean;
   prepareConvertCallback?: () => void;
   convertStartedCallback?: () => void;
   failCallback?: (serviceError: lt.Document.ServiceError) => void;
   alwaysCallback?: () => void;
   successCallback?: (url: string, convertItem: lt.Document.ConvertItem) => void;
}

const statusConvert = (params: IConvertParams) => {
   if (!params || !params.document || !params.jobData || !params.successCallback) throw new Error('Invalid params passed');

   if (params.prepareConvertCallback) params.prepareConvertCallback();

   // If the file has changed, or if the cache status has not been synced -- we need to save the document to the Cache first.
   if (params.hasChanged || params.document.isAnyCacheStatusNotSynced) {
      const promise = lt.Document.DocumentFactory.saveToCache(params.document);

      promise.done(() => runStatusConvert(params));
      promise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
         const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
         if (params.failCallback)
            params.failCallback(serviceError);
      });
   }
   else
      runStatusConvert(params);
}

const runStatusConvert = (params: IConvertParams) => {
   if (params.convertStartedCallback) params.convertStartedCallback();
   const convertPromise = lt.Document.Converter.StatusJobDataRunner.runConvertJob(params.document.documentId, params.jobData);
   convertPromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
      const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
      if (params.failCallback)
         params.failCallback(serviceError);
   });

   convertPromise.done((data) => {
      queryConvertStatus(params, data);
   });
}

const queryConvertStatus = (params: IConvertParams, result: lt.Document.Converter.RunConvertJobResult) => {
   const promise = lt.Document.Converter.StatusJobDataRunner.queryConvertJobStatus(result.userToken, result.jobToken);
   promise.done((data) => {
      if (data.errorMessages && data.errorMessages.length) {
         if (!params.failCallback) return;

         const serviceError = new lt.Document.ServiceError();
         let message = '';
         data.errorMessages.forEach((error) => {
            message += `${error} \n`;
         });
         serviceError.message = message;
         params.failCallback(serviceError);
         return;
      }

      if (data.isCompleted) {
         cleanupConvert(params, data);
         return;
      }

      window.setTimeout(() => {
         queryConvertStatus(params, result);
      }, 3000);
   });

   promise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
      const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
      if (params.failCallback)
         params.failCallback(serviceError);
   });
}

const cleanupConvert = (params: IConvertParams, result: lt.Document.Converter.StatusJobData) => {
   /**
    * Nothing to delete for EHCache.
    * Comment out this block if you are running the Document Service with a memory cache.
    */

   const promise = lt.Document.Converter.StatusJobDataRunner.deleteConvertJob(result.userToken, result.jobToken);
   // promise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
   //    const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
   //    if (params.failCallback)
   //       params.failCallback(serviceError);
   // });

   promise.always(() => {
      if (params.successCallback) {
         const url = lt.Document.Service.Custom.createEndpointGetUrl("Factory", "DownloadDocument", {
            uri: result.outputDocumentUri,
            includeAnnotations: true,
            userData: lt.Document.DocumentFactory.serviceUserData
         }, true);

         params.successCallback(url, null);
      }
   });
}

const exportClick = (viewer: lt.Document.Viewer.DocumentViewer, dlg: LoadingDlg ) => {
   if (!viewer.hasDocument) {
      alert('Please load in a document first');
      return;
   }

   const jobData = new lt.Document.DocumentConverterJobData();

   // For the purposes of this demo, we will always convert to RasPDF.
   jobData.documentFormat = lt.Document.Writer.DocumentFormat.user;
   jobData.rasterImageFormat = lt.Document.RasterImageFormat.rasPdf;
   jobData.inputDocumentFirstPageNumber = 1;
   jobData.inputDocumentLastPageNumber = -1;
   jobData.annotationsMode = lt.Document.DocumentConverterAnnotationsMode.none; // We don't care about annotations.
   jobData.enableSvgConversion = true;
   jobData.svgImagesRecognitionMode = 0;
   jobData.jobErrorMode = lt.Document.DocumentConverterJobErrorMode.resume;
   jobData.jobName = 'Document Compare Job';
   jobData.pageNumberingTemplate = "##name##_Page(##page##).##extension##";
   jobData.preprocessorDeskew = false;
   jobData.preprocessorInvert = false;
   jobData.preprocessorOrient = false;

   const pageCount = viewer.document.pages.count;
   const allContainers = viewer.annotations.automation.containers;
   const modifiedContainers: lt.Annotations.Engine.AnnContainer[] = [];
   for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      if (viewer.annotations.isContainerModified(pageNumber)) {
         modifiedContainers.push(allContainers.item(pageNumber - 1));
      }
   }

   if (modifiedContainers.length > 0) {
      const annotations = new lt.Annotations.Engine.AnnCodecs().saveAll(modifiedContainers, lt.Annotations.Engine.AnnFormat.annotations);
      jobData.annotations = annotations;

      const doc = viewer.document;
      doc.annotations.modifiedContainers = modifiedContainers;
   }

   const convertParams: IConvertParams = {
      document: viewer.document,
      jobData: jobData,
      hasChanged: true,
      prepareConvertCallback: () => dlg.show(false, false, 'Preparing file for convert', 'Hold on while we get things ready for you!', null),
      convertStartedCallback: () => dlg.show(false, false, 'Converting', '', null),
      failCallback: (serviceError: lt.Document.ServiceError) => {
         dlg.hide();
         onServiceError(serviceError);
      },
      successCallback: (url: string, convertItem: lt.Document.ConvertItem) => {
         dlg.hide();

         if(lt.LTHelper.browser === lt.LTBrowser.internetExplorer) {
            const win = window.open(url, '_blank');
            win.focus();
            return;
         }

         const ele = document.createElement('a');
         ele.href = url;
         ele.target = '_blank';
         ele.style.display = 'none';
         document.body.appendChild(ele);
         ele.click();
         document.body.removeChild(ele);
      }
   }

   statusConvert(convertParams);
}

export { exportClick };