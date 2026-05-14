/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
import { App } from "../../App";

/** ID for the diff panel holder */
const holder = 'diff-holder';
/** ID for the `Total Changes` diff panel label */
const totalChanges = 'total-changes';
/** CSS class to use when a row is selected */
const selectedClass = 'selected-row';

/**
 * Function to build the left-hand column on a a text-diff row that contains
 * information about the diff location & operation type.
 * @param diff  - The PageCharactersDifference object to parse.
 */
const buildLeftColumn = (diff: lt.Document.Compare.PageCharactersDifference) => {
   const column = document.createElement('div');
   column.className = 'left-column';

   const pageLabel = document.createElement('p');
   const pages = [...new Set(diff.characters.map(x => x.pageNumber))];
   const pageText = (pages.length === 1) ?
      `Page: ${pages[0]}` :
      `Pages: ${pages[0]}-${pages[pages.length - 1]}`;
   pageLabel.innerText = pageText;
   pageLabel.className = 'vcenter';
   column.appendChild(pageLabel);

   const operationLabel = document.createElement('p');
   const color = (diff.operation === lt.Document.Compare.DifferenceOperation.delete) ?
      "#ff3232" : "#00cc00";
   operationLabel.style.color = color;
   operationLabel.innerText = lt.Document.Compare.DifferenceOperation[diff.operation];
   operationLabel.className = 'vcenter';
   operationLabel.style.textTransform = 'capitalize';
   column.appendChild(operationLabel);

   return column;
}

/**
 * Function to build the right hand column on a text-diff row that contains the actual
 * text associated with the diff.
 * @param diff - The PageCharactersDifference object to parse.
 */
const buildRightColumn = (diff: lt.Document.Compare.PageCharactersDifference) => {
   const column = document.createElement('div');
   column.className = 'right-column';

   const textPreview = document.createElement('p')
   textPreview.className = 'vcenter preview-p';
   // Remove new lines to drop all text onto a single line.
   const sanitizedText = diff.text.replace(/(\r\n|\n|\r)/gm, " ");
   textPreview.innerText = sanitizedText;

   column.appendChild(textPreview);
   return column;
}

const buildRow = (diff: lt.Document.Compare.PageCharactersDifference) => {
   const row = document.createElement('div');
   row.className = 'result-row';
   row.setAttribute('operation', diff.operation.toString());
   row.appendChild(buildLeftColumn(diff));
   row.appendChild(buildRightColumn(diff));

   return row;
}

/**
 * Function to update the Total Changes label located on the diff panel.
 * @param docDiff - The DocumentDifference object to parse
 */
const updateTotalLabel = (docDiff: lt.Document.Compare.DocumentDifference, isRunning: boolean) => {
   const label = document.getElementById(totalChanges);
   label.innerText = `Total Changes: ${(!docDiff || !isRunning) ? 0 : docDiff.getDeletions().length + docDiff.getInsertions().length}`;
}

/**
 * Parses all diffs in a DocumentDifference set in order to build out the diff panel UI.
 * @param docDiff - The DocumentDifference to parse
 * @param app  - The main app context
 */
const onDocumentDiff = (docDiff: lt.Document.Compare.DocumentDifference, app: App, active?: lt.Document.Compare.PageCharactersDifference) => {
   const container = document.getElementById(holder);
   if (!container) return;

   /** Clear all existing diffs */
   container.innerHTML = '';
   updateTotalLabel(docDiff, app.textCompare.isEnabled);
   if (!docDiff || !app.textCompare.isEnabled) return;

   docDiff.resetDeletionCounter();
   docDiff.resetInsertionCounter();
   docDiff.unparsedDifferences.forEach((change) => {
      // We are only interested in changes -- ignore text similarities
      if (change.operation === lt.Document.Compare.DifferenceOperation.equal)
         return;

      let activeDiff = active;
      if (!activeDiff || activeDiff.operation !== change.operation)
         activeDiff = (change.operation === lt.Document.Compare.DifferenceOperation.delete)
            ? app.textCompare.get_selectedDeletion() : app.textCompare.get_selectedInsertion();
      const diff = (change.operation === lt.Document.Compare.DifferenceOperation.delete) ? docDiff.getNextDeletion() : docDiff.getNextInsertion();
      if (diff === null) {
         return;
      }

      const textLength = change.text.replace(/\s/g, "").length;
      if (textLength === 0) {
         return;
      }
      const row = buildRow(diff);
      let scrollToView = false;
      if (JSON.stringify(diff) === JSON.stringify(activeDiff)) {
         row.className += ` ${selectedClass}`;

         if (active && active.operation === change.operation)
            scrollToView = true;
      }

      row.onclick = () => {
         const elems: HTMLElement[] = [].slice.call(document.querySelectorAll('.selected-row'));
         elems.forEach((ele) => {
            if (ele.getAttribute('operation') === change.operation.toString())
               ele.classList.remove(selectedClass)
         });
         row.classList.add(selectedClass);
         (change.operation === lt.Document.Compare.DifferenceOperation.delete) ? app.textCompare.set_selectedDeletion(diff) : app.textCompare.set_selectedInsertion(diff);
         (change.operation === lt.Document.Compare.DifferenceOperation.delete) ? app.invalidateDeleteViewer() : app.invalidateInsertViewer();
      }

      container.appendChild(row);
      if (scrollToView)
         row.scrollIntoView();
   });
}

/**
 * Updates the Compare Trigger button depending on the CompareView state.
 */
const updateViewTrigger = (view: lt.Document.Viewer.CompareView) => {
   const working = view.isEnabled;
   const trigger = document.getElementById('compareTrigger');
   if (working) {
      trigger.classList.remove('start-icon');
      trigger.classList.add('stop-icon');
      trigger.title = 'Stop Compare';
   } else {
      trigger.classList.add('start-icon');
      trigger.classList.remove('stop-icon');
      trigger.title = 'Start Compare';
   }
}

export { onDocumentDiff, updateViewTrigger };