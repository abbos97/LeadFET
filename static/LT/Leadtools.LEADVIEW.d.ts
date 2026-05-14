/**************************************************
Copyright (c) 1991-2026 Apryse Software Corp. ALL RIGHTS RESERVED.
This software is protected by United States and International copyright laws.
Any copying, duplication, deployment, redistribution, modification or other
disposition hereof is STRICTLY PROHIBITED without an express written license
granted by Apryse Software Corp. Specifically, no portion of this file may be modified, 
altered or otherwise changed under any circumstances, nor may any portion of this file be 
merged with any other file(s) or code.
Portions of this product are licensed under US patent 5,327,254 and foreign
counterparts.
For more information, contact Apryse Software Corp. at 704-332-5532 or visit
https://www.leadtools.com
**************************************************/
// Library: Leadtools.LEADVIEW.d.ts
// Version:23.0.0.1
//*************************************************************
// Copyright (c) 1991-2026 Apryse Software Corp.
// All Rights Reserved.
//*************************************************************

declare module lt.LEADVIEW {
   class Viewer {
      constructor();

      /**
       * Initializes and mounts a LEADVIEW application.
       * @param runSettings - The run-time settings to use with LEADVIEW.
       * @param settings - Any LEADVIEW application settings.  Check the LEADVIEW settings JSON file for more information.
       */
      run(runSettings: RunSettings, settings: any): void;

      /** Unmounts LEADVIEW and disposes of all internal LEADVIEW resources. */
      dispose(): void;

      /** Clears the documents in the active Document Viewer */
      clear(): void;

      /** Returns all ids for the active document.
       * If loading in a document normally, there will only be one id returned in the collection.
       * If using the Virtual Document Library, then all of the sub-document ids will be returned as well.
       */
      getIds(): string[];

      /**
       * Function to remove an item from a document.
       * If the current document does not have children, and if the provided ID matches the document, the `clear()` method will be called instead.
       * @param id - The document ID to remove.
       */
      removeDocument(id: string): boolean;

      /** Gets the current `LEADDocument` from the active viewer. */
      getCurrentDocument(): lt.Document.LEADDocument;

      /**
       * Sets the provided `LEADDocument` into the active viewer.
       * @param document - The document to set.
       */
      setCurrentDocument(document: lt.Document.LEADDocument): boolean;

      /**
       * Gets the `DocumentViewer` that is currently active.
       */
      getDocumentViewer(): lt.Document.Viewer.DocumentViewer;

      /**
       * Gets the `AnnAutomation` that is currently active;
       */
      getAnnAutomation(): lt.Annotations.Automation.AnnAutomation;

      /**
       * Loads a document from a URI using LEADVIEW's internal loader.
       * @param params - Load operation parameters
       */
      loadFromUri(params: ILoadFromUriParams);

      /**
       * Loads a local document using LEADVIEW's internal loader.
       * @param params - Load operation paramters.
       */
      loadFromLocal(params: ILoadFromLocalParams);

      /**
       * Callback function that triggers everytime the active `DocumentViewer` in LEADVIEW changes.
       */
      onActiveViewerChanged: (viewer: lt.Document.Viewer.DocumentViewer) => void;

      static getColorKeys(): string[];
   }

   class RunSettings {
      constructor();
      author?: string;
      logger?: ILogger;
      presetFiles?: IUrlItem[];
   }

   interface IUrlItem {
      name: string;
      url: string;
   }

   interface ILoadFromUriParams {
      url: string;
      successCallback: (document: lt.Document.LEADDocument) => void;
      loadingDialogCallback?: (show: boolean) => void;
      loadOptions?: lt.Document.LoadDocumentOptions;
      failCallback?: (serviceError: lt.Document.ServiceError) => void;
      alwaysCallback?: () => void;
   }

   class LoadFromUriParams {
      url: string;
      successCallback: (document: lt.Document.LEADDocument) => void;
      loadingDialogCallback?: (show: boolean) => void;
      loadOptions?: lt.Document.LoadDocumentOptions;
      failCallback?: (serviceError: lt.Document.ServiceError) => void;
      alwaysCallback?: () => void;
      constructor(url: string);
   }

   interface ILoadFromLocalParams {
      file: any;
      annFile: any;
      loadSuccessCallback: (document: lt.Document.LEADDocument) => void;
      loadOptions?: lt.Document.LoadDocumentOptions;
      loadingDialogCallback?: (show: boolean) => void;
      uploadSuccessCallback?: () => void;
      uploadFailCallback?: (serviceError: lt.Document.ServiceError) => void;
      uploadProgressCallback?: (progress: number) => void;
      loadFailCallback?: (serviceError: lt.Document.ServiceError) => void;
      loadAlwaysCallback?: () => void;
      loadAnnotationsFailCallback?: (document: lt.Document.LEADDocument, error: any) => void;
   }

   class LoadFromLocalParams {
      file: any;
      loadSuccessCallback: (document: lt.Document.LEADDocument) => void;
      annFile: any;
      loadOptions?: lt.Document.LoadDocumentOptions;
      loadingDialogCallback?: (show: boolean) => void;
      uploadSuccessCallback?: () => void;
      uploadFailCallback?: (serviceError: lt.Document.ServiceError) => void;
      uploadProgressCallback?: (progress: number) => void;
      loadFailCallback?: (serviceError: lt.Document.ServiceError) => void;
      loadAlwaysCallback?: () => void;
      loadAnnotationsFailCallback?: (document: lt.Document.LEADDocument, error: any) => void;
      constructor(file: any);
   }

   interface ILogger {
      /**
     * This function is intended to be called whenever an application related error occurs.
     * @param errorType - The `ErrorType` that occurred
     * @param message - The internal message that was provided
     */
      logApplicationError: (errorType: ErrorType, message: string) => void;
      /**
       * This function will be hit whenever a Document Service related error occurs.
       * If the error is not able to be parsed by the LEADTOOLS SDK, then the default message will be provided.
       * @param serviceError - The `lt.Document.ServiceError` that was parsed.
       * @param defaultMessage - The default error message -- this will only be used if we could not parse the error from the LEADTOOLS SDK.
       */
      logServiceError: (serviceError: lt.Document.ServiceError, defaultMessage?: string) => string;
   }

   enum ErrorType {
      initialization = 0,
      failedToCreate = 1
   }

   class LVBinding {
      tooltip?: string;
      onClick?: () => void;
      class?: string;
   }

   class BindingManager {
      static Instance: BindingManager;
      get(key: string): LVBinding;
      add(key: string, binding: LVBinding, update: boolean): boolean;
      clear(): void;
      getAllAvailableKeys(): string[];
      isSupported(key: string): boolean;
   }

   enum InjectionType {
      annToolbar = 0,
      menu = 1,
      toolbar = 2
   }

   enum InjectionState {
      mounting = 0,
      unmounting = 1
   }

   class InjectionArgs {
      type: InjectionType;
      data: any;
      state: InjectionState;
   }

   class InjectionManager {
      static Instance: InjectionManager;
      inject: (args: InjectionArgs) => void;
   }

   class AnnPanelInjector {
      start: string;
      end: string;
   }

   class MenuInjector {
      start: string;
      end: string;
      tabStart: string;
      tabEnd: string;
      content: string;
   }

   class ToolbarInjector {
      start: string;
      end: string;
   }
}
