/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
const onServiceError = (serviceError: lt.Document.ServiceError) => {
   let serviceMessage;
   let showAlert = true;
   if (!serviceError.isParseError && !serviceError.isBrowserError && !serviceError.isError && !!serviceError.methodName && !!serviceError.exceptionType) {
      const parts: string[] = [];

      parts.push(serviceError.detail);
      parts.push("\nMethod name: " + serviceError.methodName);
      parts.push("Exception type: " + serviceError.exceptionType);
      if (serviceError.exceptionType.indexOf("Leadtools") != -1) {
         // This is a LEADTOOLS error, get the details
         parts.push("Code: " + serviceError.code);
      }

      if (serviceError.link) {
         parts.push("Link: " + serviceError.link);
         lt.LTHelper.logError("Service Error - Help Link:");
         lt.LTHelper.logError(serviceError.link);
         lt.LTHelper.logError(serviceError);
      }
      else {
         lt.LTHelper.logError("Service Error");
         lt.LTHelper.logError(serviceError);
      }

      parts.push("\nInformation available in the console.");
      serviceMessage = parts.join("\n");
   }
   else {
      if (serviceError.isParseError || serviceError.isBrowserError) {
         serviceMessage = serviceError.errorThrown;
      }
      else if (serviceError.isError) {
         serviceMessage = (serviceError.statusCode) ? (serviceError.statusCode + " " + serviceError.errorThrown) : serviceError.errorThrown;
      }
      else {
         serviceMessage = "The request failed for an unknown reason. Check the connection to the Document Service."
      }
   }

   if (showAlert) {
      window.alert(serviceMessage);
   }
}

export { onServiceError };