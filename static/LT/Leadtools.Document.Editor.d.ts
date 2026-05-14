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
// Library: Leadtools.Document.Editor.d.ts
// Version:23.0.0.1
declare module lt.Document.Editor {
 interface AbortablePromise<T> extends Promise<T> {
    abort: () => void;
}

/**
 * Bitwise flag describing which header and footer regions should be used
 * for the document.
 */
 enum ActiveMarginalFlag {
    /** Only the Odd header and footer will be used. */
    default = 0,
    /** Odd and Even headers and footers will be used. */
    differentOddAndEven = 1,
    /** A special header and footer will be used for the first paste. */
    differentFirstPage = 2
}

/** Describes the current region in the Document that is active. */
 enum ActiveRegion {
    /** The main body of the document is active. */
    body = 0,
    /** The header for the document is active. */
    header = 1,
    /** The footer for the document is active. */
    footer = 2
}

/**
 * Describes how the content should be aligned.
 */
  enum AlignmentType {
    /** Align content to the left of the available space. */
    left = 0,
    /** Align content to the center of the available space. */
    centered = 1,
    /** Align content to the right-most side of the available space. */
    right = 2,
    /** Justifies the content to fill the entirety of the available space. */
    justified = 3
}

 interface AnchoredOutputImage {
    x: number;
    y: number;
    xActual: number;
    yActual: number;
    width: number;
    height: number;
    id: string;
    url: string;
    flags: number;
    hash: string;
    offset: number;
    link: string;
}

/** Represents a single instance of an attribute. */
 class Attribute {
    /** The type of the attribute.  This is used for casting purposes. */
    
    get type(): AttributeType;
    /** Attribute value.  This is contingent on the attribute type. */
    
    constructor();
    /** Empties an Attribute.  This will set the attribute type to AttributeType.empty */
    clear(): void;
    /** Copies the contents of an attribute into another. */
    copy(dest: Attribute): void;
    clone(): Attribute;
    setValue(type: AttributeType, value: any): void;
    getValue(): any;
    equals(attr: Attribute): boolean;
    toString(): any;
}

 interface AttributeData {
    key: string;
    value: any;
    type: AttributeType;
}

 class Attributes {
    
    constructor();
    clone(): Attributes;
    equals(attrs: Attributes): boolean;
    getAttribute(key: string): Attribute | undefined;
    setAttribute(key: string, attr: Attribute): void;
    deleteAttribute(key: string): void;
    deleteAllAttributes(): void;
    forEach(cb: (key: string, attr: Attribute) => void): void;
    getBlob(key: string): any;
    setBlob(key: string, value: ArrayBuffer): void;
    getBoolean(key: string): any;
    setBoolean(key: string, value: boolean): void;
    getDouble(key: string): any;
    setDouble(key: string, value: number): void;
    getFloat(key: string): any;
    setFloat(key: string, value: number): void;
    getINT32(key: string): any;
    setINT32(key: string, value: number): void;
    getINT64(key: string): any;
    setINT64(key: string, value: number): void;
    getObject(key: string): any;
    setObject(key: string, value: object): void;
    getString(key: string): any;
    setString(key: string, value: string): void;
    getUINT32(key: string): any;
    setUINT32(key: string, value: number): void;
    getUINT64(key: string): any;
    setUINT64(key: string, value: number): void;
    getHelper(key: string, type: AttributeType): any;
    setHelper(key: string, type: AttributeType, value: any): void;
}

 enum AttributeType {
    empty = 0,
    uint32 = 1,
    uint64 = 2,
    int32 = 3,
    int64 = 4,
    float = 5,
    double = 6,
    string = 7,
    blob = 8,
    object = 9,
    boolean = 10
}

/** Interface guard indicating that the object has an Attributes collection. */
 interface Attributor {
    attributes: Attributes;
}

 interface AttrKeyValidator {
    validator: null | any[] | ((value: any) => boolean);
}

/** @public */
 type BindingFunc = (e: StandardKeyboardEvent | null) => void;

 interface BlockContent {
    piece: BlockPiece;
    children: Piece[] | BlockContent[];
    range: EditRange | null;
}

 enum BlockContractType {
    paragraph = 0,
    list = 1,
    table = 2,
    pageBreak = 3,
    horizontalLine = 4
}

/**
 * A block piece represents significant structural component.
 * This would be things such as paragraphs, tables, etc.
 */
 class BlockPiece extends Piece {
    static readonly DEFAULT_NAME: string;
    static defaultLength: number;
    readonly blockType: BlockType;
    constructor(type: BlockType, attrs?: Attributes | null);
}

 enum BlockType {
    /** Used for internal use */
    base = -1,
    paragraph = 0,
    /**
     * Represents a section in a Word Document.
     * Sections are used to define region specific functionality such as page size.
     */
    section = 1,
    table = 2,
    pageBreak = 3,
    horizontalLine = 4
}

 enum BorderRegion {
    /** Border styling should be applied to every border in the selected region. */
    all = 0,
    /** Border styling should only be applied to the inner-borders in the selected region. */
    innerBorder = 1,
    /** Border styling should only be applied to the inner-horizontal borders in the selected region. */
    innerHorizontalBorder = 2,
    /** Border styling should only be applied to the inner-vertical borders in the selected region. */
    innerVerticalBorder = 3,
    /** Border styling should only be applied to the outer borders in the selected region. */
    outerBorder = 4,
    /** Border styling should only be applied to the right border in the selected region. */
    rightBorder = 5,
    /** Border styling should only be applied to the top border in the selected region. */
    topBorder = 6,
    /** Border styling should only be applied to the bottom border in the selected region. */
    bottomBorder = 7,
    /** Border styling should only be applied to the left border in the selected region. */
    leftBorder = 8
}

  enum BorderStyle {
    solid = 0,
    dashed = 1,
    dotted = 2
}

 class Cell {
    readonly surface: EditableContent;
    parent: TableBlock;
    readonly attributes: Attributes;
    column: number;
    row: number;
    colSpan: number;
    rowSpan: number;
    status: CellStatus;
    linkPoint: CellPoint | null;
    refCell: Cell | null;
    constructor(data: CellData_2);
    format(key: string, attribute: Attribute, options?: EngineOptions): void;
    deleteCellContent(options: EngineOptions): void;
}

 interface CellBorder {
    size?: number;
    color?: string;
    style?: BorderStyle;
}

 interface CellCoordinate {
    /** The row in the table where the active cell is located. */
    row: number;
    /** The column in the table where the active cell is located. */
    column: number;
    /** Describes a point in the Cell's content.  This can recursively point to another table. */
    subData: MovementData;
}

 type CellData = {
    backgroundColor?: string;
    /** The color for the top-border. */
    borderTopColor?: string;
    /** The size, in points, for the top-border. */
    borderTopSize?: number;
    /** The style for the top-border. */
    borderTopStyle?: BorderStyle;
    /** The color for the left-border. */
    borderLeftColor?: string;
    /** The size, in points, for the left-border. */
    borderLeftSize?: number;
    /** The style for the left-border. */
    borderLeftStyle?: BorderStyle;
    /** The color for the right-border. */
    borderRightColor?: string;
    /** The size, in points, for the right-border. */
    borderRightSize?: number;
    /** The style for the right-border. */
    borderRightStyle?: BorderStyle;
    /** The color for the bottom-border. */
    borderBottomColor?: string;
    /** The size, in points, for the bottom-border. */
    borderBottomSize?: number;
    /** The style for the bottom-border. */
    borderBottomStyle?: BorderStyle;
    /** The top margin for the cell, in inches. */
    marginTop?: number;
    /** The bottom margin for the cell, in inches. */
    marginBottom?: number;
    /** The left margin for the cell, in inches. */
    marginLeft?: number;
    /** The right margin for the cell, in inches. */
    marginRight?: number;
};

 interface CellData_2 {
    attributes?: Attributes | null;
    engine: EditingEngine;
    parent: TableBlock;
    row: number;
    column: number;
}

 interface CellFormatData {
    /** Styling for the cell's top border. */
    top?: CellBorder;
    /** Styling for the cell's bottom border. */
    bottom?: CellBorder;
    /** Styling for the cell's left border. */
    left?: CellBorder;
    /** Styling for the cell's right border. */
    right?: CellBorder;
    /** The cell's background color */
    color?: string;
}

 interface CellPoint {
    row: number;
    column: number;
}

 enum CellStatus {
    /** Normal cells... are well normal. */
    normal = 0,
    /** Linked cells have been merged into another cell */
    linked = 1
}

/**
 * Represents a chord binding.
 * @remarks
 * A chord binding is a series of [bindings](StandardBinding) that must be executed in a particular order. For instance, the chord `ctrl+a,ctrl+b`
 * will only be executed if keyboard input appears in that order. If a standard binding was also registered for `ctrl+a`, it will **NOT** fire.
 * @public
 */
 class ChordBinding {
    readonly chords: StandardBinding[];
    constructor(chords: StandardBinding[]);
    equals(binding: ChordBinding): boolean;
}

/**
 * @public
 * Interface contract for implementing a cloneable object.
 *
 */
 interface Cloneable<T> {
    clone(ref?: any): T;
}

  enum ColumnLocation {
    left = 0,
    right = 1
}

 interface CommonContract {
    range: EditRange;
}

 enum ContentType {
    text = 0,
    object = 1
}

/**
 * This module is responsible for presenting contextual data about the current state of the Document Editor.
 * This entails returning styling information for Runs,
 */
 class ContextModule extends EditingModule {
    readonly layout: LayoutService;
    readonly search: DocumentSearch;
    get showRuler(): boolean;
    set showRuler(val: boolean);
    get mode(): ViewMode;
    set mode(val: ViewMode);
    get hasTable(): boolean;
    ruler: RulerData;
    
    
    
    get wordCount(): number;
    
    get characterCount(): number;
    /** Retrieves the FontData for the current context. */
    getFontData(): {
        /** Whether the text is bolded. */
        bold?: boolean;
        /** The font color for the text. */
        color?: string;
        /** The background color for the text. */
        highlight?: string;
        /** Whether the text is italicized. */
        italic?: boolean;
        /** The font family for the text. */
        fontFamily?: string;
        /** The strikethrough type for the text. */
        strikethrough?: StrikethroughType;
        /** The ScriptType for the text. */
        script?: ScriptType;
        /** The UnderlineType for the text. */
        underline?: UnderlineType;
        /** The font size used for the text. */
        size?: number;
        /** The hyperlink url for the text. */
        link?: string;
    };
    /** Retrieves the ParagraphData for the current context. */
    getParagraphData(): {
        /** The AlignmentType for the paragraph. */
        alignment?: AlignmentType;
        /** Value, in inches, for a first line or hanging indent. */
        firstLineIndent?: number;
        /** Value, in inches, for the left indent value. */
        leftIndent?: number;
        /** Value, in points, representing the spacing between lines. */
        lineSpacing?: number;
        /** Value, in inches, for the right indent value. */
        rightIndent?: number;
        /** Value, in points, for the spacing after the paragraph. */
        spaceAfter?: number;
        /** Value, in points, for the spacing after the paragraph. */
        spaceBefore?: number;
        /** Tab stops for the paragraph. */
        tabStops?: TabStop[];
    };
    /** Retrieves the ListData for the current context. */
    getListData(): {
        /** The level for the list. */
        level?: number;
        /** The bullet preset type that is used for the list. */
        preset?: ListBulletPresets;
    };
    /** Retrieves the ImageData for the current context. */
    getImageData(): ImageData;
    getTableData(): TableData;
    /** Retrieves the PageData for the current context. */
    getPageData(): {
        /**
         * The Top Margin for the page, in inches.
         */
        marginTop?: number;
        /**
         * The Bottom Margin for the page, in inches.
         */
        marginBottom?: number;
        /**
         * The Left Margin for the page, in inches.
         */
        marginLeft?: number;
        /**
         * The Right Margin for the page, in inches.
         */
        marginRight?: number;
        /**
         * The width of the page, in inches.
         */
        width?: number;
        /**
         * The height of the page, in inches.
         */
        height?: number;
        /**
         * The orientation of the page.
         */
        orientation?: Orientation;
        /**
         * The color of the page.
         */
        color?: string;
        /**
         * Bitwise flag representing the active Marginals.
         */
        activeMarginals?: ActiveMarginalFlag;
        /**
         * Whitespace offset, in inches, from the start of the page where the header's content begins.
         */
        headerWhitespace?: number;
        /**
        * Whitespace offset, in inches, from the start of the page where the header's content begins.
        */
        footerWhitespace?: number;
    };
    /** Retrieves the CellData for the current context. */
    getCellData(): CellData;
    /**
     * Updates the current context with the provided FontData.
     * @param font - The FontData to apply.
     */
    setFontData(font: FontData): void;
    /**
     * Updates the current context with the provided ParagraphData.
     * @param para - The ParagraphData to apply.
     */
    setParagraphData(para: ParagraphData): void;
    /**
     * Updates the current context with the provided ParagraphData.
     * @param para - The ParagraphData to apply.
     */
    setParagraphDataNoTable(para: ParagraphData): void;
    /**
        * Updates the current context paragraph with the provided ParagraphData and FontData.
        * @param para - The ParagraphData to apply.
        * @param font - The FontData to apply.
        */
    setParagraphDataAndFont(para: ParagraphData, font: FontData): void;
    /**
     * Updates the current context paragraph with named style.
     * @param style - The name of the style to apply.
     */
    setParagraphStyle(style: string): void;
    /**
     * Determines the current paragraph style name.
     */
    getParagraphStyle(): string;
    /**
    * Updates the current context paragraph with the provided FontData.
    * @param font - The FontData to apply.
    */
    setParagraphFont(font: FontData): void;
    /**
     * Updates the current context with the provided ListData.
     * @param list - The ListData to apply.
     */
    setListData(list: ListData): void;
    /**
     * Updates the current context with the provided PageData.
     * @param data - The PageData to apply.
     */
    setPageData(data: PageData): void;
    getCurrentPageNumber(): number;
    getCurrentNumberOfPages(): number;
    dispose(): void;
}

/**
 * @public
 * Interface contract for implementing a disposable object.
 */
  interface Disposable {
    dispose(): void;
}

  class DocumentEditor {
    static className: string;
    readonly root: HTMLElement;
    readonly context: ContextModule;
    readonly engine: EngineModule;
    readonly movement: MovementModule;
    readonly keyboard: KeyboardModule;
    readonly print: PrintingModule;
    readonly history: HistoryModule;
    readonly speechRecognition: SpeechRecognitionModule;
    get document(): EditableDocument;
    constructor(options: DocumentEditorIniData);
    addEventListener(event: EditorEvent, cb: (args?: any) => void): void;
    removeEventListener(event: EditorEvent, cb: (args?: any) => void): void;
    setDocument(document: EditableDocument): void;
    
    createTestDocument(): EditableDocument;
    createTestLargeDocument(): EditableDocument;
}

  interface DocumentEditorIniData {
    root: HTMLElement;
}

 class DocumentSearch {
    readonly editor: DocumentEditor;
    
    /** The total number of search results. */
    get totalResults(): number;
    /** 1-Based position of the current active result. */
    get currentPosition(): number;
    /**
     * Clears all data in the `DocumentSearch` module.
     * @param update - **true** to trigger a repaint; otherwise, **false**.
     */
    clear(update?: boolean): void;
    /**
     * Clears the current active result.
     */
    clearActiveSelection(): void;
    /**
     * Sets the current active result relative to the cursor position.
     * For a selection, it will be set relative to the start of the selection.
     */
    setActiveSelectionRelativeToCursor(): void;
    /**
     * Move to the next result.  If no result is currently active, the very first result will be set.
     */
    moveToNext(): void;
    /**
     * Move to the previous result.  If no result is currently active, the very first result will be set.
     */
    moveToPrevious(): void;
    /**
     * Searches this text region for the provided sub-string.
     * @param substr - Sub-string to match.
     * @param matchCase - Whether the casing should be matched.
     */
    search(substr: string, matchCase: boolean): void;
    /**
     * Searches this text region based on the provided `RegExp`.
     * @param expression - The regular expression to match.
     */
    searchRegexp(exp: RegExp): void;
    /**
     * Replaces all results with the provided string.
     * @param toReplace - The string to replace the results with.
     */
    replaceAll(toReplace: string): void;
    resolveSearchResultPoints(result: SearchResult): void;
    /**
     * Replaces the active result with the provided string.
     * @param toReplace - The string to replace the result with.
     */
    replace(toReplace: string): void;
}

 class EditableContent {
    /** The structure of the EditableContent */
    readonly structure: PieceStructure;
    /** Modules for running queries against the EditableContent's structure */
    readonly query: QueryManager;
    /** Represents the region this EditableContent belongs to */
    readonly location: EditRegion;
    /** The engine this EditableContent instance belongs to */
    readonly engine: EditingEngine;
    /** The parent that this EditableContent belongs to */
    readonly parent: any;
    /** Module responsible for storing and manipulating list operations for the EditableContent. */
    readonly list: ListManager;
    constructor(engine: EditingEngine, location: EditRegion, parent: any);
    /**
     * Inserts a text piece into the structure.
     * @param txt - the text to insert
     * @param pos - position to insert the text in the document.
     * @param options - the options to use when executing this command.
     *
     * **Note:** - This function contains an overload for passing a TextPiece.  This is mainly used by the history feature.  Do NOT create TextPieces with arbitrary buffer starts.
     */
    insertText(txt: string | TextPiece, pos: EditPosition, options?: EngineOptions): void;
    /**
     * Inserts a block piece into the structure.
     * @param block - the BlockPiece to insert
     * @param pos - position to insert the block in the document.
     * @param options - the options to use when executing this command.
     */
    insertBlock(block: BlockPiece, pos: EditPosition, options?: EngineOptions): void;
    /**
     * Inserts an ObjectPiece into the structure.
     * @param obj - the ObjectPiece to insert
     * @param pos - position to insert the object in the document.
     * @param options - the options to use when executing this command.
     */
    insertObject(obj: ObjectPiece, pos: EditPosition, options?: EngineOptions): void;
    /**
     * Formats all pieces in an EditRange with the provided attribute data.
     * @param range - The range to format over
     * @param attrData - The attribute data to format with
     * @param options - the options to use when executing this command.
     * @param cb - callback function to modify the new Attribute before it is applied to the piece.
     */
    formatRange(range: EditRange, attrData: AttributeData, options?: EngineOptions, cb?: (piece: Piece, pieceAtt: Attribute | undefined, newAtt: Attribute) => Attribute): void;
    /**
     * Ensure the specified text piece has been split up so only the selected region is a word.
     * Specifically, this method will split the text piece if either of the following is true:
     * - Selection starts after piece starts
     * - Selection ends before piece ends
     * @param pos The document position for the specified piece
     * @param piece The piece to split/update
     * @param range The selection range
     */
    
    /**
     * Format the portion of a piece located at the provided EditPosition in a document.
     * @param pos - The position to format
     * @param attrData - The attribute data to format with
     * @param options - the options to use when executing this command.
     */
    formatAt(pos: EditPosition, attrData: AttributeData, options?: EngineOptions): void;
    /**
     * Deletes a range of pieces from a document.
     *
     * **NOTE** This function will throw an error if deleting the range would result in an invalid document state.
     * @param range - the range to delete over
     * @param options - the options to use when executing this command.
     */
    deleteRange(range: EditRange, options?: EngineOptions): void;
    moveRange(range: EditRange, targetSurface: EditableContent, targetPos: EditPosition, options?: EngineOptions): void;
    /**
     * Deletes the portion of a piece located at the provided EditPosition from a document.
     * @param pos - the position to delete
     * @param options - the options to use when executing this command.
     */
    deleteAt(pos: EditPosition, options?: EngineOptions): void;
    /**
     * Retrieves the string equivalent of a TextPiece
     * @param piece input TextPiece
     */
    getString(piece: TextPiece): string;
    /**
     * Retrieves the sub-string of a TextPiece based off the range
     * @param piece input TextPiece
     * @param range range to retrieve
     */
    getStringFromRange(range: EditRange): string;
    /**
     * Returns all pieces that are located in a given EditRange
     * @param range - The range to search over.
     */
    getRange(range: EditRange): Piece[];
    /**
     * Optimizes the range by joining similar text pieces:
     * - Must be part of the same buffer, and be continuous
     * - Must have same attributes
     * @param range Optional edit range (will check entire document if null)
     */
    optimizeRange(range?: EditRange): void;
    /**
     * Inserts a table into the structure.
     * @param pos - The position in the document to insert the table.
     * @param rows - The number of rows that the table should have.
     * @param columns - The number of columns that the table should have.
     * @param options - the options to use when executing this command.
     */
    insertTable(pos: EditPosition, rows: number, columns: number, options?: EngineOptions): TableBlock;
    /**
     * Deletes a table from the structure.
     * @param table - The table to delete.
     * @param options - the options to use when executing this command.
     */
    deleteTable(table: TableBlock, options?: EngineOptions): void;
    /**
     * Function to determine if a set of StructLocations represent a valid delete.
     * This function will throw exceptions depending on delete context.
     * @param data
     */
    
    
    /**
     * Inserts a piece into the piece structure.
     * @param insertPiece - the Piece to insert
     * @param pos - the position to insert the piece in the document.
     * @param options - the options to use when executing this command.
     */
    insertPiece(insertPiece: Piece, pos: EditPosition, options: EngineOptions): void;
    /**
     * Any pre-insert logic that needs to be run for specific block types.
     * @param block - The block that's about to be inserted into the structure.
     */
    
    
}

  class EditableDocument implements Disposable {
    readonly leadDocument: lt.Document.LEADDocument;
    title: string;
    dispose(): void;
    serialize(): string;
    static new(): EditableDocument;
    convertDocument(documentName: string, options: lt.Document.Writer.EditableDocumentConverterOptions): AbortablePromise<lt.Document.DocumentConvertResult>;
    
    static fromJSON(doc: string): Promise<EditableDocument>;
    
    
    static isValidFilename(fname: any): boolean;
    toFile(outputFile: string, format: lt.Document.Writer.DocumentFormat): AbortablePromise<boolean>;
    static proxyURL(url: any): any;
    static blobToFile(theBlob: Blob, fileName: string): File;
    static getUrlFilename(url: string): string;
    static fromUrl(url: string): AbortablePromise<EditableDocument>;
    static fromFile(inputFile: File | Blob): AbortablePromise<EditableDocument>;
    static fromLEADDocument(doc: lt.Document.LEADDocument): AbortablePromise<EditableDocument>;
    
    
}

 class EditingEngine {
    /** Encapsulates all of the textual information for a document */
    buffer: TextBuffer;
    /** Manages the history for this engine instance */
    readonly history: HistoryManager;
    /** Manages content whitelisting for Pieces */
    readonly pieces: PieceManager;
    /** The main content section of the document */
    readonly main: EditableContent;
    /** Holds marginal content sections of a document */
    readonly marginals: MarginalManager;
    /**
     * Create a new EditingEngine, optionally providing the previous document as a starting point.
     *
     * If no previous document is provided, the EditingEngine will be initialized with an empty paragraph.
     *
     * @param serialized The previously saved/serialized document
     */
    constructor(serialized?: SerializedEngine);
}

 abstract class EditingModule implements Disposable {
    readonly editor: DocumentEditor;
    constructor(editor: DocumentEditor);
    abstract dispose(): any;
}

 enum EditorEvent {
    pagination = "pagination",
    contextChange = "contextChange",
    contextDataChange = "contextDataChange",
    layoutChanged = "layoutChanged",
    layoutDimensionsCalculated = "layoutDimensionsCalculated",
    cursorMoved = "cursorMoved",
    onViewModeChange = "viewModeChanged",
    rulerVisibilityChanged = "rulerVisibilityChanged",
    imageChanged = "imageChanged",
    invokeFind = "invokeFind",
    printStarted = "printStarted",
    printFinished = "printFinished",
    insertHyperlink = "insertHyperlink",
    speechRecognitionStart = "speechRecognitionStart",
    speechRecognitionEnd = "speechRecognitionEnd"
}

/**
 * An EditPosition describes a specific location in a document.  This location is only valid in context with the current state of the document at the time.
 * The maximum range of an EditPosition in an EditableDocument is as follows:
 *
 * 0 < x < size + 1 where...
 * - 0: Describes the beginning of a document.
 * - size + 1: Inserting at the end of a document.
 */
 class EditPosition {
    
    get value(): number;
    set value(x: number);
    constructor(value: number);
    clone(): EditPosition;
    equals(other: EditPosition): boolean;
    isGreaterThan(other: EditPosition): boolean;
    isGreaterOrEqual(other: EditPosition): boolean;
    isLessThan(other: EditPosition): boolean;
    isLessOrEqual(other: EditPosition): boolean;
    /** ++pos (increments, then returns self) */
    incrementPre(): EditPosition;
    /** pos++ (increments, then returns copy with previous value) */
    incrementPost(): EditPosition;
    /** pos += n (increments, then returns self) */
    increment(n?: number | EditPosition): EditPosition;
    /** pos + n (doesn't modify self, returns result) */
    plus(n: number | EditPosition): EditPosition;
    /** --pos (decrements, then returns self) */
    decrementPre(): EditPosition;
    /** pos-- (decrements, then returns copy with previous value) */
    decrementPost(): EditPosition;
    /** pos -= n (decrements, then returns self) */
    decrement(n?: number | EditPosition): EditPosition;
    /** pos - n (doesn't modify self, returns result) */
    minus(n: number | EditPosition): EditPosition;
}

/**
 * An EditRange describes a range of positions in a document. The location is only valid in context with the current state of the document at the time.
 *
 * This is mainly useful for specifying attribute transformations.  I.E. bold all text between the two positions.
 */
 class EditRange {
    readonly start: EditPosition;
    readonly end: EditPosition;
    get length(): number;
    constructor(start: EditPosition, end: EditPosition);
    /**
     * Checks if an EditRange exists in another EditRange
     * @param range - range to search for.
     */
    contains(range: EditRange): boolean;
    clone(): EditRange;
    /** Returns a range object containing a single position */
    static fromPosition(pos: EditPosition): EditRange;
}

 enum EditRegion {
    /** Represents a change to the main body of the document.  */
    main = 0,
    /** Represents a change in a marginal region */
    marginal = 1,
    /** Represents a change to the body of a cell. */
    cell = 2
}

/**
 * The `EngineModule` is responsible for interoping with the EditingEngine to apply operations to the document.
 */
 class EngineModule extends EditingModule {
    readonly tables: TableEngine;
    readonly images: ImageEngine;
    readonly text: TextEngine;
    get canCut(): boolean;
    get canDelete(): boolean;
    get isNormalMovementMode(): boolean;
    get canCopy(): boolean;
    get canPaste(): boolean;
    
    constructor(editor: DocumentEditor);
    dispose(): void;
    
    finalizeCopyToClipboard(e: ClipboardEvent): void;
    finalizePasteFromClipboard(e: ClipboardEvent): Promise<void>;
    finalizeCutToClipboard(e: ClipboardEvent): void;
    copyToClipboardAsync(unformatted: boolean): Promise<void>;
    isAsyncPasteAvailable(): Promise<boolean>;
    cutToClipboardAsync(unformatted: boolean): Promise<void>;
    pasteFromClipboardAsync(unformatted: boolean): Promise<void>;
    
    
    
    cutToClipboardSafari(): void;
    copyToClipboard(unformatted: boolean): void;
    pasteFromClipboard(unformatted: boolean): Promise<void>;
    cutToClipboard(unformatted: boolean): void;
    contextMenuHitTest(e: any): boolean;
    getSpellingSuggestions(): {
        suggestions: string[];
        range: EditRange;
    };
    replaceTextRange(toReplace: string, editRange: EditRange): void;
    insertPageBreak(): void;
    handleAnchoredImageDelete(): void;
    deleteForward(): void;
    deleteBackward(): void;
    /**
     * Creates a new list at the given position.
     *
     * If a list already exists in the current context that matches the provided type, the paragraph will be removed from the list.
     *
     * If a list already exists, and the type provided is different than the current context, the list type will be adjusted.
     * @param type - The `ListType` to set the list to.
     */
    createList(type: ListBulletPresets): void;
    insertHorizontalLine(): void;
    
    handleDeleteAnchoredImageSelection(options?: EngineOptions): {
        point: EditPosition;
        start: MovementData;
        surface: EditableContent;
    };
}

 class EngineOptions implements IEngineOptions {
    trackHistory: boolean;
    existingRecord: HistoryRecord | null;
    ignoreTransient?: boolean;
    constructor(options?: IEngineOptions);
    static getHistoryRecord(options: EngineOptions): HistoryRecord;
    static updateHistory(history: HistoryManager, record: HistoryRecord, options: EngineOptions): void;
}

 interface Font {
    bold: boolean;
    color: string;
    highlight: string;
    italic: boolean;
    fontFamily: string;
    strikethrough: StrikethroughType;
    script: ScriptType;
    underline: UnderlineType;
    size: number;
}

/**
 * Describes the font context for the editor.
 */
 interface FontData {
    /** Whether the text is bolded. */
    bold?: boolean;
    /** The font color for the text. */
    color?: string;
    /** The background color for the text. */
    highlight?: string;
    /** Whether the text is italicized. */
    italic?: boolean;
    /** The font family for the text. */
    fontFamily?: string;
    /** The strikethrough type for the text. */
    strikethrough?: StrikethroughType;
    /** The ScriptType for the text. */
    script?: ScriptType;
    /** The UnderlineType for the text. */
    underline?: UnderlineType;
    /** The font size used for the text. */
    size?: number;
    /** The hyperlink url for the text. */
    link?: string;
}

 class HistoryManager {
    undoStack: HistoryRecord[];
    redoStack: HistoryRecord[];
    
    get lastUndoRecord(): HistoryRecord | null;
    get lastRedoRecord(): HistoryRecord | null;
    constructor(engine: EditingEngine);
    /**
     * Clears all history in the manager.
     */
    clear(): void;
    clearRedo(): void;
    /** Whether an undo operation can be performed. */
    canUndo(): boolean;
    /** Whether a redo operation can be performed. */
    canRedo(): boolean;
    pushUndo(record: HistoryRecord): void;
    popUndo(): HistoryRecord | undefined;
    /**
     * Undoes the last operation that occurred.
     */
    undo(): HistoryRecord;
    /**
     * Redoes the last undo operation that occurred.
     */
    redo(): HistoryRecord;
    
    getContext(record: RecordOperation): EditableContent;
    
    
    
    
    
    
    
    
    
    
    
    
}

 class HistoryModule extends EditingModule {
    get canUndo(): boolean;
    get canRedo(): boolean;
    constructor(editor: DocumentEditor);
    dispose(): void;
    popUndoToRecord(record: HistoryRecord): void;
    popUndo(): void;
    undo(): void;
    redo(): void;
}

/**
 * Holds all information pertaining to a single History entry.
 * History entries can consist of multiple commands, depending on the internal steps
 * that were necessary to perform the operation.
 */
 class HistoryRecord {
    operations: RecordOperation[];
    /** Any additional data that should be stored in the Record.
     *  For instance, for the Editor Control, all records that are created organically should have the cursor information stored as well.
     */
    data: any;
    constructor();
    push(record: RecordOperation): void;
    pushStart(record: RecordOperation): void;
    /**
     * Creates and pushes a new Primitive piece operation onto this record's stack
     * @param pos - the position where the operation occurred
     * @param piece - the piece that was created
     * @param isDelete - **true** if a delete operation; otherwise, **false**.
     */
    pushFromPrimitive(pos: EditPosition, piece: Piece, isDelete: boolean, context: EditableContent): void;
}

 interface IEngineOptions {
    trackHistory: boolean;
    existingRecord: HistoryRecord | null;
    ignoreTransient?: boolean;
}

/**
 * @public
 * Interface describing the structure of a Keyboard event.
 */
 interface IKeyboardEvent {
    readonly target: HTMLElement;
    readonly origEvent: KeyboardEvent;
    readonly ctrl: boolean;
    readonly meta: boolean;
    readonly alt: boolean;
    readonly shift: boolean;
    readonly keyCode: KeyCode;
    preventDefault(): void;
    stopPropagation(): void;
}

 interface ImageContract {
    font: Font;
    imageUrl: string;
    style: ImageStyle;
    flags: number;
    x: number;
    y: number;
    /** Width of an image, in inches. */
    width: number;
    /** Height of an image, in inches. */
    height: number;
    id: string;
    link: string;
}

 interface ImageData {
    /** URL for the image */
    url?: string;
    /** Width of the image, in pixels. */
    width?: number;
    /** Height of the image, in pixels. */
    height?: number;
    /** The style type for the image. */
    style?: ImageStyle;
    /** The page number for the image. */
    page?: number;
    region?: ActiveRegion;
    /** The ID for the embedded image */
    id?: string;
    flags?: number;
    /** Left offset from the edge of the page, in pixels. */
    x?: number;
    /** Top offset from the edge of the page, in pixels. */
    y?: number;
    /** Left offset from the flag origin, in pixels. */
    xActual?: number;
    /** Top offset from the flag origin, in pixels. */
    yActual?: number;
    link?: string;
}

 class ImageEngine {
    readonly engine: EngineModule;
    readonly editor: DocumentEditor;
    /**
    * Validates the image mime type.
    * @param type - The mime type of the image
    */
    validImageType(type: string): boolean;
    convertImage(url: string): Promise<string>;
    /**
     * Inserts a new Image into the Editor.
     * @param url - The URL to the image resource.
     */
    insertImage(url: string): Promise<void>;
    
    /**
     * Inserts a new Image into the Editor.
     * @param blob - Blob corresponding to the image resource.
     */
    insertImageBlob(blob: Blob | File): Promise<void>;
    /**
     * Updates the style of the selected image.
     * @param newStyle - The new style that should be applied to the image.
     */
    updateImageStyle(newStyle: ImageStyle): void;
}

 class ImagePiece extends ObjectPiece {
    constructor(attrs?: Attributes | null);
}

  enum ImageStyle {
    inline = 0,
    breakText = 1,
    wrapText = 2
}

 class InternalImage implements ObjectLineContent {
    readonly type: any;
    readonly objectType: any;
    readonly range: EditRange;
    readonly root: HTMLElement;
    readonly imageUrl: string;
    readonly style: ImageStyle;
    readonly flags: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly id: string;
    readonly font: Font;
    absOffset: number;
    readonly link: string;
    clone(): InternalImage;
    constructor(image: ImageContract, range: EditRange);
}

 interface InternalLineContent {
    type: ContentType;
    range: EditRange;
    height: number;
    width: number;
    absOffset: number;
    clone(): any;
}

 class KeyboardModule extends EditingModule {
    keyMap: any;
    shortcutDescription: any;
    userKeyMap: Map<string, any>;
    get enabled(): boolean;
    set enabled(value: boolean);
    
    get copyEnabled(): boolean;
    set copyEnabled(value: boolean);
    dispose(): void;
    registerShortCut(name: string, shortcut: string, description: string, callback: BindingFunc): void;
    unregisterShortCut(name: string): void;
    getShortCut(name: string): string;
    getShortCutDescription(name: string): string;
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}

/** @public Virtual representation of key codes.  This should help with cross browser/platform compatibility */
 enum KeyCode {
    unknown = 0,
    backspace = 1,
    tab = 2,
    enter = 3,
    shift = 4,
    ctrl = 5,
    alt = 6,
    pause = 7,
    capsLock = 8,
    escape = 9,
    space = 10,
    pageUp = 11,
    pageDown = 12,
    end = 13,
    home = 14,
    leftArrow = 15,
    upArrow = 16,
    rightArrow = 17,
    downArrow = 18,
    insert = 19,
    delete = 20,
    meta = 21,
    contextMenu = 22,
    numLock = 23,
    scrollLock = 24,
    key_A = 25,
    key_B = 26,
    key_C = 27,
    key_D = 28,
    key_E = 29,
    key_F = 30,
    key_G = 31,
    key_H = 32,
    key_I = 33,
    key_J = 34,
    key_K = 35,
    key_L = 36,
    key_M = 37,
    key_N = 38,
    key_O = 39,
    key_P = 40,
    key_Q = 41,
    key_R = 42,
    key_S = 43,
    key_T = 44,
    key_U = 45,
    key_V = 46,
    key_W = 47,
    key_X = 48,
    key_Y = 49,
    key_Z = 50,
    key_1 = 51,
    key_2 = 52,
    key_3 = 53,
    key_4 = 54,
    key_5 = 55,
    key_6 = 56,
    key_7 = 57,
    key_8 = 58,
    key_9 = 59,
    key_0 = 60,
    /**
     * US keyboard: '\;\:'
     * Other Countries: Varies by keyboard type.
     */
    semicolon = 61,
    /**
     * US keyboard: '\=\+'
     * Other Countries: '\+' key
     */
    equal = 62,
    /**
     * US keyboard: '\,\<'
     * Other Countries: '\,' key
     */
    comma = 63,
    /**
     * US keyboard: '-_'
     * Other Countries: '-' key
     */
    minus = 64,
    /**
     * US keyboard: '\.\>'
     * Other Countries: '\.' key
     */
    dot = 65,
    /**
     * US keyboard: '\/\?'
     * Other Countries: Varies by keyboard type.
     */
    slash = 66,
    /**
     * US keyboard: '\`\~'
     * Other Countries: Varies by keyboard type.
     */
    backtick = 67,
    /**
     * US keyboard: '\[\{'
     * Other Countries: Varies by keyboard type.
     */
    open_bracket = 68,
    /**
     * US keyboard: '\]\}'
     * Other Countries: Varies by keyboard type.
     */
    closed_bracket = 69,
    /**
     * US keyboard: '\\\|'
     * Other Countries: Varies by keyboard type.
     */
    backslash = 70,
    /**
     * US keyboard: `\'\"`
     * Other Countries: Varies by keyboard type.
     */
    quote = 71,
    f1 = 72,
    f2 = 73,
    f3 = 74,
    f4 = 75,
    f5 = 76,
    f6 = 77,
    f7 = 78,
    f8 = 79,
    f9 = 80,
    f10 = 81,
    f11 = 82,
    f12 = 83,
    numpad_0 = 84,
    numpad_1 = 85,
    numpad_2 = 86,
    numpad_3 = 87,
    numpad_4 = 88,
    numpad_5 = 89,
    numpad_6 = 90,
    numpad_7 = 91,
    numpad_8 = 92,
    numpad_9 = 93,
    numpad_multiply = 94,
    numpad_add = 95,
    numpad_separator = 96,
    numpad_subtract = 97,
    numpad_decimal = 98,
    numpad_divide = 99,
    INPUT_PROCESSING = 229,
    /**
     * Placeholder for the max value
     */
    MAX_VALUE = 230
}

 class LayoutService {
    readonly context: ContextModule;
    get scale(): number;
    /**
     * Zooms in on the Editor control.
     * @param scale - The new scale-factor to apply.  This must be a number between .3  and 3.
     */
    zoom(scale: number): void;
}

 class List implements Attributor {
    readonly id: string;
    readonly levels: ListLevel[];
    readonly refs: ParagraphBlock[];
    readonly manager: ListManager;
    attributes: Attributes;
    constructor(manager: ListManager, data?: ListData_2);
    /**
     * Applies an attribute to the list.  This method is tracked with the overall history of the engine.
     * Directly adding an attribute to the 'attributes' collection will NOT be tracked.
     * @param manager - The ListManager that this instance belongs to.
     * @param key - The key associated with the attribute.
     * @param attribute - The attribute to apply.
     */
    applyAttribute(key: string, attribute: Attribute, options?: EngineOptions): void;
    toData(): ListData_2;
    
}

  enum ListBulletPresets {
    NumberedDefault = 0,
    NumberedParenthesis = 1,
    NumberedDotSections = 2,
    NumberedCapitalized = 3,
    NumberedRoman = 4,
    NumberedZeroPrefix = 5,
    UnorderedDefault = 6,
    UnorderedPoints = 7,
    UnorderedSquare = 8,
    UnorderedArrow = 9,
    UnorderedStar = 10,
    UnorderedPointer = 11
}

/**
 * Describes the list context for the editor.
 */
 type ListData = {
    /** The level for the list. */
    level?: number;
    /** The bullet preset type that is used for the list. */
    preset?: ListBulletPresets;
};

 interface ListData_2 {
    id: string;
    levels: ListLevelRecordData[];
}

 class ListLevel implements Attributor {
    readonly level: number;
    readonly attributes: Attributes;
    readonly list: List;
    /**
    * Applies an attribute to the list.  This method is tracked with the overall history of the engine.
    * Directly adding an attribute to the 'attributes' collection will NOT be tracked.
    * @param manager - The ListManager that this instance belongs to.
    * @param key - The key associated with the attribute.
    * @param attribute - The attribute to apply.
    */
    applyAttribute(key: string, attribute: Attribute, options?: EngineOptions): void;
}

 interface ListLevelRecordData {
    attributes: Attributes;
    level: number;
}

 class ListManager {
    readonly context: EditableContent;
    readonly lists: List[];
    readonly blocks: Map<ParagraphBlock, List>;
    /**
     * Registers a new list in the ListManager.
     * @param block - The block to register the list to.
     * @param trackHistory - Whether the history for this operation should be tracked.
     * @param list - Optional existing list. This is internally used by the History module.
     */
    createList(block: ParagraphBlock, options?: EngineOptions, list?: List): List;
    cloneList(block: ParagraphBlock, options: EngineOptions | undefined, list: List): List;
    /**
     * Adds a paragraph to an existing list.
     * @param block - The paragraph to add.
     * @param list - The list to add the paragraph to.
     * @param trackHistory - Whether the history for this operation should be tracked.
     */
    addToList(block: ParagraphBlock, list: List, options?: EngineOptions): void;
    /**
     * Removes a paragraph from a list.  If the list is empty after the paragraph is removed, then the list is removed from the manager.
     * @param block - The paragraph to remove.
     * @param list - The list that the paragraph belongs to.
     * @param trackHistory - Whether the history for this operation should be tracked.
     * @param existingRecord - An options HistoryRecord to use for this operation.
     */
    removeFromList(block: ParagraphBlock, list: List, options?: EngineOptions): void;
    /**
     * Checks whether a ParagraphBlock belongs to a list.
     * @param block - The paragraph block to check.
     */
    hasList(block: ParagraphBlock): boolean;
    /**
     * Retrieves the list associated with a ParagraphBlock.  If the Paragraph is not associated with any lists, will return null
     * @param block - The paragraph block to check.
     */
    getList(block: ParagraphBlock): List | null;
    /**
     * Get the List that is registered in the manager under the provided ID.  Will return null if no list is found.
     * @param id - The list ID to search for.
     */
    getRegisteredList(id: string): List | null;
}

/**
 * Represents an editable portion of content that is situated in the margin, such as Headers and Footers
 */
 class Marginal {
    /** The type of the Marginal instance */
    readonly type: MarginalType;
    /** The position of the Marginal instance */
    readonly position: MarginalPosition;
    /** The editable region of the Marginal */
    readonly content: EditableContent;
    /** The EditingEngine instance associated with this Marginal */
    readonly engine: EditingEngine;
    /** Any additional data that is provided to the Marginal.  This is useful for implementing custom Marginal objects. */
    data: any;
    constructor(options: MarginalOptions);
}

/**
 * This class is responsible for handling Marginal information for the current engine context.
 */
 class MarginalManager {
    
    readonly engine: EditingEngine;
    constructor(engine: EditingEngine);
    /**
     * Initializes a new Marginals collection
     * @param guid - The ID to initialize the Marginals collection under.
     */
    newEntry(guid: string, fromImport?: boolean): Marginals;
    /**
     * Creates a new Marginals collection from an existing data set.
     * This method is primarily used on import.
     * @param guid -- The ID to associate with the collection
     * @param data -- The Marginal data for the collection.
     */
    fromExisting(guid: string, data: Marginal[]): Marginals;
    /**
     * Retrieves the marginal collection associated with the provided ID.
     * @param id -- The ID to look for
     */
    get(id: string): Marginals | undefined;
    /**
     * Deletes a Marginals collection from the manager.
     * @param guid - The ID for the collection to delete
     * @remarks -- This method can corrupt the state of the engine's History module.  This method should only be used
     * as a cleanup operation.  When the state of the engine is finalized (we are ing/re-balancing the table),
     * then this method should be called to remove unnecessary collections.
     */
    deleteEntry(guid: string): void;
    getMarginals(): Marginals[];
    
}

 interface MarginalOptions {
    engine: EditingEngine;
    type: MarginalType;
    position: MarginalPosition;
    fromSerialized: boolean;
    data?: any;
}

 enum MarginalPosition {
    /** This marginal should only be used on odd pages */
    odd = 0,
    /** This marginal should only be used on even pages */
    even = 1,
    /** This marginal should only be used on the first page */
    firstPage = 2,
    /** This is a custom marginal, position interpretation is up to the user */
    custom = 3
}

/** Class holds all marginal objects pertaining to the document */
 class Marginals {
    
    
    /**
     * Retrieves all header objects in the Marginal collection.
     * Modifying this collection will not affect the internal structure of the Marginals.
     */
    get headers(): Marginal[];
    
    /**
     * Retrieves all footer objects in the Marginal collection.
     * Modifying this collection will not affect the internal structure of the Marginals.
     */
    get footers(): Marginal[];
    /**
     * A collection of custom Marginal Objects.
     * Management of this collection is left entirely up to the user.
     */
    readonly custom: Marginal[];
    readonly id: string;
    /**
     * Retrieves the header marginal that corresponds to the MarginalPosition
     * @param pos - The MarginalPosition to retrieve
     */
    getHeader(pos: MarginalPosition): Marginal | null;
    /**
     * Retrieves the footer marginal that corresponds to the MarginalPosition
     * @param pos - The MarginalPosition to retrieve
     */
    getFooter(pos: MarginalPosition): Marginal | null;
    
    /**
     * Populates this structure with Marginal Objects.
     * The headers and footers collection will be populated with one of every MarginalType besides custom.
     * Headers and footers will have their content set based off the data provided.
     *
     * @param data - Marginal data to use when populating the various Marginal structures.
     * @remarks Custom marginal objects that are passed alongside the MarginalData will be created and populated into a custom marginal collection.
     */
    
    
    
}

 enum MarginalType {
    /** This marginal is a header */
    header = 0,
    /** This marginal is a footer */
    footer = 1,
    /** This marginal is custom, it's interpretation is up to the user */
    custom = 2
}

/** Describes a point in the document.  This can be used to describe the cursor location, or the  */
 interface MovementData {
    /** The PageNumber for the point. */
    page: number;
    /** The structure on the page where the point is. */
    structureIndex: number;
    /** The current line in the structure where the point is. */
    lineIndex: number;
    /** The line-content where the point is. */
    contentIndex: number;
    /** The offset into the line-content where the point is. */
    offset: number;
    /** Describes a point within a table.   */
    cell?: CellCoordinate;
}

 class MovementModule extends EditingModule {
    get region(): ActiveRegion;
    
    
    get isSelecting(): boolean;
    deselect(): void;
    dispose(): void;
    ensureCursorVisible(force?: boolean): void;
    /**
     * Moves the cursor to the left based on the current document context.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveLeft(selmode?: SelectionMode, silent?: boolean): void;
    /**
     * Selects to the left based on the current document context.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectLeft(silent?: boolean): void;
    /**
     * Moves the cursor to the right based on the current document context.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveRight(selmode?: SelectionMode, silent?: boolean): void;
    /**
     * Selects to the right based on the current document context.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectRight(silent?: boolean): void;
    /**
     * Moves the cursor to the start of the current line.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToStartOfLine(silent?: boolean): void;
    /**
     * Selects to the start of the current line.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectToStartOfLine(silent?: boolean): void;
    selectToNextPage(silent?: boolean): void;
    selectToPreviousPage(silent?: boolean): void;
    /**
        * Moves the cursor to the start of the current line.
        * @param silent - Whether the context for the editor should be updated.
        */
    moveToEndOfLine(silent?: boolean): void;
    /**
     * Selects to the start of the current line.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectToEndOfLine(silent?: boolean): void;
    /**
     * Moves the cursor to the start of the region.
     * For the main body, this will be the very first structure on the first page.  For Headers/Footers, this will be the very first structure in the header/footer.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToStartOfRegion(silent?: boolean): void;
    /**
     * Selects to the start of the region
     * @param silent - Whether the context for the editor should be updated.
     */
    selectToStartOfRegion(silent?: boolean): void;
    /**
     * Moves the cursor to the end of the document.
     * For the main body, this will be the very last structure on the last page.  For Headers/Footers, this will be the very last structure in the header/footer.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToEndOfRegion(silent?: boolean): void;
    /**
     * Selects to the end of the region
     * @param silent - Whether the context for the editor should be updated.
     */
    selectToEndOfRegion(silent?: boolean): void;
    /**
     * Moves the cursor to the previous structure of the document.  If no other structure exists, the cursor will move to the beginning of the current structure.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToPreviousStructure(selmode?: SelectionMode, silent?: boolean): void;
    /**
     * Selects to the previous structure of the document.  If no other structure exists, the cursor will move to the beginning of the current structure.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectToPreviousStructure(silent?: boolean): void;
    /**
     * Moves the cursor to the next structure in the document.  If no other structure exists, the cursor will move to the end of the current structure.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToNextStructure(selmode?: SelectionMode, silent?: boolean): void;
    /**
     * Selects to the next structure in the document.  If no other structure exists, the cursor will move to the end of the current structure.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectToNextStructure(silent?: boolean): void;
    /**
     * Moves the cursor vertically to the preceding line.  Cursor positioning is calculated based off of the x-position of the cursor when `moveUp`/`moveDown` was first invoked.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveUp(selmode?: SelectionMode, silent?: boolean): void;
    /**
     * Selects vertically to the preceding line.  Cursor positioning is calculated based off of the x-position of the cursor when `moveUp`/`moveDown` was first invoked.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectUp(silent?: boolean): void;
    /**
     * Moves the cursor vertically to the next line.  Cursor positioning is calculated based off of the x-position of the cursor when `moveUp`/`moveDown` was first invoked.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveDown(selmode?: SelectionMode, silent?: boolean): void;
    /**
     * Selects vertically to the next line.  Cursor positioning is calculated based off of the x-position of the cursor when `moveUp`/`moveDown` was first invoked.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectDown(silent?: boolean): void;
    /**
     * Moves the cursor to the next word.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToNextWord(selmode?: SelectionMode, silent?: boolean, allowTable?: boolean): void;
    /**
     * Selects to the next word.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectToNextWord(silent?: boolean, allowTable?: boolean): void;
    deleteToNextWord(silent?: boolean): void;
    /**
     * Moves the cursor to the previous word.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToPreviousWord(selmode?: SelectionMode, silent?: boolean, allowTable?: boolean): void;
    selectWordAtPosition(data: MovementData, silent: boolean): void;
    /**
     * Selects the previous word.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectToPreviousWord(silent?: boolean, allowTable?: boolean): void;
    deleteToPreviousWord(silent?: boolean): void;
    /**
     * Selects the entire region.
     * @param silent - Whether the context for the editor should be updated.
     */
    selectAll(silent?: boolean): void;
    /**
     * Moves the cursor to the next page.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToNextPage(silent?: boolean): void;
    /**
     * Moves the cursor to the previous page.
     * @param silent - Whether the context for the editor should be updated.
     */
    moveToPreviousPage(silent?: boolean): void;
    getInlineImage(): OutputImage;
    selectInlineImage(point?: MovementData): void;
    getOutputTableSelectionRect(table: OutputTable, r1: number, c1: number, r2: number, c2: number): {
        r1: number;
        c1: number;
        r2: number;
        c2: number;
    };
    getTableSelectionRect(table: TableBlock, r1: number, c1: number, r2: number, c2: number): {
        r1: number;
        c1: number;
        r2: number;
        c2: number;
    };
}

 enum ObjectContractType {
    tabs = 0,
    image = 1
}

 interface ObjectLineContent extends InternalLineContent {
    objectType: ObjectContractType;
    width: number;
}

 class ObjectPiece extends Piece {
    static readonly DEFAULT_NAME: string;
    readonly objectType: ObjectType;
    static defaultLength: number;
    constructor(type: ObjectType, attrs?: Attributes | null);
    clone(): ObjectPiece;
}

/**
 * An ObjectPiece represents an external resource that is present in the document.
 * This could be an Image, a GIF, a Video and so on.
 *
 * This could also potentially be a resource that is loaded externally -- I.E., embedding a tweet into a document.
 *
 * We will always treat ObjectPieces as childless objects -- they will always have a length of 1.
 */
 enum ObjectType {
    /** Used for internal use */
    base = -1,
    tab = 0,
    image = 1,
    video = 2
}

/**
 * Describes the orientation of the document.
 */
 enum Orientation {
    /** Portrait orientation */
    portrait = 0,
    /** Landscape orientation */
    landscape = 1
}

 interface OutputCell {
    /** Margin values for the cell. */
    readonly margin: {
        /** Top margin for the cell, in inches. */
        readonly top: number;
        /** Bottom margin for the cell, in inches. */
        readonly bottom: number;
        /** Left margin for the cell, in inches. */
        readonly left: number;
        /** Right margin for the cell, in inches. */
        readonly right: number;
    };
    readonly border: {
        readonly top: {
            style: BorderStyle;
            color: string;
            size: number;
            sizePoints: number;
        };
        readonly left: {
            style: BorderStyle;
            color: string;
            size: number;
            sizePoints: number;
        };
        readonly right: {
            style: BorderStyle;
            color: string;
            size: number;
            sizePoints: number;
        };
        readonly bottom: {
            style: BorderStyle;
            color: string;
            size: number;
            sizePoints: number;
        };
    };
    readonly row: number;
    readonly column: number;
    readonly backgroundColor: string;
    /** The width of the cell, in pixels. */
    width: number;
    readonly originalWidth: number;
    /** The height of the cell, in pixels. */
    readonly height: number;
    readonly syntheticHeight: number;
    readonly organicHeight: number;
    readonly colSpan: number;
    readonly rowSpan: number;
    readonly status: CellStatus;
    readonly linkPoint: CellPoint | null;
    readonly structs: OutputStructure[];
    readonly anchoredImages: AnchoredOutputImage[];
}

 class OutputImage implements OutputObjectContent {
    readonly type: ContentType;
    readonly objectType: ObjectContractType;
    
    get range(): EditRange;
    readonly font: Font;
    readonly line: OutputLine;
    readonly imageUrl: string;
    readonly style: ImageStyle;
    readonly flags: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly id: string;
    readonly absOffset: number;
    readonly link: string;
    toInternal(): InternalImage;
    clone(line: OutputLine): OutputImage;
}

 class OutputLine implements Cloneable<OutputLine> {
    
    get range(): EditRange;
    readonly para: OutputParagraph;
    readonly size: Rect;
    readonly lineSpacing: number;
    readonly alignment: AlignmentType;
    readonly maxWidth: number;
    paddingBottom: number;
    paddingTop: number;
    readonly leftShift: number;
    readonly rightShift: number;
    readonly fromNewLine: boolean;
    readonly emptyLine: boolean;
    readonly content: OutputLineContent[];
    readonly absolutelyAdjusted: boolean;
    readonly contentSize: Rect;
    get height(): number;
    get contentHeight(): number;
    clone(para: OutputParagraph): OutputLine;
    
    
    
    
}

 interface OutputLineContent extends Cloneable<OutputLineContent> {
    type: ContentType;
    range: EditRange;
    line: OutputLine;
    font: Font;
    width: number;
    absOffset: number;
}

 interface OutputObjectContent extends OutputLineContent {
    objectType: ObjectContractType;
    width: number;
    toInternal: () => InternalLineContent;
}

 class OutputParagraph implements Cloneable<OutputParagraph> {
    /** Describes the raw attributes used to construct this OutputParagraph instance. */
    readonly attributes: {
        /** How the text in the paragraph should be aligned. */
        readonly alignment: AlignmentType;
        /** The spacing between lines in the paragraph. */
        readonly lineSpacing: number;
        /** The amount of space that the first line in the paragraph should be indented, in points. */
        firstLineIndent: number;
        /** The amount of space that the paragraph should be indented from the right, in points. */
        readonly rightIndent: number;
        /** The amount of space that the paragraph should be indented from the left, in points. */
        readonly leftIndent: number;
        /** The amount of space that should appear after the paragraph, in points. */
        readonly spaceAfter: number;
        /** The amount of space that should appear before the paragraph, in points. */
        readonly spaceBefore: number;
        readonly font: Font;
    };
    readonly width: number;
    readonly fromPageBreak: boolean;
    readonly height: number;
    readonly marginLeft: number;
    readonly marginRight: number;
    readonly spaceAfter: number;
    readonly spaceBefore: number;
    readonly range: EditRange;
    readonly lines: OutputLine[];
    readonly contract: ParagraphContract;
    readonly tabStops: TabStop[];
    text: string | null;
    searchCase: boolean;
    searchRegEx: boolean;
    searchString: string;
    searchResult: EditRange[] | null;
    compressedSearchResult: EditRange[] | null;
    /** The total number of characters in the paragraph, including whitespace. */
    readonly characterCount: number;
    /** The total number of words in the paragraph. */
    readonly wordCount: number;
    clone(): OutputParagraph;
    
    
    
    
    
    search(substr: string, matchCase?: boolean): OutputParagraphSearchResult;
    searchRegexp(expression: RegExp): OutputParagraphSearchResult;
}

 interface OutputParagraphSearchResult {
    result: EditRange[];
    compressed: EditRange[];
}

 class OutputRow {
    readonly index: number;
    readonly cells: OutputCell[];
    readonly origin: OutputRowHeightOrigin;
    readonly syntheticHeight: number;
    readonly organicHeight: number;
    height: number;
}

 enum OutputRowHeightOrigin {
    /**
     * The height value in the OutputRow is the maximum height of a cell who's content size was calculated from the summation of all structures.
     *
     * Organic rows should have their content broken line-by-line when paginated.
     */
    organic = 0,
    /**
     * The height value in the OutputRow was calculated from the maximum height set in a cell's height attribute.
     *
     * Since this is an artificial height, not indicative of the actual size of the content, we will treat the whole row as one entity
     * when paginating.  Meaning the whole row must be able to fit on the page.
     */
    synthetic = 1
}

 interface OutputStructure {
    type: BlockContractType;
    hash: string;
    content: Cloneable<any>;
}

 class OutputTable implements Cloneable<OutputTable> {
    readonly rows: OutputRow[];
    
    get vAlignerData(): VerticalAlignerData[];
    readonly alignment: TableAlignment;
    readonly leftIndent: number;
    /** Total height of the table, in pixels. */
    readonly height: number;
    readonly width: number;
    readonly xOffset: number;
    readonly range: EditRange;
    readonly id: string;
    clone(): OutputTable;
}

 type PageData = {
    /**
     * The Top Margin for the page, in inches.
     */
    marginTop?: number;
    /**
     * The Bottom Margin for the page, in inches.
     */
    marginBottom?: number;
    /**
     * The Left Margin for the page, in inches.
     */
    marginLeft?: number;
    /**
     * The Right Margin for the page, in inches.
     */
    marginRight?: number;
    /**
     * The width of the page, in inches.
     */
    width?: number;
    /**
     * The height of the page, in inches.
     */
    height?: number;
    /**
     * The orientation of the page.
     */
    orientation?: Orientation;
    /**
     * The color of the page.
     */
    color?: string;
    /**
     * Bitwise flag representing the active Marginals.
     */
    activeMarginals?: ActiveMarginalFlag;
    /**
     * Whitespace offset, in inches, from the start of the page where the header's content begins.
     */
    headerWhitespace?: number;
    /**
    * Whitespace offset, in inches, from the start of the page where the header's content begins.
    */
    footerWhitespace?: number;
};

 class ParagraphBlock extends BlockPiece {
    constructor(attrs?: Attributes | null);
}

 interface ParagraphContentContract {
    type: ContentType;
    contract: any;
}

 interface ParagraphContract extends CommonContract {
    font: Font;
    /** How the text in the paragraph should be aligned */
    alignment: AlignmentType;
    /** The spacing between lines in the paragraph */
    lineSpacing: number;
    /** The amount of space that the first line in the paragraph should be indented, in points */
    firstLineIndent: number;
    /** The amount of space that the paragraph should be indented from the right, in points */
    rightIndent: number;
    /** The amount of space that the paragraph should be indented from the left, in points */
    leftIndent: number;
    /** The amount of space that should appear after the paragraph, in points. */
    spaceAfter: number;
    /** The amount of space that should appear before the paragraph in points. */
    spaceBefore: number;
    /** Sub-elements bound to the paragraph. */
    content: ParagraphContentContract[];
    /** Tab alignment markers */
    tabStops: TabStop[];
    anchoredImages: ImagePiece[];
}

/**
 * Describes the paragraph context for the editor.
 */
 type ParagraphData = {
    /** The AlignmentType for the paragraph. */
    alignment?: AlignmentType;
    /** Value, in inches, for a first line or hanging indent. */
    firstLineIndent?: number;
    /** Value, in inches, for the left indent value. */
    leftIndent?: number;
    /** Value, in points, representing the spacing between lines. */
    lineSpacing?: number;
    /** Value, in inches, for the right indent value. */
    rightIndent?: number;
    /** Value, in points, for the spacing after the paragraph. */
    spaceAfter?: number;
    /** Value, in points, for the spacing after the paragraph. */
    spaceBefore?: number;
    /** Tab stops for the paragraph. */
    tabStops?: TabStop[];
};

/**
 * The base class of all Piece objects.
 */
 class Piece implements Attributor {
    static readonly DEFAULT_NAME: string;
    type: PieceType;
    
    get length(): number;
    set length(newLength: number);
    name: string;
    node: TreeNode | null | undefined;
    attributes: Attributes;
    constructor(type: PieceType, length: number, name: string);
}

 class PieceManager {
    
    
    constructor();
    /**
     * Creates an empty key list for the specified piece
     * @param piece The piece to register
     */
    registerPiece(piece: Piece): void;
    /**
     * Deletes the key list for the specified piece
     * @param piece The piece to unregister
     */
    unregisterPiece(piece: Piece): void;
    /**
     * Clears all key lists for previously registered pieces
     */
    clearAllRegisteredPieces(): void;
    /**
     * Registers the specified key to use the specified validator
     * @param key The key to register
     * @param validator The validator object. Note: To pass a null validator, you'll need to pass `{ validator: null }` instead
     */
    registerKey(key: string, validator: AttrKeyValidator): void;
    /**
     * Removes the specified key (and its validator)
     * @param key The key to unregister
     */
    unregisterKey(key: string): void;
    /**
     * Remove all previously registered keys (and their validators)
     */
    clearAllRegisteredKeys(): void;
    /**
     * Enables the use of the specified key on the specified piece
     * @param piece The piece to update
     * @param key The key to enable
     */
    enableKey(piece: Piece, key: string): void;
    /**
     * Disables the use of the specified key on the specified piece
     * @param piece The piece to update
     * @param key The key to disable
     */
    disableKey(piece: Piece, key: string): void;
    /**
     * Disables the use of any key on the specified piece
     * @param piece The piece to update
     */
    clearAllEnabledKeys(piece: Piece): void;
    /**
     * Returns true if the specified piece supports the specified key; otherwise, false
     * @param piece The piece to check
     * @param key The key to check
     */
    supportsKey(piece: Piece, key: string): boolean;
    /**
     * Returns true if one of the following conditions are met:
     * - The key's validator is null
     * - The key's validator is an array, and the value is within the array
     * - The key's validator is a function, and fn(value) returns true (and doesn't throw an exception)
     * @param key The key to check
     * @param value The value to check
     */
    canUseValue(key: string, value: any): boolean;
    /**
     * Gets the name from the specified piece, or throws an error if the piece is null
     */
    
    /**
     * Throws an error if the piece was not previously registered
     */
    
    /**
     * Get the key set associated with the specified piece
     */
    
}

 class PieceStructure {
    
    
    
    constructor();
    get rootNode(): TreeNode | null | undefined;
    set rootNode(value: TreeNode | null | undefined);
    /**
     * Get the first piece in the structure (by document order)
     */
    firstPiece(): Piece;
    /**
     * Get the last piece in the structure (by document order)
     */
    lastPiece(): Piece;
    /**
     * Get the current size of the structure
     * @returns A number representing the size of the structure.
     */
    get documentSize(): number;
    /**
     * Get the number of pieces within the structure
     */
    get length(): number;
    /**
     * Determines whether the structure is empty or not.
     * @returns True if the structure is empty; otherwise, false.
     */
    get isEmpty(): boolean;
    /**
     * Get the next (document order) piece in the structure
     * @param piece The current piece
     */
    nextPiece(piece: Piece): Piece;
    /**
     * Get the previous (document order) piece in the structure
     * @param piece The current piece
     */
    previousPiece(piece: Piece): Piece;
    /**
     * Get the piece which contains the specified position
     * @param editPos The document position
     * @returns An object containing the node and the piece's position in the document
     */
    findPiece(editPos: EditPosition): StructLocation;
    /**
     * Get the pieces which intersect the specified range
     * @param editRange The document range
     * @returns An array of objects containing each node and their piece's position in the document
     */
    findPieces(editRange: EditRange): StructLocation[];
    /**
     * Get the position within the document for the target piece
     * @param piece The target piece
     */
    getPosition(piece: Piece): EditPosition;
    /**
     * Appends the specified piece to the end of the document
     * Note: This is equivalent to insertPiece(lastPiece(), piece, true);
     * @param piece The piece to append
     */
    appendPiece(piece: Piece): void;
    /**
     * Appends the specified piece to the beginning of the document
     * Note: This is equivalent to insertPiece(firstPiece(), piece, false);
     * @param piece The piece to append
     */
    prependPiece(piece: Piece): void;
    /**
     * Inserts a piece before/after the given neighbor
     * @param neighbor Piece within the structure for insertion (can only be null if there are no pieces within the structure)
     * @param piece The piece to insert
     * @param after As expected, pass true to insert after neighbor, false to insert before
     */
    insertPiece(neighbor: Piece | null, piece: Piece, after: boolean): void;
    /**
     * Removes the specified piece from the structure
     * @param piece The piece to remove
     */
    removePiece(piece: Piece): void;
    
    
    /**
     * Find the next node in document order
     * @param node The current node
     */
    
    /**
     * Find the previous node in document order
     * @param node The current node
     */
    
    /**
     * Returns the sibling (other child of shared parent)
     * @param node The current node
     */
    
    /**
     * Returns true if the node is null (a leaf) or if the color is black
     * @param node The current node
     */
    
    /**
     * Rotates the tree left and properly updates leftTotal for the affected nodes
     * @param node The current node
     */
    
    /**
     * Rotates the tree right and properly updates leftTotal for the affected nodes
     * @param node The current node
     */
    
    /**
     * Propagates the changes made to leftTotal for all nodes above in the tree
     * @param node The node that was updated
     * @param oldLength The previous length
     * @param newLength The current length
     */
    lengthChanged(node: TreeNode, oldLength: number, newLength: number): void;
    /**
     * Helper function for insert
     * @param node The inserted node
     */
    
    /**
     * Copies the piece from the source node to the target, and properly updates the piece's pointer back to the node
     * @param target The target node (to be updated)
     * @param source The source node
     */
    
    /**
     * Removes a node from the tree. This does not handle children (hence, unsafe)
     * @param node The node to remove
     */
    
    /**
     * Helper function for remove
     * @param node The node to be removed
     */
    
    /**
     * Safely removes a node from the structure
     * @param node The node to remove
     */
    
}

 enum PieceType {
    text = 0,
    block = 1,
    object = 2
}

 class PrintingModule extends EditingModule {
    readonly editor: DocumentEditor;
    
    
    
    dispose(): void;
    constructor(editor: DocumentEditor);
    
    printCurrentDocument: () => void;
    
    
    
    
    
}

 class QueryManager {
    
    getBlockContent(root: BlockPiece, options?: QueryOptions): QueryResults;
    getBlocks(options?: QueryOptions): QueryResults[];
    getCorrespondingParagraph(piece: TextPiece | ObjectPiece): ParagraphBlock;
    findTable(id: string): {
        table: TableBlock;
        pos: EditPosition;
    } | null;
    getSections(options?: QueryOptions): QueryResults[];
    getSection(root: BlockPiece, options?: QueryOptions): QueryResults;
    isSection(root: Piece): boolean;
    getParagraph(root: BlockPiece, options?: QueryOptions): QueryResults;
    hasParagraphToLeft(root: BlockPiece): boolean;
    isNextLeftBlockParagraph(root: BlockPiece): boolean;
    getParagraphs(options?: QueryOptions): QueryResults[];
    
    
    
    
    
    
    
    
}

 class QueryOptions {
    /**
     * Whether the piece data should be populated in the query results
     */
    data: boolean;
    /**
     * Whether an EditRange object should be populated in the query results
     */
    range: boolean;
    constructor();
}

 interface QueryResults {
    data: BlockContent | null;
    range: EditRange | null;
}

 abstract class RecordOperation {
    readonly type: RecordType;
    readonly pos: EditPosition;
    readonly length: number;
    readonly attributes: Attributes | null;
    readonly location: EditRegion;
    readonly timeStamp: number;
    context: EditableContent;
    constructor(type: RecordType, pos: EditPosition, length: number, attributes: Attributes | null, context: EditableContent);
    abstract inverse(): RecordOperation;
}

 enum RecordType {
    insertText = 0,
    insertObject = 1,
    insertBlock = 2,
    transientInsertBlock = 3,
    transientDeleteBlock = 4,
    deleteText = 5,
    deleteObject = 6,
    deleteBlock = 7,
    formatRange = 8,
    createList = 9,
    addToList = 10,
    removeFromList = 11,
    formatList = 12,
    formatListLevel = 13,
    insertTable = 14,
    deleteTable = 15,
    formatCell = 16,
    insertCell = 17,
    deleteCell = 18,
    insertRow = 19,
    deleteRow = 20,
    mergeCell = 21,
    unmergeCell = 22,
    dynamicMerge = 23,
    dynamicUnmerge = 24,
    moveTo = 25,
    moveFrom = 26
}

 interface Rect {
    width: number;
    height: number;
}

  enum RowLocation {
    above = 0,
    below = 1
}

 type RulerData = {
    usableWidth?: number;
};

/**
 * Describes the script type for the text.
 */
  enum ScriptType {
    /** No script alignment. */
    normal = 0,
    /** The text is subscript. */
    sub = 1,
    /** The text is superscript. */
    super = 2
}

 interface SearchResult {
    para: OutputParagraph;
    origPoint: MovementData;
    startPos: EditPosition;
    endPos: EditPosition;
    start: MovementData | null;
    end: MovementData | null;
    region: ActiveRegion;
}

 enum SelectionMode {
    normal = 0,
    table = 1,
    fulltable = 2
}

 interface SerializedAttribute {
    type: string;
    value: string;
    key: string;
}

 interface SerializedBlockPiece extends SerializedPiece {
    /** Defines the type of the Block.  Corresponds to the `BlockType` enum. */
    blockType: number;
}

 interface SerializedEngine {
    version: string;
    /** Collection of serialized blocks that make up the Document's main body. */
    main: SerializedBlockPiece[];
    lists: SerializedList[];
}

 interface SerializedList {
    id: string;
    attributes: SerializedAttribute[];
    levels: SerializedListLevel[];
}

 interface SerializedListLevel {
    level: number;
    attributes: SerializedAttribute[];
}

 interface SerializedPiece {
    /** Defines the type of Piece object. Corresponds to `PieceType` enum. */
    type: number;
    attributes: SerializedAttribute[];
}

 class SpeechRecognitionModule {
    static isSupported(): boolean;
    readonly editor: DocumentEditor;
    
    
    
    
    
    
    
    /**
     * Starts speech recognition engine
     */
    start(): void;
    /**
     * Stops speech recognition engine
     */
    stop(): void;
    get isStarted(): boolean;
}

/**
 * Spell Checker engine interface.
 */
  interface SpellChecker {
    /**
     * Suggest correctly spelled words close to word.
     * @param word Word to suggest spelling corrections for.
     * @returns List with zero or more suggestions.
     */
    suggest(word: string): string[];
    /**
     * Check if word is correctly spelled.
     * @param word Word to check for correct spelling
     * @returns Whether word is correctly spelled.
     */
    correct(word: string): boolean;
}

/**
 * @public
 * Represents a simple keybinding.
 * This consists of modifier keys -- i.e. ctrl,shift,alt,meta + a keycode
 */
 class StandardBinding {
    readonly ctrl: boolean;
    readonly shift: boolean;
    readonly alt: boolean;
    readonly meta: boolean;
    readonly keyCode: KeyCode;
    constructor(options: StandardBindingOptions);
    /**
     * Checks if this binding is equal to another binding
     * @param binding - The binding to compare this instance to
     */
    equals(binding: StandardBinding | null): boolean;
    /**
     * Checks if this Binding consists of a duplicate modifier.
     * I.E. ctrl = true && keyCode == KeyCode.ctrl
     */
    isDuplicateModifier(): boolean;
    toChord(): ChordBinding;
}

/**
 * @public
 * Constructor options for the StandardBinding class
 */
 interface StandardBindingOptions {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
    keyCode: KeyCode;
}

/** @public
 * Keyboard event wrapper around standard JS keyboard event
*/
 class StandardKeyboardEvent implements IKeyboardEvent {
    readonly target: HTMLElement;
    readonly origEvent: KeyboardEvent;
    readonly ctrl: boolean;
    readonly meta: boolean;
    readonly alt: boolean;
    readonly shift: boolean;
    readonly keyCode: KeyCode;
    readonly key: string;
    constructor(e: KeyboardEvent);
    
    /**
     * Prevents the event from propagating
     */
    stopPropagation(): void;
    /**
     * Prevents the default action from occurring for the event
     */
    preventDefault(): void;
    /**
     * Returns the StandardBinding equivalent of this instance
     */
    toStandardBinding(): StandardBinding;
    /**
     * Checks if this Binding consists of a duplicate modifier.
     * I.E. ctrl = true && keyCode == KeyCode.ctrl
     */
    isDuplicateModifier(): boolean;
    /**
     * Checks if this binding corresponds to a printable character.
     * @returns - True if the key can be printed, otherwise, false.
     */
    isPrintableKey(): boolean;
    /**
     * Returns a virtual KeyCode from a KeyboardEvent
     * @param e - The KeyboardEvent to process.
     */
    static getKeyCode(e: KeyboardEvent): KeyCode;
    /**
     * Returns the `ctrl` KeyboardEvent value.
     * @param code - The KeyCode for the event
     * @param e - The browser's Keyboard event.
     *
     * @remarks The Meta key in Mac is equivalent to the ctrl key in other operating systems.
     * If we are running under mac, and meta is true, we will return the ctrl code as true.
     * This is for ease of use so that keybindings do not have to be setup for each operation system.
     */
    static getCtrlKeyValue(code: KeyCode, e: KeyboardEvent): boolean;
    /**
     * Returns the `meta` KeyboardEvent value.
     * @param code - The KeyCode for the event
     * @param e - The browser's Keyboard event.
     *
     * @remarks The Meta key in Mac is equivalent to the ctrl key in other operating systems.
     * If we are running under a non-mac system, and ctrl is true, we will return the meta code as true.
     * This is for ease of use so that keybindings do not have to be setup for each operation system.
     */
    static getMetaKeyValue(code: KeyCode, e: KeyboardEvent): boolean;
}

/**
 * Describes the type of strikethrough line that should be used.
 */
  enum StrikethroughType {
    /** No strikethrough line. */
    none = 0,
    /** A single line should be used to render the strikethrough. */
    single = 1,
    /** Two lines should be used to render the strikethrough. */
    double = 2
}

 interface StructLocation {
    piece: Piece;
    docPos: EditPosition;
}

 enum TableAlignment {
    left = 0,
    right = 1,
    center = 2
}

 class TableBlock extends BlockPiece {
    context: EditableContent;
    readonly id: string;
    rows: Cell[][];
    constructor(surface: EditableContent, attrs?: Attributes | null, id?: string);
    /**
     * Retrieves the Cell object located at the intersection.
     * @param row - The row that the cell belongs to.
     * @param column - The column that the cell belongs to.
     */
    getCell(row: number, column: number): Cell;
    /**
     * Creates a new cell and inserts it into the table at the intersection.
     * @param row - The row that the cell should be inserted into.
     * @param column - The column that the cell should be inserted into.
     * @param options - The engine options to use when executing this command.
     * @param attributes - Any attributes that belong to the cell.
     */
    createCell(row: number, column: number, options?: EngineOptions, attributes?: Attributes | null, bcell?: Cell | null): Cell;
    insertCell(cell: Cell, options?: EngineOptions): Cell;
    /**
     * Deletes the cell and all it's content at the intersection.
     * @param row - The row that the cell belongs to.
     * @param column - The column that the cell belongs to.
     * @param options - The engine options to use when executing this command.
     */
    deleteCell(row: number, column: number, options?: EngineOptions): void;
    /**
     * Inserts a new row into the table relative to a cell.
     * @param cell - The cell to use as a reference when inserting the row.
     * @param location - The location where the row should be inserted relative to the cell.
     * @param options - The engine options to use when executing this command.
     */
    insertRow(cell: Cell, location: RowLocation, options?: EngineOptions): void;
    /**
     * Inserts a new column into the table relative to a cell.
     * @param cell - The cell to use as a reference when inserting the column.
     * @param location - The location where the column should be inserted relative to the cell.
     * @param options - The engine options to use when executing this command.
     */
    insertColumn(cell: Cell, location: ColumnLocation, createCellCallback: (cell: Cell) => void, options?: EngineOptions): void;
    /**
     * Deletes a row from the table.
     * @param row - The index of the row to delete.
     * @param options - The engine options to use when executing this command.
     */
    deleteRow(row: number, options?: EngineOptions): void;
    /**
     * Deletes a column from the table.
     * @param column The index of the column to delete.
     * @param options The engine options to use when executing this command.
     */
    deleteColumn(column: number, options?: EngineOptions): void;
    /**
     * Iterates over every cell in the table.
     * @param cb - Callback function to execute
     */
    forEachCell(cb: (cell: Cell) => void): void;
    insertEmptyRow(row: number): void;
    /**
     * Merges all cells in the provided range together.
     * @param from The cell to start the merge.
     * @param to The cell to end the merge.
     * @param options The engine options to use when executing this command.
     * @returns The cell used as the Anchor for the merge.
     */
    merge(from: CellPoint, to: CellPoint, options?: EngineOptions): Cell | null;
    unmerge(cell: Cell, options?: EngineOptions): void;
    canMerge(from: CellPoint, to: CellPoint): boolean;
    
    
    
}

 interface TableData {
    alignment?: TableAlignment;
    /** How far to the left the table should be indented, in inches */
    leftIndent?: number;
}

 class TableEngine {
    readonly engine: EngineModule;
    readonly editor: DocumentEditor;
    /**
     * Distributes the columns in a table based on the current size of the table.
     */
    distributeColumns(): void;
    /**
     * Distributes the rows in a table based off size of the largest cell in the table.
     */
    distributeRows(): void;
    /**
     * Inserts a new table at the cursor location.  If the editor is currently selecting, the region will be deleted and replaced with the new table.
     * @param rows The amount of rows the new table should have.  Must be a value greater than 0.
     * @param columns The amount of columns the new table should have.  Must be a value greater 0.
     */
    insertTable(rows: number, columns: number): void;
    /**
     * Inserts a new row in table.
     * @param location Whether the row should be inserted above or below the current cell.
     */
    insertRow(location: RowLocation): void;
    /**
     * Inserts a new column in the table.
     * @param location Whether the column should be inserted to the left or right of the current cell.
     */
    insertColumn(location: ColumnLocation): void;
    /**
     * Deletes the current table.
     */
    deleteTable(): void;
    /**
     * Deletes the current column in the table. If there is only one column, the whole table will be deleted.
     */
    deleteColumn(): void;
    /**
     * Deletes the current row in the table.  If there is only one row, the whole table will be deleted.
     */
    deleteRow(): void;
    /**
     * Formats the border's of the cells within the provided region.
     * @param region The BorderRegion that the styling should be applied to.
     * @param data The styling data that should be applied to the region.
     */
    formatCellBorders(region: BorderRegion, data: CellBorder, color?: string): void;
    /**
     * Formats all cells uniformly with the provided styling data.
     * @param data The styling data that should be applied to the region.
     */
    formatCell(data: CellFormatData): void;
    /**
     * Whether the Editor can merge any cells in the selection.
     */
    canMerge(): boolean;
    /**
     * Whether the Editor can unmerge any cells in the selection.
     */
    canUnmerge(): boolean;
    /** Merges cells in the selection together. */
    merge(): void;
    unmerge(): void;
    
}

 type TabStop = {
    left: number;
};

/**
 * This class is responsible for holding all of the text information pertaining to a document.
 */
 class TextBuffer {
    /**
     * Represents the text content of the document when it was first opened.
     */
    readonly original: string;
    /**
     * Represents any text that was inserted since the document was first opened.
     */
    
    get modified(): string;
    constructor(original: string);
    /**
     * Appends a string to the modified buffer.
     * @param str - the string to append
     * @returns A number representing the index into the buffer where the newly inserted string begins.
     */
    append(str: string): number;
}

 class TextEngine {
    readonly engine: EngineModule;
    readonly editor: DocumentEditor;
    /**
     * Inserts a string into the editor.
     * @param text The text string to insert.
     * @note If the editor is currently selecting, the selection will be deleted before the object is inserted.
     */
    insertText(text: string): void;
    /**
     * Inserts a new paragraph into the editor.
     * @note If the editor is currently selecting, the selection will be deleted before the object is inserted.
     */
    insertParagraph(): void;
    /**
    * Increases the font size by the provided threshold.
    * @param threshold - Threshold to increase the font size by.
    *
    * @note For selections, this will increment the font-size depending on the size of individual runs in the selection range.  To uniformly apply a font-size to the whole region, set the `fontSize` value in the `ContextModule`'s font
    */
    incrementFontSize(threshold: number): void;
    /**
    * Increases the left indent size by the provided threshold.
    * @param threshold - Threshold to increase the font size by.
    * @note For selections, this will increment the left indent depending on the indent value of each paragraph in the selection range.  To uniformly apply an indention size to whole region, set the `leftIndent` value in the `ContextModule`'s paragraph.
    */
    incrementIndentSize(threshold: number): void;
    
    /**
     * Inserts a new hyperlink across the selected region.
     * @param link - The link to insert.
     */
    insertLink(link: string): void;
    /**
     * Removes all hyperlinks in the editing context.
     */
    removeLink(): void;
    /**
     * Inserts a tab into the editor.
     */
    insertTab(): void;
}

 class TextPiece extends Piece {
    static readonly DEFAULT_NAME: string;
    isOriginal: boolean;
    index: number;
    constructor(index: number, length: number, attrs?: Attributes | null, isOriginal?: boolean);
}

 class TreeNode {
    owner: PieceStructure | null;
    color: TreeNodeColor;
    piece: Piece | null;
    parent: TreeNode | null;
    left: TreeNode | null;
    right: TreeNode | null;
    leftTotalLength: number;
    constructor(owner: PieceStructure, color: TreeNodeColor, piece: Piece | null, parent: TreeNode | null, left: TreeNode | null, right: TreeNode | null);
    lengthChanged(oldLength: number, newLength: number): void;
}

 enum TreeNodeColor {
    black = 0,
    red = 1
}

/**
 * Describes the underline type that should be used for the text.
 */
  enum UnderlineType {
    /** No underline should be rendered. */
    none = 0,
    /** A single line should be used for rendering. */
    single = 1,
    /** A double line should be used for rendering. */
    double = 2,
    /** A single dotted line should be used for rendering. */
    dotted = 3,
    /** A single dashed line should be used for rendering. */
    dashed = 4,
    /** A single wavy line should be used for rendering. */
    wavy = 5
}

 type VerticalAlignerData = {
    width: number;
    position: number;
    offset: number;
    minimum: number;
    maximum: number;
    shouldRender: boolean;
};

 enum ViewMode {
    edit = 0,
    readonly = 1
}
} 
