/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { LoadingDlg } from "../Modals/LoadingDlg";
import { onServiceError } from "../../utils/ServiceError";

declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean
    }
}

const downloadMarkdownReport = (uri: string, loadingDlg: LoadingDlg) => {
    lt.Document.DocumentFactory.downloadDocumentData(null, uri, false, false, false)
        .done((response) => {
            const data = response.data;
            let responseBuffer: Uint8Array = null;
            if (typeof data === "string") {
                const enc = new TextEncoder();
                responseBuffer = enc.encode(data);
            } else { responseBuffer = new Uint8Array(response.data); }
            const fileName = "MarkdownReport.md";
            // Setting the mimetype to text/markdown will strip characters -- leave as text/plain
            const blob = new Blob([responseBuffer], { type: "text/plain" });

            //IE
            if (navigator.msSaveBlob) {
                return navigator.msSaveBlob(blob, fileName)
            }

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string) => {
            const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
            onServiceError(serviceError);
        })
        .always(() => loadingDlg.hide());
}

const queryStatus = (result: lt.Document.Compare.RunCompareJobResult, loadingDlg: LoadingDlg) => {
    lt.Document.Compare.CompareJobRunner.queryCompareJobStatus(result.userToken, result.jobToken)
        .done((data: lt.Document.Compare.CompareJobData) => {
            if (data.jobStatus === lt.Document.Compare.CompareStatus.completed) {
                downloadMarkdownReport(data.outputUri, loadingDlg);
                return;
            }

            if (data.jobStatus === lt.Document.Compare.CompareStatus.aborted || data.jobStatus === lt.Document.Compare.CompareStatus.failed) {
                if (data.abort) return;

                window.alert("There was an error comparing the Documents: " + JSON.stringify(data.errors));
                loadingDlg.hide();
                return;
            }

            // If the Compare is still working, check again in 2 seconds.
            window.setTimeout(() => {
                queryStatus(result, loadingDlg);
            }, 2000);
        })
        .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string) => {
            const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
            onServiceError(serviceError);
            loadingDlg.hide();
        });
}

const serverCompare = (viewers: lt.Document.Viewer.DocumentViewer[], loadingDlg: LoadingDlg) => {
    if (!viewers || viewers.length !== 2) {
        alert('Exactly two viewers must be provided for server-side compare');
        return;
    }

    if (!viewers[0].hasDocument || !viewers[1].hasDocument) {
        alert('Both viewers must have documents loaded');
        return;
    }

    const data = new lt.Document.Compare.ServiceCompareJobData();
    data.documentIds = viewers.map(x => x.document.documentId);
    data.outputMimetype = 'text/markdown';
    data.outputDocumentId = lt.LTHelper.newGuid();

    loadingDlg.show(false, false, 'Comparing Documents...', null, null);

    lt.Document.Compare.CompareJobRunner.runCompareJob(data)
        .done((result: lt.Document.Compare.RunCompareJobResult) => queryStatus(result, loadingDlg))
        .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string) => {
            const serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
            onServiceError(serviceError);
            loadingDlg.hide();
        });
}

export { serverCompare };