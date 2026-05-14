/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
export interface RasterCompareRequest {
   originalDocumentId: string;
   originalPageNumber: number;
   originalOffset: lt.LeadPointD;
   originalRotationAngle: number;
   modifiedDocumentId: string;
   modifiedPageNumber: number;
   modifiedOffset: lt.LeadPointD;
   modifiedRotationAngle: number;
   threshold: number;
   originalBackground: string;
   originalForeground: string;
   modifiedBackground: string;
   modifiedForeground: string;
   outputExternal: string;
   outputBackground: string;
   outputMatch: string;
   outputAddition: string;
   outputDeletion: string;
   outputChange: string;
   userData: string;
}

export interface RasterCompareResponse {
   outputDocumentId: string;
}

const getRasterResult = async (request: RasterCompareRequest) => {
   const url = `${lt.Document.DocumentFactory.serviceUri}/Compare/CompareRasterPage`;

   const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
         'Content-Type': 'application/json',
      }
   }).then(async (response: Response) => {
      if(!response.ok)
         return null;

      return await response.json()
         .then((result: RasterCompareResponse) => {
            return result.outputDocumentId;
         })
   });

   return result;
}

export {getRasterResult}