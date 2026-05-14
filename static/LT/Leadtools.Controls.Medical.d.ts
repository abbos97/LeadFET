//***********************************************************************************************
//   Copyright (c) 1991-2026 Apryse Software Corp. ALL RIGHTS RESERVED.
//***********************************************************************************************
//***********************************************************************************************
//   Type definitions for Leadtools.Controls.Medical.js
//   Updated: 3/31/2026 13:12
//   Version: 23.0.0.87
//
//   Dependencies:
//      Leadtools.d.ts
//      Leadtools.Annotations.Automation.d.ts
//      Leadtools.Annotations.Designers.d.ts
//      Leadtools.Annotations.Engine.d.ts
//      Leadtools.Annotations.Rendering.JavaScript.d.ts
//      Leadtools.Controls.d.ts
//
//   https://www.leadtools.com
//***********************************************************************************************

declare module lt.Controls.Medical {

   enum Object3DStatus {
      notInitialized = 0,
      loading = 1,
      ready = 2,
      error = 3
   }

   class Volume3DInformation {
      get_orientation(): number[];
      set_orientation(value: number[]): void;
      get_firstPosition(): LeadPoint3D;
      set_firstPosition(value: LeadPoint3D): void;
      get_lastPosition(): LeadPoint3D;
      set_lastPosition(value: LeadPoint3D): void;
      get_rowSpacing(): number;
      set_rowSpacing(value: number): void;
      get_columnSpacing(): number;
      set_columnSpacing(value: number): void;
      get_width(): number;
      set_width(value: number): void;
      get_height(): number;
      set_height(value: number): void;
      constructor(orientation: number[], firstPosition: LeadPoint3D, lastPosition: LeadPoint3D, rowSpacing: number, columSpacing: number, width: number, height: number);
      orientation: number[];
      firstPosition: LeadPoint3D;
      lastPosition: LeadPoint3D;
      rowSpacing: number;
      columnSpacing: number;
      width: number;
      height: number;
   }

   class Derivative3D extends Cell {
      get_generator(): Cell;
      set_generator(value: Cell): void;
      get_renderingType(): RenderingType;
      set_renderingType(value: RenderingType): void;
      get_information(): DICOMImageInformation;
      set_information(value: DICOMImageInformation): void;
      onEngineReady(engine: Object3DEngine): void;  // protected
      get_engine(): Object3DEngine;
      set_engine(value: Object3DEngine): void;
      onSizeChanged(): void;
      prepareDrawingCanvas(frame: Frame, chunk: ChunkData): ChunkData;  // protected
      onDrawFrame(frame: SliceFrame, chunk: ChunkData): void;  // protected
      constructor(viewer: MedicalViewer, generator: Cell, renderingType: RenderingType, divID: string, row: number, col: number);
      generator: Cell;
      renderingType: RenderingType;
      information: DICOMImageInformation;
      engine: Object3DEngine;
   }

   class Object3DEngine {
      add_request3DData(value: Request3DDataEventHandler): void;
      remove_request3DData(value: Request3DDataEventHandler): void;
      add_statusChanged(value: StatusChangedEventHandler): void;
      remove_statusChanged(value: StatusChangedEventHandler): void;
      add_object3DReady(value: lt.LeadEventHandler): void;
      remove_object3DReady(value: lt.LeadEventHandler): void;
      add_progressUpdated(value: lt.LeadEventHandler): void;
      remove_progressUpdated(value: lt.LeadEventHandler): void;
      get_progress(): number;
      set_progress(value: number): void;
      get_info(): Volume3DInformation;
      set_info(value: Volume3DInformation): void;
      get_center(): LeadPoint3D;
      get_status(): Object3DStatus;
      set_status(value: Object3DStatus): void;
      get_errorMessage(): string;
      set_errorMessage(value: string): void;
      get_volumeReady(): boolean;
      get_id(): string;
      set_id(value: string): void;
      start(extraCriteria: string, studyInstanceUID: string, seriesInstanceUID: string): void;
      send(requestType: string, frame: SliceFrame, json: string): void;
      getSettings(json: string): void;
      setSettings(json: string): void;
      static canDo3D(cell: Cell): CanDo3DStatus;
      end(): void;
      render3D(url: string): void;
      constructor(id: string);
      progress: number;
      info: Volume3DInformation;
      center: LeadPoint3D; // read-only
      status: Object3DStatus;
      errorMessage: string;
      volumeReady: boolean; // read-only
      id: string;
      request3DData: Request3DDataEventType; // read-only
      statusChanged: StatusChangedEventType; // read-only
      object3DReady: lt.LeadEventType; // read-only
      progressUpdated: lt.LeadEventType; // read-only
   }

   enum MPRStatus {
      ok = 0,
      imageOrientationNotTheSame = -5,
      cellNotValid = -4,
      allFramesNotReady = -3,
      imagePositionNotReady = -2,
      notEnoughFrames = -1
   }

   enum CellMPRType {
      axial = 0,
      sagittal = 1,
      coronal = 2,
      none = -1
   }

   class MPRCell extends Derivative3D {
      onDrawFrame(frame: SliceFrame, chunk: ChunkData): void;  // protected
      static canDoMPR(cell: Cell): MPRStatus;
      add_orientationChanged(value: lt.LeadEventHandler): void;
      remove_orientationChanged(value: lt.LeadEventHandler): void;
      get_imageOrientation(): number[];
      set_imageOrientation(value: number[]): void;
      onEngineReady(engine: Object3DEngine): void;  // protected
      constructor(viewer: MedicalViewer, parent: Cell, divID: string, type: RenderingType, mprType: CellMPRType);
      imageOrientation: number[];
      orientationChanged: lt.LeadEventType; // read-only
   }

   class PanoramicCell extends Derivative3D {
      get_name(): string;
      constructor(viewer: MedicalViewer, cell: Cell, divID: string);
      name: string; // read-only
   }

   class ParaxialSlice {
      get_frame(): SliceFrame;
      set_frame(value: SliceFrame): void;
      get_polygon(): PanoramicPolygon;
      get_lineIndex(): number;
      get_position(): lt.LeadPointD;
      set_position(value: lt.LeadPointD): void;
      generate(): void;
      refresh(): void;
      get_length(): number;
      set_length(value: number): void;
      get_handles(): lt.LeadPointD[];
      get_relativePosition(): number;
      set_relativePosition(value: number): void;
      constructor(polygon: PanoramicPolygon, frame: SliceFrame);
      frame: SliceFrame;
      polygon: PanoramicPolygon; // read-only
      lineIndex: number; // read-only
      position: lt.LeadPointD;
      length: number;
      handles: lt.LeadPointD[]; // read-only
      relativePosition: number;
   }

   class SliceFrame extends Frame {
      get_URI(): string;
      set_URI(value: string): void;
      refreshData(): void;
      get_engine(): Object3DEngine;
      set_engine(value: Object3DEngine): void;
      get_type(): OperationType;
      set_type(value: OperationType): void;
      get_volumeContrast(): number;
      set_volumeContrast(value: number): void;
      get_volumeBrightness(): number;
      set_volumeBrightness(value: number): void;
      get_thickness(): number;
      set_thickness(value: number): void;
      get_widthCurve(): LeadPoint3D[][];
      set_widthCurve(value: LeadPoint3D[][]): void;
      get_heightCurve(): LeadPoint3D[];
      set_heightCurve(value: LeadPoint3D[]): void;
      get_renderingType(): RenderingType;
      set_renderingType(value: RenderingType): void;
      generate(): void;
      constructor(parent: Derivative3D, engine: Object3DEngine);
      URI: string;
      engine: Object3DEngine;
      type: OperationType;
      volumeContrast: number;
      volumeBrightness: number;
      thickness: number;
      widthCurve: LeadPoint3D[][];
      heightCurve: LeadPoint3D[];
      renderingType: RenderingType;
   }

   class ActionCommand {
      get_id(): number;
      set_id(value: number): void;
      get_linked(): lt.LeadCollection;
      set_linked(value: lt.LeadCollection): void;
      get_canLinkItems(): boolean;
      set_canLinkItems(value: boolean): void;
      get_canLinkFrames(): boolean;
      set_canLinkFrames(value: boolean): void;
      get_parent(): Cell;
      set_parent(value: Cell): void;
      get_mouseButton(): lt.Controls.MouseButtons;
      set_mouseButton(value: lt.Controls.MouseButtons): void;
      add_actionStarted(value: lt.LeadEventHandler): void;
      remove_actionStarted(value: lt.LeadEventHandler): void;
      add_actionCreated(value: lt.LeadEventHandler): void;
      remove_actionCreated(value: lt.LeadEventHandler): void;
      add_disposing(value: lt.LeadEventHandler): void;
      remove_disposing(value: lt.LeadEventHandler): void;
      dispose(): void;
      run(item: any): void;
      onActionCreated(): void;  // protected
      onActionStarted(): void;  // protected
      constructor(id: number);
      id: number;
      linked: lt.LeadCollection;
      canLinkItems: boolean;
      canLinkFrames: boolean;
      parent: Cell;
      mouseButton: lt.Controls.MouseButtons;
      actionStarted: lt.LeadEventType; // read-only
      actionCreated: lt.LeadEventType; // read-only
      disposing: lt.LeadEventType; // read-only
   }

   class AutomationInteractiveAction extends InteractiveAction {
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      get_objectID(): number;
      set_objectID(value: number): void;
      run(item: any): void;
      constructor(id: number, objectID: number, automation: lt.Annotations.Automation.AnnAutomation);
      objectID: number;
   }

   class Cursor3DAction extends InteractiveAction {
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      get_scroll(): boolean;
      set_scroll(value: boolean): void;
      constructor(id: number);
      scroll: boolean;
   }

   class InteractiveAction extends ActionCommand {
      add_changed(value: InteractiveModeDragEventHandler): void;
      remove_changed(value: InteractiveModeDragEventHandler): void;
      add_dragDelta(value: InteractiveModeDragEventHandler): void;
      remove_dragDelta(value: InteractiveModeDragEventHandler): void;
      apply(source: lt.Controls.ImageViewerItem, change: lt.LeadPointD, userData: any): void;
      get_precedenceLevel(): number;
      set_precedenceLevel(value: number): void;
      get_interactiveMode(): lt.Controls.ImageViewerInteractiveMode;
      onDragDelta(item: lt.Controls.ImageViewerItem, change: lt.LeadPointD): void;  // protected
      onWorkStarted(item: lt.Controls.ImageViewerItem): void;  // protected
      onWorkCompleted(item: lt.Controls.ImageViewerItem): void;  // protected
      onActionStarted(): void;  // protected
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      onActionCreated(): void;  // protected
      dispose(): void;
      constructor(id: number);
      precedenceLevel: number;
      interactiveMode: lt.Controls.ImageViewerInteractiveMode; // read-only
      changed: InteractiveModeDragEventType; // read-only
      dragDelta: InteractiveModeDragEventType; // read-only
   }

   class LineProfileAction extends InteractiveAction {
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      constructor(id: number);
   }

   class MagnifyAction extends InteractiveAction {
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      constructor(id: number);
   }

   class OffsetAction extends InteractiveAction {
      apply(sourceItem: lt.Controls.ImageViewerItem, change: lt.LeadPointD, userData: any): void;
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      constructor(id: number);
   }

   class ProbeToolAction extends InteractiveAction {
      add_probeToolUpdated(value: ProbeToolEventHandler): void;
      remove_probeToolUpdated(value: ProbeToolEventHandler): void;
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      constructor(id: number);
      probeToolUpdated: ProbeToolEventType; // read-only
   }

   class ScaleAction extends InteractiveAction {
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      apply(sourceItem: lt.Controls.ImageViewerItem, change: lt.LeadPointD, userData: any): void;
      get_inverted(): boolean;
      set_inverted(value: boolean): void;
      dispose(): void;
      constructor(id: number);
      inverted: boolean;
   }

   class SpyGlassAction extends MagnifyAction {
      add_imageRequested(value: SpyGlassEventHandler): void;
      remove_imageRequested(value: SpyGlassEventHandler): void;
      add_positionChanged(value: SpyGlassPositionChangedEventHandler): void;
      remove_positionChanged(value: SpyGlassPositionChangedEventHandler): void;
      add_chunkLoaded(value: ChunkLoadedEventHandler): void;
      remove_chunkLoaded(value: ChunkLoadedEventHandler): void;
      get_resizeGlassOnScroll(): boolean;
      set_resizeGlassOnScroll(value: boolean): void;
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      constructor(id: number);
      resizeGlassOnScroll: boolean;
      imageRequested: SpyGlassEventType; // read-only
      positionChanged: SpyGlassPositionChangedEventType; // read-only
      chunkLoaded: ChunkLoadedEventType; // read-only
   }

   class StackAction extends InteractiveAction {
      add_stackChanged(value: StackChangedEventHandler): void;
      remove_stackChanged(value: StackChangedEventHandler): void;
      get_enableWheel(): boolean;
      set_enableWheel(value: boolean): void;
      onActionStarted(): void;  // protected
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      constructor(id: number, cell: Cell);
      enableWheel: boolean;
      stackChanged: StackChangedEventType; // read-only
   }

   class TransformItemAction extends InteractiveAction {
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      constructor(item: LayoutManagerItem, id: number);
   }

   class WindowLevelAction extends InteractiveAction {
      onWorkStarted(item: lt.Controls.ImageViewerItem): void;  // protected
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      get_serverSideRendering(): boolean;
      set_serverSideRendering(value: boolean): void;
      dispose(): void;
      apply(source: lt.Controls.ImageViewerItem, change: lt.LeadPointD, userData: any): void;
      constructor(id: number);
      serverSideRendering: boolean;
   }

   class Cell3D extends Series {
      onInvertChanged(): void;  // protected
      invalidate(): void;  // protected
      add_volumeTypeChanged(value: lt.LeadEventHandler): void;
      remove_volumeTypeChanged(value: lt.LeadEventHandler): void;
      add_cellClicked(value: lt.Controls.InteractiveEventHandler): void;
      remove_cellClicked(value: lt.Controls.InteractiveEventHandler): void;
      get_matrix(): LeadMatrix3D;
      get_object3D(): Object3DEngine;
      set_object3D(value: Object3DEngine): void;
      get_referenceCell(): Cell;
      set_referenceCell(value: Cell): void;
      get_orientation(): OrientationFace;
      set_orientation(value: OrientationFace): void;
      updateWindowLevelValues(): void;
      get_name(): string;
      get_sensitivity(): number;
      set_sensitivity(value: number): void;
      get_resizeFactor(): number;
      set_resizeFactor(value: number): void;
      get_URL(): string;
      set_URL(value: string): void;
      get_image(): HTMLImageElement;
      get_overlayTextVisible(): boolean;
      set_overlayTextVisible(value: boolean): void;
      set_information(value: WindowLevelInformation): void;
      get_information(): WindowLevelInformation;
      get_JSON(): any;
      set_JSON(value: any): void;
      get_projection(): ProjectionMethod;
      set_projection(value: ProjectionMethod): void;
      get_showRotationCube(): boolean;
      set_showRotationCube(value: boolean): void;
      get_showVolumeBorder(): boolean;
      set_showVolumeBorder(value: boolean): void;
      get_volume(): VolumeProperties;
      get_MPR(): MPRVolumeProperties;
      get_defaultWindowLevelWidth(): number;
      get_defaultWindowLevelCenter(): number;
      get_volumeType(): VolumeType;
      set_volumeType(value: VolumeType): void;
      updateView(): void;
      refresh(): void;
      endUpdate(): void;
      onSizeChanged(): void;
      dispose(): void;
      reset(): void;
      start(extraCriteria: string): void;
      rotateBy(x: number, y: number): void;
      zoomBy(x: number): void;
      translate(x: number, y: number): void;
      get_interactiveActions(): { [key: number]: Interactive3DAction };
      constructor(viewer: MedicalViewer, divID: string);
      matrix: LeadMatrix3D; // read-only
      object3D: Object3DEngine;
      referenceCell: Cell;
      orientation: OrientationFace;
      name: string; // read-only
      sensitivity: number;
      resizeFactor: number;
      URL: string;
      image: HTMLImageElement; // read-only
      overlayTextVisible: boolean;
      information: WindowLevelInformation;
      JSON: any;
      projection: ProjectionMethod;
      showRotationCube: boolean;
      showVolumeBorder: boolean;
      volume: VolumeProperties; // read-only
      MPR: MPRVolumeProperties; // read-only
      defaultWindowLevelWidth: number; // read-only
      defaultWindowLevelCenter: number; // read-only
      volumeType: VolumeType;
      interactiveActions: { [key: number]: Interactive3DAction }; // read-only
      volumeTypeChanged: lt.LeadEventType; // read-only
      cellClicked: lt.Controls.InteractiveEventType; // read-only
      imageLoaded: boolean;
   }

   interface CellEventHandler extends lt.LeadEventHandler {
      (sender: any, e: CellEventArgs): void;
   }

   class CellEventType extends lt.LeadEvent {
      add(value: CellEventHandler): CellEventHandler;
      remove(value: CellEventHandler): void;
   }

   class CellEventArgs extends lt.LeadEventArgs {
      get_frame(): Frame;
      constructor(frame: Frame);
      frame: Frame; // read-only
   }

   class CellGridLayout {
      get_value1(): number;
      set_value1(value: number): void;
      get_value2(): number;
      set_value2(value: number): void;
      get_value3(): number;
      set_value3(value: number): void;
      get_value4(): number;
      set_value4(value: number): void;
      get_rows(): number;
      set_rows(value: number): void;
      get_columns(): number;
      set_columns(value: number): void;
      constructor(cell: Cell, rows: number, columns: number);
      value1: number;
      value2: number;
      value3: number;
      value4: number;
      rows: number;
      columns: number;
   }

   class CephalometricCell extends Derivative3D {
      onEngineReady(engine: Object3DEngine): void;  // protected
      constructor(viewer: MedicalViewer, cell: Cell, divID: string);
   }

   class Series extends LayoutManagerItem {
      get_inverted(): boolean;
      set_inverted(value: boolean): void;
      get_imageViewer(): AutomationImageViewer;
      set_imageViewer(value: AutomationImageViewer): void;
      get_selectedItems(): lt.LeadCollection;
      set_selectedItems(value: lt.LeadCollection): void;
      get_automation(): lt.Annotations.Automation.AnnAutomation;
      set_borderThickness(value: number): void;
      get_borderThickness(): number;
      get_studyInstanceUID(): string;
      set_studyInstanceUID(value: string): void;
      get_seriesNumber(): number;
      set_seriesNumber(value: number): void;
      get_patientName(): string;
      set_patientName(value: string): void;
      get_seriesInstanceUID(): string;
      set_seriesInstanceUID(value: string): void;
      get_frameOfReferenceUID(): string;
      set_frameOfReferenceUID(value: string): void;
      get_name(): string;
      get_showFrameBorder(): boolean;
      set_showFrameBorder(value: boolean): void;
      get_selectedBorderColor(): string;
      set_selectedBorderColor(value: string): void;
      get_unselectedBorderColor(): string;
      set_unselectedBorderColor(value: string): void;
      get_selectedSubCellBorderColor(): string;
      set_selectedSubCellBorderColor(value: string): void;
      get_highlightedSubCellBorderColor(): string;
      set_highlightedSubCellBorderColor(value: string): void;
      beginUpdate(): void;
      endUpdate(): void;
      onInvertChanged(): void;  // protected
      invalidate(): void;  // protected
      onSizeChanged(): void;
      constructor(viewer: MedicalViewer, divID: string);
      inverted: boolean;
      imageViewer: AutomationImageViewer;
      selectedItems: lt.LeadCollection;
      automation: lt.Annotations.Automation.AnnAutomation; // read-only
      borderThickness: number;
      studyInstanceUID: string;
      seriesNumber: number;
      patientName: string;
      seriesInstanceUID: string;
      frameOfReferenceUID: string;
      name: string; // read-only
      showFrameBorder: boolean;
      selectedBorderColor: string;
      unselectedBorderColor: string;
      selectedSubCellBorderColor: string;
      highlightedSubCellBorderColor: string;
   }

   class STLCell extends Series {
      add_render(value: lt.LeadEventHandler): void;
      remove_render(value: lt.LeadEventHandler): void;
      dispose(): void;
      loadFromURL(url: string): void;
      load(fileName: string): void;
      get_outputCanvas(): HTMLCanvasElement;
      onSizeChanged(): void;
      invalidate(): void;  // protected
      constructor(viewer: MedicalViewer, path: string, divID: string);
      outputCanvas: HTMLCanvasElement; // read-only
      render: lt.LeadEventType; // read-only
   }

   class ActionCommands extends lt.LeadCollection {
      get_lookup(): { [key: number]: ActionCommand };
      onCollectionChanged(args: lt.NotifyLeadCollectionChangedEventArgs): void;  // protected
      constructor();
      lookup: { [key: number]: ActionCommand }; // read-only
   }

   class Frame {
      offsetBy(x: number, y: number): void;
      scaleBy(scaleX: number, scaleY: number): void;
      get_isFullImageReceived(): boolean;
      get_isPNGDataReady(): boolean;
      get_preview16BitPNG(): string;
      set_preview16BitPNG(value: string): void;
      get_drawingCanvas(): HTMLCanvasElement;
      get_pngDataSrc(): string;
      get_imageData(): number[];
      set_imageData(value: number[]): void;
      get_previewImage(): HTMLImageElement;
      set_previewImage(value: HTMLImageElement): void;
      get_requestInterval(): number;
      set_requestInterval(value: number): void;
      get_dataSize(): lt.LeadSizeD;
      set_dataSize(value: lt.LeadSizeD): void;
      get_imageURL(): string;
      set_imageURL(value: string): void;
      get_previewURI(): string;
      set_previewURI(value: string): void;
      set_bitPerpixel(value: number): void;
      get_defaultWindowLevelWidth(): number;
      get_defaultWindowLevelCenter(): number;
      get_windowWidth(): number;
      get_windowCenter(): number;
      setWindowLevel(width: number, center: number): void;
      get_minValue(): number;
      set_minValue(value: number): void;
      get_maxValue(): number;
      set_maxValue(value: number): void;
      get_lowBit(): number;
      set_lowBit(value: number): void;
      get_highBit(): number;
      set_highBit(value: number): void;
      get_bitStored(): number;
      set_bitStored(value: number): void;
      get_rescaleintercept(): number;
      set_rescaleintercept(value: number): void;
      get_rescaleSlope(): number;
      set_rescaleSlope(value: number): void;
      get_voiLUTSequence(): number[];
      set_voiLUTSequence(value: number[]): void;
      get_imageType(): string[];
      set_imageType(value: string[]): void;
      get_lossyCompression(): boolean;
      set_lossyCompression(value: boolean): void;
      get_isWaveForm(): boolean;
      set_isWaveForm(value: boolean): void;
      get_frameOfReferenceID(): string;
      set_frameOfReferenceID(value: string): void;
      get_photometricInterpretation(): string;
      set_photometricInterpretation(value: string): void;
      get_flipped(): boolean;
      set_flipped(value: boolean): void;
      get_reversed(): boolean;
      set_reversed(value: boolean): void;
      get_rotateAngle(): number;
      set_rotateAngle(value: number): void;
      get_offsetX(): number;
      set_offsetX(value: number): void;
      get_offsetY(): number;
      set_offsetY(value: number): void;
      get_scale(): number;
      zoom(sizeMode: MedicalViewerSizeMode, scaleFactor: number): void;
      get_scaleMode(): MedicalViewerSizeMode;
      reset(): void;
      get_useDPI(): boolean;
      set_useDPI(value: boolean): void;
      add_imageDataError(value: lt.LeadEventHandler): void;
      remove_imageDataError(value: lt.LeadEventHandler): void;
      add_previewError(value: lt.LeadEventHandler): void;
      remove_previewError(value: lt.LeadEventHandler): void;
      add_previewLoaded(value: lt.LeadEventHandler): void;
      remove_previewLoaded(value: lt.LeadEventHandler): void;
      add_imageDrawn(value: lt.LeadEventHandler): void;
      remove_imageDrawn(value: lt.LeadEventHandler): void;
      setPNGDataSrc(src: string, width: number, height: number): void;
      get_targetOrientation(): string[];
      set_targetOrientation(value: string[]): void;
      get_inverted(): boolean;
      set_inverted(value: boolean): void;
      get_wlData(): WindowLevelData;
      get_userData(): any;
      set_userData(value: any): void;
      dispose(): void;
      get_isDataReady(): boolean;
      get_information(): DICOMImageInformation;
      set_information(value: DICOMImageInformation): void;
      get_imagePosition(): number[];
      set_imagePosition(value: number[]): void;
      get_imageOrientation(): number[];
      set_imageOrientation(value: number[]): void;
      isImageDataAvailable(): boolean;
      get_wlRenderer(): DICOMImageInformationRenderer;
      get_width(): number;
      set_width(value: number): void;
      get_height(): number;
      set_height(value: number): void;
      get_rowSpacing(): number;
      set_rowSpacing(value: number): void;
      get_columnSpacing(): number;
      set_columnSpacing(value: number): void;
      get_projectionOrientation(): ProjectionOrientationType;
      set_projectionOrientation(value: ProjectionOrientationType): void;
      get_patientProjection(): string[];
      set_patientProjection(value: string[]): void;
      get_instanceNumber(): number;
      set_instanceNumber(value: number): void;
      get_bitPerpixel(): number;
      add_imageDataReady(value: lt.LeadEventHandler): void;
      remove_imageDataReady(value: lt.LeadEventHandler): void;
      add_windowLevelChanged(value: lt.LeadEventHandler): void;
      remove_windowLevelChanged(value: lt.LeadEventHandler): void;
      get_viewMatrix(): lt.LeadMatrix;
      set_viewMatrix(value: lt.LeadMatrix): void;
      get_pixelData(): number[];
      set_pixelData(value: number[]): void;
      add_dataChanged(value: FrameDataChangedEventHandler): void;
      remove_dataChanged(value: FrameDataChangedEventHandler): void;
      get_dataModified(): boolean;
      set_dataModified(value: boolean): void;
      get_blob(): number[];
      set_blob(value: number[]): void;
      get_laterality(): string;
      set_laterality(value: string): void;
      get_viewPosition(): string;
      set_viewPosition(value: string): void;
      set_lowResImage(value: ChunkData): void;
      get_lowResImage(): ChunkData;
      get_JSON(): any;
      set_JSON(value: any): void;
      get_sopInstanceUID(): string;
      set_sopInstanceUID(value: string): void;
      get_imageProcessingList(): lt.LeadCollection;
      getPreviewCanvas(): HTMLCanvasElement;
      get_verticalAlignment(): VerticalAlignmentType;
      set_verticalAlignment(value: VerticalAlignmentType): void;
      get_horizontalAlignment(): HorizontalAlignmentType;
      set_horizontalAlignment(value: HorizontalAlignmentType): void;
      add_loadImageFailed(value: lt.LeadEventHandler): void;
      remove_loadImageFailed(value: lt.LeadEventHandler): void;
      add_loadInstance(value: LoadInstanceEventHandler): void;
      remove_loadInstance(value: LoadInstanceEventHandler): void;
      get_backgroundSize(): lt.LeadSizeD;
      set_backgroundSize(value: lt.LeadSizeD): void;
      refreshData(): void;
      add_requestCanceled(value: lt.LeadEventHandler): void;
      remove_requestCanceled(value: lt.LeadEventHandler): void;
      get_mrtiInfo(): MRTIImage;
      set_mrtiInfo(value: MRTIImage): void;
      get_retakeIndex(): number;
      set_retakeIndex(value: number): void;
      get_nFrame(): Frame;
      get_retakes(): lt.LeadCollection;
      get_subCell(): SubCell;
      get_imageQuality(): string;
      get_container(): lt.Annotations.Engine.AnnContainer;
      get_enableDraw(): boolean;
      set_enableDraw(value: boolean): void;
      get_parentCell(): Cell;
      constructor(parent: Cell);
      viewMatrix: lt.LeadMatrix;
      pixelData: number[];
      dataModified: boolean;
      blob: number[];
      laterality: string;
      viewPosition: string;
      lowResImage: ChunkData;
      JSON: any;
      sopInstanceUID: string;
      imageProcessingList: lt.LeadCollection; // read-only
      verticalAlignment: VerticalAlignmentType;
      horizontalAlignment: HorizontalAlignmentType;
      backgroundSize: lt.LeadSizeD;
      mrtiInfo: MRTIImage;
      retakeIndex: number;
      nFrame: Frame;
      retakes: lt.LeadCollection;
      subCell: SubCell; // read-only
      imageQuality: string; // read-only
      container: lt.Annotations.Engine.AnnContainer; // read-only
      enableDraw: boolean;
      parentCell: Cell; // read-only
      targetOrientation: string[];
      inverted: boolean;
      wlData: WindowLevelData; // read-only
      userData: any;
      isDataReady: boolean;
      information: DICOMImageInformation;
      imagePosition: number[];
      imageOrientation: number[];
      wlRenderer: DICOMImageInformationRenderer;
      width: number;
      height: number;
      rowSpacing: number;
      columnSpacing: number;
      projectionOrientation: ProjectionOrientationType;
      patientProjection: string[];
      instanceNumber: number;
      bitPerpixel: number;
      defaultWindowLevelWidth: number; // read-only
      defaultWindowLevelCenter: number; // read-only
      windowWidth: number; // read-only
      windowCenter: number; // read-only
      minValue: number;
      maxValue: number;
      lowBit: number;
      highBit: number;
      bitStored: number;
      rescaleintercept: number;
      rescaleSlope: number;
      voiLUTSequence: number[];
      imageType: string[];
      lossyCompression: boolean;
      isWaveForm: boolean;
      frameOfReferenceID: string;
      photometricInterpretation: string;
      flipped: boolean;
      reversed: boolean;
      rotateAngle: number;
      offsetX: number;
      offsetY: number;
      scale: number;
      scaleMode: MedicalViewerSizeMode; // read-only
      useDPI: boolean;
      isFullImageReceived: boolean; // read-only
      isPNGDataReady: boolean; // read-only
      preview16BitPNG: string;
      drawingCanvas: HTMLCanvasElement; // read-only
      pngDataSrc: string; // read-only
      imageData: number[];
      previewImage: HTMLImageElement;
      requestInterval: number;
      dataSize: lt.LeadSizeD;
      imageURL: string;
      previewURI: string;
      imageDataReady: lt.LeadEventType; // read-only
      windowLevelChanged: lt.LeadEventType; // read-only
      dataChanged: FrameDataChangedEventType; // read-only
      loadImageFailed: lt.LeadEventType; // read-only
      loadInstance: LoadInstanceEventType; // read-only
      requestCanceled: lt.LeadEventType; // read-only
      imageDataError: lt.LeadEventType; // read-only
      previewError: lt.LeadEventType; // read-only
      previewLoaded: lt.LeadEventType; // read-only
      imageDrawn: lt.LeadEventType; // read-only
   }

   class TickBox extends UserControl {
      add_checkChanged(value: lt.LeadEventHandler): void;
      remove_checkChanged(value: lt.LeadEventHandler): void;
      dispose(): void;
      get_size(): number;
      set_size(value: number): void;
      get_checked(): boolean;
      set_checked(value: boolean): void;
      constructor();
      size: number;
      checked: boolean;
      checkChanged: lt.LeadEventType; // read-only
   }

   class UserControl {
      get_element(): HTMLElement;
      set_element(value: HTMLElement): void;
      get_visible(): boolean;
      set_visible(value: boolean): void;
      get_alignment(): Alignment;
      set_alignment(value: Alignment): void;
      get_rectangle(): lt.LeadRectD;
      set_rectangle(value: lt.LeadRectD): void;
      refresh(): void;
      constructor(element: HTMLElement);
      element: HTMLElement;
      visible: boolean;
      alignment: Alignment;
      rectangle: lt.LeadRectD;
   }

   class LeadMatrix3D {
      add_valueChanged(value: lt.LeadEventHandler): void;
      remove_valueChanged(value: lt.LeadEventHandler): void;
      get_values(): number[][];
      set_values(value: number[][]): void;
      static get_identity(): LeadMatrix3D;
      get_isIdentity(): boolean;
      onValueChanged(): void;  // protected
      beginUpdate(): void;
      endUpdate(): void;
      constructor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, offsetX: number, offsetY: number, offsetZ: number, m44: number);
      values: number[][];
      static identity: LeadMatrix3D; // read-only
      isIdentity: boolean; // read-only
      valueChanged: lt.LeadEventType; // read-only
   }

   class LinkedItems {
      add_linkedItem(value: LinkedItemEventHandler): void;
      remove_linkedItem(value: LinkedItemEventHandler): void;
      get_items(): lt.LeadCollection;
      set_items(value: lt.LeadCollection): void;
      apply(userData: any, excludeItem: any): void;
      applyAndExclude(userData: any, excludeItems: any[]): void;
      constructor(items: lt.LeadCollection);
      items: lt.LeadCollection;
      linkedItem: LinkedItemEventType; // read-only
   }

   enum FrameArrangement {
      grid = 0,
      custom = 1,
      rowSymmetric = 2,
      colSymmetric = 3
   }

   enum HorizontalAlignmentType {
      middle = 0,
      left = 1,
      right = 2
   }

   enum MedicalViewerSizeMode {
      none = 0,
      actualSize = 1,
      fit = 2,
      trueSize = 3
   }

   enum VerticalAlignmentType {
      middle = 0,
      top = 1,
      bottom = 2
   }

   interface InteractiveModeDragEventHandler extends lt.LeadEventHandler {
      (sender: any, e: InteractiveModeDragEventArgs): void;
   }

   class InteractiveModeDragEventType extends lt.LeadEvent {
      add(value: InteractiveModeDragEventHandler): InteractiveModeDragEventHandler;
      remove(value: InteractiveModeDragEventHandler): void;
   }

   class InteractiveModeDragEventArgs extends lt.LeadEventArgs {
      get_item(): lt.Controls.ImageViewerItem;
      get_change(): lt.LeadPointD;
      constructor(item: lt.Controls.ImageViewerItem, change: lt.LeadPointD);
      item: lt.Controls.ImageViewerItem; // read-only
      change: lt.LeadPointD; // read-only
   }

   interface LayoutManagerItemEventHandler extends lt.LeadEventHandler {
      (sender: any, e: LayoutManagerItemEventArgs): void;
   }

   class LayoutManagerItemEventType extends lt.LeadEvent {
      add(value: LayoutManagerItemEventHandler): LayoutManagerItemEventHandler;
      remove(value: LayoutManagerItemEventHandler): void;
   }

   class LayoutManagerItemEventArgs extends lt.LeadEventArgs {
      get_item(): LayoutManagerItem;
      constructor(item: LayoutManagerItem);
      item: LayoutManagerItem; // read-only
   }

   interface LinkedChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: LinkedChangedEventArgs): void;
   }

   class LinkedChangedEventType extends lt.LeadEvent {
      add(value: LinkedChangedEventHandler): LinkedChangedEventHandler;
      remove(value: LinkedChangedEventHandler): void;
   }

   class LinkedChangedEventArgs extends LayoutManagerItemEventArgs {
      get_linked(): boolean;
      constructor(item: LayoutManagerItem, linked: boolean);
      linked: boolean; // read-only
   }

   interface LinkedItemEventHandler extends lt.LeadEventHandler {
      (sender: any, e: LinkedItemEventArgs): void;
   }

   class LinkedItemEventType extends lt.LeadEvent {
      add(value: LinkedItemEventHandler): LinkedItemEventHandler;
      remove(value: LinkedItemEventHandler): void;
   }

   class LinkedItemEventArgs extends lt.LeadEventArgs {
      get_item(): any;
      get_userData(): any;
      constructor(item: any, userData: any);
      item: any; // read-only
      userData: any; // read-only
   }

   class LinkFrames {
      add_linkedFrame(value: LinkedItemEventHandler): void;
      remove_linkedFrame(value: LinkedItemEventHandler): void;
      get_linked(): boolean;
      set_linked(value: boolean): void;
      get_frames(): lt.LeadCollection;
      set_frames(value: lt.LeadCollection): void;
      apply(frame: Frame, userData: any): void;
      constructor(frames: lt.LeadCollection);
      linked: boolean;
      frames: lt.LeadCollection;
      linkedFrame: LinkedItemEventType; // read-only
   }

   class TextArea {
      get_nativeElement(): HTMLElement;
      get_text(): string;
      set_text(value: string): void;
      get_textAlign(): string;
      set_textAlign(value: string): void;
      get_color(): string;
      set_color(value: string): void;
      get_displayRectangle(): lt.LeadRectD;
      set_displayRectangle(value: lt.LeadRectD): void;
      dispose(): void;
      constructor(text: string);
      nativeElement: HTMLElement; // read-only
      text: string;
      textAlign: string;
      color: string;
      displayRectangle: lt.LeadRectD;
   }

   class CTRTool extends Drawable {
      add_disposing(value: lt.LeadEventHandler): void;
      remove_disposing(value: lt.LeadEventHandler): void;
      dispose(): void;
      handleDragStarted(item: lt.Controls.ImageViewerItem, x: number, y: number, e: DrawableEventArgs): void;
      handleDragDelta(x: number, y: number, args: DrawableEventArgs): void;
      handleDragCompleted(x: number, y: number, args: DrawableEventArgs): void;
      draw(item: lt.Controls.ImageViewerItem, context: CanvasRenderingContext2D, rect: lt.LeadRectD): void;
      hitTest(item: lt.Controls.ImageViewerItem, x: number, y: number): boolean;
      constructor(frame: Frame);
      disposing: lt.LeadEventType; // read-only
   }

   class PanoramicPolygon extends Drawable {
      get_length(): number;
      get_panoramicCell(): PanoramicCell;
      set_panoramicCell(value: PanoramicCell): void;
      get_paraxialSlices(): lt.LeadCollection;
      createSlice(frames: SliceFrame[], item: lt.Controls.ImageViewerItem, point: lt.LeadPointD, distance: number, length: number): void;
      add_clicked(value: lt.Controls.InteractiveEventHandler): void;
      remove_clicked(value: lt.Controls.InteractiveEventHandler): void;
      get_thickness(): number;
      set_thickness(value: number): void;
      get_angle(): number;
      set_angle(value: number): void;
      get_type(): VolumeType;
      set_type(value: VolumeType): void;
      refresh(): void;
      get_points(): lt.LeadCollection;
      get_curvePoint(): lt.LeadPointD[];
      handleMove(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      handleDoubleTap(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      drawStarted(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      handleDragStarted(item: lt.Controls.ImageViewerItem, x: number, y: number, e: DrawableEventArgs): void;
      handleDragDelta(x: number, y: number, args: DrawableEventArgs): void;
      handleDragCompleted(x: number, y: number, args: DrawableEventArgs): void;
      add_panoramicUpdated(value: PanoramicChangedEventHandler): void;
      remove_panoramicUpdated(value: PanoramicChangedEventHandler): void;
      add_panoramicGenerated(value: PanoramicChangedEventHandler): void;
      remove_panoramicGenerated(value: PanoramicChangedEventHandler): void;
      dispose(): void;
      invalidate(): void;
      draw(item: lt.Controls.ImageViewerItem, context: CanvasRenderingContext2D, rect: lt.LeadRectD): void;
      get_visible(): boolean;
      set_visible(value: boolean): void;
      get_hitTestResult(): DrawablePart;
      get_hitTestIndex(): number;
      hitTest(item: lt.Controls.ImageViewerItem, x: number, y: number): boolean;
      constructor(cell: Cell);
      length: number; // read-only
      panoramicCell: PanoramicCell;
      paraxialSlices: lt.LeadCollection; // read-only
      thickness: number;
      angle: number;
      type: VolumeType;
      points: lt.LeadCollection; // read-only
      curvePoint: lt.LeadPointD[]; // read-only
      visible: boolean;
      hitTestResult: DrawablePart; // read-only
      hitTestIndex: number; // read-only
      clicked: lt.Controls.InteractiveEventType; // read-only
      panoramicUpdated: PanoramicChangedEventType; // read-only
      panoramicGenerated: PanoramicChangedEventType; // read-only
   }

   class RotationTool extends Drawable {
      add_orientationChanged(value: OrientationChangedEventHandler): void;
      remove_orientationChanged(value: OrientationChangedEventHandler): void;
      refresh(): void;
      get_cells(): LayoutManagerItem[];
      set_cells(value: LayoutManagerItem[]): void;
      get_center(): lt.LeadPointD;
      set_center(value: lt.LeadPointD): void;
      get_angle(): number;
      set_angle(value: number): void;
      draw(item: lt.Controls.ImageViewerItem, context: CanvasRenderingContext2D, rect: lt.LeadRectD): void;
      get_visible(): boolean;
      set_visible(value: boolean): void;
      dispose(): void;
      hitTest(item: lt.Controls.ImageViewerItem, x: number, y: number): boolean;
      handleDragStarted(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      handleDragDelta(x: number, y: number, args: DrawableEventArgs): void;
      handleDragCompleted(x: number, y: number, args: DrawableEventArgs): void;
      constructor();
      cells: LayoutManagerItem[];
      center: lt.LeadPointD;
      angle: number;
      visible: boolean;
      orientationChanged: OrientationChangedEventType; // read-only
   }

   class ShutterObject extends Drawable {
      static isValid(annotationobject: lt.Annotations.Engine.AnnObject): boolean;
      dispose(): void;
      draw(item: lt.Controls.ImageViewerItem, context: CanvasRenderingContext2D, rect: lt.LeadRectD): void;
      get_fillStyle(): string;
      set_fillStyle(value: string): void;
      get_objects(): lt.LeadCollection;
      constructor();
      fillStyle: string;
      objects: lt.LeadCollection; // read-only
   }

   enum DrawablePart {
      none = 0,
      handle = 1,
      line = 2,
      thickness = 4,
      center = 8,
      paraxialHandle = 16,
      paraxialLine = 32
   }

   enum FrameChangingFlag {
      ok = 0,
      cancel = 1,
      skip = 2
   }

   enum PlayingDirection {
      forward = 0,
      backward = 1,
      shuffle = 2,
      sweep = 3
   }

   enum ScrollType {
      none = 0,
      normal = 1,
      row = 2,
      column = 3,
      page = 4
   }

   enum StackSynchronizationCriteria {
      imagePosition = 0,
      anatomy = 1,
      tag = 2,
      custom = 3,
      index = -1
   }

   enum WindowLevelPaletteType {
      gray = 0,
      cool = 1,
      cyanHot = 2,
      fire = 3,
      icA2 = 4,
      ice = 5,
      orangeHot = 6,
      rainbowRGB = 7,
      redHot = 8,
      spectrum = 9,
      custom = 10
   }

   interface AnimationEventHandler extends lt.LeadEventHandler {
      (sender: any, e: AnimationEventArgs): void;
   }

   class AnimationEventType extends lt.LeadEvent {
      add(value: AnimationEventHandler): AnimationEventHandler;
      remove(value: AnimationEventHandler): void;
   }

   class AnimationEventArgs extends CancelableEventArgs {
      constructor();
   }

   interface CancelableEventHandler extends lt.LeadEventHandler {
      (sender: any, e: CancelableEventArgs): void;
   }

   class CancelableEventType extends lt.LeadEvent {
      add(value: CancelableEventHandler): CancelableEventHandler;
      remove(value: CancelableEventHandler): void;
   }

   class CancelableEventArgs extends lt.LeadEventArgs {
      get_cancel(): boolean;
      set_cancel(value: boolean): void;
      constructor();
      cancel: boolean;
   }

   class Cursor3DInteractiveMode extends MedicalViewerInteractiveMode {
      get_id(): number;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      static get3DPointPosition(frame: Frame, point: lt.LeadPointD): number[];
      get_scroll(): boolean;
      set_scroll(value: boolean): void;
      get_name(): string;
      constructor();
      id: number; // read-only
      scroll: boolean;
      name: string; // read-only
   }

   interface FrameChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: FrameChangedEventArgs): void;
   }

   class FrameChangedEventType extends lt.LeadEvent {
      add(value: FrameChangedEventHandler): FrameChangedEventHandler;
      remove(value: FrameChangedEventHandler): void;
   }

   class FrameChangedEventArgs extends lt.LeadEventArgs {
      get_frameIndex(): number;
      constructor(frameIndex: number);
      frameIndex: number; // read-only
   }

   interface FrameChangingEventHandler extends lt.LeadEventHandler {
      (sender: any, e: FrameChangingEventArgs): void;
   }

   class FrameChangingEventType extends lt.LeadEvent {
      add(value: FrameChangingEventHandler): FrameChangingEventHandler;
      remove(value: FrameChangingEventHandler): void;
   }

   class FrameChangingEventArgs extends lt.LeadEventArgs {
      get_newFrameIndex(): number;
      set_newFrameIndex(value: number): void;
      get_oldFrameIndex(): number;
      set_oldFrameIndex(value: number): void;
      get_change(): FrameChangingFlag;
      set_change(value: FrameChangingFlag): void;
      constructor(newFrameIndex: number, oldFrameIndex: number);
      newFrameIndex: number;
      oldFrameIndex: number;
      change: FrameChangingFlag;
   }

   interface HistogramGeneratedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: HistogramGeneratedEventArgs): void;
   }

   class HistogramGeneratedEventType extends lt.LeadEvent {
      add(value: HistogramGeneratedEventHandler): HistogramGeneratedEventHandler;
      remove(value: HistogramGeneratedEventHandler): void;
   }

   class HistogramGeneratedEventArgs extends lt.LeadEventArgs {
      get_histogram(): number[];
      get_frame(): Frame;
      get_type(): ColorType;
      constructor(histogram: number[], frame: Frame, type: ColorType);
      histogram: number[]; // read-only
      frame: Frame; // read-only
      type: ColorType; // read-only
   }

   interface OrientationChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: OrientationChangedEventArgs): void;
   }

   class OrientationChangedEventType extends lt.LeadEvent {
      add(value: OrientationChangedEventHandler): OrientationChangedEventHandler;
      remove(value: OrientationChangedEventHandler): void;
   }

   class OrientationChangedEventArgs extends lt.LeadEventArgs {
      get_orientation(): number[];
      get_position(): number[];
      constructor(orientation: number[], position: number[]);
      orientation: number[]; // read-only
      position: number[]; // read-only
   }

   interface PolygonEditEventHandler extends lt.LeadEventHandler {
      (sender: any, e: PolygonEditEventArgs): void;
   }

   class PolygonEditEventType extends lt.LeadEvent {
      add(value: PolygonEditEventHandler): PolygonEditEventHandler;
      remove(value: PolygonEditEventHandler): void;
   }

   class PolygonEditEventArgs extends lt.Controls.InteractiveEventArgs {
      get_index(): number;
      get_part(): DrawablePart;
      constructor(part: DrawablePart, index: number, x: number, y: number, button: lt.Controls.MouseButtons);
      index: number; // read-only
      part: DrawablePart; // read-only
   }

   interface StackChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: StackChangedEventArgs): void;
   }

   class StackChangedEventType extends lt.LeadEvent {
      add(value: StackChangedEventHandler): StackChangedEventHandler;
      remove(value: StackChangedEventHandler): void;
   }

   class StackChangedEventArgs extends lt.LeadEventArgs {
      get_scrollDelta(): number;
      constructor(scrollDelta: number);
      scrollDelta: number; // read-only
   }

   interface StackChangingEventHandler extends lt.LeadEventHandler {
      (sender: any, e: StackChangingEventArgs): void;
   }

   class StackChangingEventType extends lt.LeadEvent {
      add(value: StackChangingEventHandler): StackChangingEventHandler;
      remove(value: StackChangingEventHandler): void;
   }

   class StackChangingEventArgs extends StackChangedEventArgs {
      get_scroll(): boolean;
      set_scroll(value: boolean): void;
      constructor(scrollDelta: number);
      scroll: boolean;
   }

   interface StatusChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: StatusChangedEventArgs): void;
   }

   class StatusChangedEventType extends lt.LeadEvent {
      add(value: StatusChangedEventHandler): StatusChangedEventHandler;
      remove(value: StatusChangedEventHandler): void;
   }

   class StatusChangedEventArgs extends lt.LeadEventArgs {
      get_status(): Object3DStatus;
      get_message(): string;
      constructor(status: Object3DStatus, message: string);
      status: Object3DStatus; // read-only
      message: string; // read-only
   }

   class LeadPoint3D {
      toArray(): number[];
      toVector(): number[];
      clone(): LeadPoint3D;
      equal(target: LeadPoint3D, threshold: number): boolean;
      get_x(): number;
      set_x(value: number): void;
      get_y(): number;
      set_y(value: number): void;
      get_z(): number;
      set_z(value: number): void;
      static fromArray(value: number[]): LeadPoint3D;
      static fromVector(value: number[]): LeadPoint3D;
      static create(x: number, y: number, z: number): LeadPoint3D;
      static get_empty(): LeadPoint3D;
      constructor(x: number, y: number, z: number);
      x: number;
      y: number;
      z: number;
      static empty: LeadPoint3D; // read-only
   }

   class CutLines extends Drawable {
      dispose(): void;
      get_center(): lt.LeadPointD;
      set_center(value: lt.LeadPointD): void;
      add_clicked(value: lt.Controls.InteractiveEventHandler): void;
      remove_clicked(value: lt.Controls.InteractiveEventHandler): void;
      get_firstLineCell(): Derivative3D;
      set_firstLineCell(value: Derivative3D): void;
      get_secondLineCell(): Derivative3D;
      set_secondLineCell(value: Derivative3D): void;
      get_thickness(): number;
      set_thickness(value: number): void;
      get_angle(): number;
      set_angle(value: number): void;
      get_doubleCutLine(): boolean;
      get_length(): number;
      set_length(value: number): void;
      refresh(): void;
      handleDragStarted(item: lt.Controls.ImageViewerItem, x: number, y: number, e: DrawableEventArgs): void;
      handleDragDelta(x: number, y: number, args: DrawableEventArgs): void;
      handleDragCompleted(x: number, y: number, args: DrawableEventArgs): void;
      draw(item: lt.Controls.ImageViewerItem, context: CanvasRenderingContext2D, rect: lt.LeadRectD): void;
      get_visible(): boolean;
      set_visible(value: boolean): void;
      get_hitTestResult(): DrawablePart;
      get_hitTestIndex(): number;
      hitTest(item: lt.Controls.ImageViewerItem, x: number, y: number): boolean;
      constructor(cell: Cell);
      center: lt.LeadPointD;
      firstLineCell: Derivative3D;
      secondLineCell: Derivative3D;
      thickness: number;
      angle: number;
      doubleCutLine: boolean; // read-only
      length: number;
      visible: boolean;
      hitTestResult: DrawablePart; // read-only
      hitTestIndex: number; // read-only
      clicked: lt.Controls.InteractiveEventType; // read-only
   }

   interface DrawableEventHandler extends lt.LeadEventHandler {
      (sender: any, e: DrawableEventArgs): void;
   }

   class DrawableEventType extends lt.LeadEvent {
      add(value: DrawableEventHandler): DrawableEventHandler;
      remove(value: DrawableEventHandler): void;
   }

   class DrawableEventArgs extends lt.LeadEventArgs {
      get_position(): lt.LeadPointD;
      get_change(): lt.LeadPointD;
      constructor(position: lt.LeadPointD, change: lt.LeadPointD);
      position: lt.LeadPointD; // read-only
      change: lt.LeadPointD; // read-only
   }

   interface FrameDataChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: FrameDataChangedEventArgs): void;
   }

   class FrameDataChangedEventType extends lt.LeadEvent {
      add(value: FrameDataChangedEventHandler): FrameDataChangedEventHandler;
      remove(value: FrameDataChangedEventHandler): void;
   }

   class FrameDataChangedEventArgs extends lt.LeadEventArgs {
      get_type(): FrameDataChangedType;
      constructor(type: FrameDataChangedType);
      type: FrameDataChangedType; // read-only
   }

   enum FrameDataChangedType {
      windowLevel = 0,
      instanceNumber = 1,
      imageQuality = 2,
      orientation = 3,
      mprType = 4,
      laterality = 5,
      fieldOfView = 6
   }

   interface LoadInstanceEventHandler extends lt.LeadEventHandler {
      (sender: any, e: LoadInstanceEventArgs): void;
   }

   class LoadInstanceEventType extends lt.LeadEvent {
      add(value: LoadInstanceEventHandler): LoadInstanceEventHandler;
      remove(value: LoadInstanceEventHandler): void;
   }

   class LoadInstanceEventArgs extends lt.LeadEventArgs {
      get_frame(): Frame;
      get_sopInstanceUID(): string;
      get_studyInstanceUID(): string;
      get_seriesInstanceUID(): string;
      constructor(frame: Frame, studyInstanceUID: string, seriesInstanceUID: string, sopInstanceUID: string);
      frame: Frame; // read-only
      sopInstanceUID: string; // read-only
      studyInstanceUID: string; // read-only
      seriesInstanceUID: string; // read-only
   }

   interface PanoramicChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: PanoramicChangedEventArgs): void;
   }

   class PanoramicChangedEventType extends lt.LeadEvent {
      add(value: PanoramicChangedEventHandler): PanoramicChangedEventHandler;
      remove(value: PanoramicChangedEventHandler): void;
   }

   class PanoramicChangedEventArgs extends lt.LeadEventArgs {
      get_points(): lt.LeadCollection;
      constructor(points: lt.LeadCollection);
      points: lt.LeadCollection; // read-only
   }

   class ImageViewerTransformInteractiveMode extends MedicalViewerInteractiveMode {
      add_pinchWorkCompleted(value: lt.LeadEventHandler): void;
      remove_pinchWorkCompleted(value: lt.LeadEventHandler): void;
      add_pinchWorkStarted(value: lt.LeadEventHandler): void;
      remove_pinchWorkStarted(value: lt.LeadEventHandler): void;
      add_pinchWorkDelta(value: lt.LeadEventHandler): void;
      remove_pinchWorkDelta(value: lt.LeadEventHandler): void;
      get_enablePan(): boolean;
      set_enablePan(value: boolean): void;
      get_enableZoom(): boolean;
      set_enableZoom(value: boolean): void;
      get_inverted(): boolean;
      set_inverted(value: boolean): void;
      get_isPinch(): boolean;
      set_isPinch(value: boolean): void;
      get_scaleAtPosition(): boolean;
      set_scaleAtPosition(value: boolean): void;
      get_scaleKeyModifier(): lt.Controls.Keys;
      set_scaleKeyModifier(value: lt.Controls.Keys): void;
      get_name(): string;
      get_id(): number;
      start(imageViewer: lt.Controls.ImageViewer): void;
      stop(imageViewer: lt.Controls.ImageViewer): void;
      constructor(zoom: boolean);
      enablePan: boolean;
      enableZoom: boolean;
      inverted: boolean;
      isPinch: boolean;
      scaleAtPosition: boolean;
      scaleKeyModifier: lt.Controls.Keys;
      name: string; // read-only
      id: number; // read-only
      pinchWorkCompleted: lt.LeadEventType; // read-only
      pinchWorkStarted: lt.LeadEventType; // read-only
      pinchWorkDelta: lt.LeadEventType; // read-only
   }

   class LineProfileInteractiveMode extends MedicalViewerInteractiveMode {
      get_name(): string;
      get_id(): number;
      get_histogramMarker(): number;
      set_histogramMarker(value: number): void;
      get_histogramColorType(): ColorType;
      set_histogramColorType(value: ColorType): void;
      refresh(cell: Cell): void;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      constructor();
      name: string; // read-only
      id: number; // read-only
      histogramMarker: number;
      histogramColorType: ColorType;
   }

   class SpyGlassInteractiveMode extends lt.Controls.ImageViewerMagnifyGlassInteractiveMode {
      add_imageRequested(value: SpyGlassEventHandler): void;
      remove_imageRequested(value: SpyGlassEventHandler): void;
      add_positionChanged(value: SpyGlassPositionChangedEventHandler): void;
      remove_positionChanged(value: SpyGlassPositionChangedEventHandler): void;
      add_chunkLoaded(value: ChunkLoadedEventHandler): void;
      remove_chunkLoaded(value: ChunkLoadedEventHandler): void;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      dispose(): void;
      refresh(): void;
      get_scale(): number;
      set_scale(value: number): void;
      get_text(): string;
      set_text(value: string): void;
      get_showOverlayText(): boolean;
      set_showOverlayText(value: boolean): void;
      get_name(): string;
      get_resizeGlassOnScroll(): boolean;
      set_resizeGlassOnScroll(value: boolean): void;
      constructor();
      scale: number;
      text: string;
      showOverlayText: boolean;
      name: string; // read-only
      resizeGlassOnScroll: boolean;
      imageRequested: SpyGlassEventType; // read-only
      positionChanged: SpyGlassPositionChangedEventType; // read-only
      chunkLoaded: ChunkLoadedEventType; // read-only
   }

   class StackInteractiveMode extends MedicalViewerInteractiveMode {
      add_stackChanged(value: StackChangedEventHandler): void;
      remove_stackChanged(value: StackChangedEventHandler): void;
      add_stackChanging(value: StackChangingEventHandler): void;
      remove_stackChanging(value: StackChangingEventHandler): void;
      get_id(): number;
      get_sensitivity(): number;
      set_sensitivity(value: number): void;
      get_currentFrame(): number;
      set_currentFrame(value: number): void;
      get_totalFrames(): number;
      set_totalFrames(value: number): void;
      get_enableWheel(): boolean;
      set_enableWheel(value: boolean): void;
      get_scrollStep(): number;
      set_scrollStep(value: number): void;
      get_name(): string;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      constructor();
      id: number; // read-only
      sensitivity: number;
      currentFrame: number;
      totalFrames: number;
      enableWheel: boolean;
      scrollStep: number;
      name: string; // read-only
      stackChanged: StackChangedEventType; // read-only
      stackChanging: StackChangingEventType; // read-only
   }

   class StackSynchronization {
      static alignFrames(frameToAlign: Frame, referencePoint1: LeadPoint3D, cell: Cell, referencePoint2: LeadPoint3D): number;
      constructor();
   }

   class ImageViewerZoomInteractiveMode extends MedicalViewerInteractiveMode {
      get_center(): lt.LeadPointD;
      set_center(value: lt.LeadPointD): void;
      get_offsetBy(): lt.LeadPointD;
      get_inverted(): boolean;
      set_inverted(value: boolean): void;
      get_scaleAtPosition(): boolean;
      set_scaleAtPosition(value: boolean): void;
      get_scaleKeyModifier(): lt.Controls.Keys;
      set_scaleKeyModifier(value: lt.Controls.Keys): void;
      get_name(): string;
      get_id(): number;
      start(imageViewer: lt.Controls.ImageViewer): void;
      stop(imageViewer: lt.Controls.ImageViewer): void;
      apply(frame: Frame, sourceItem: lt.Controls.ImageViewerItem, change: lt.LeadPointD): void;
      constructor();
      center: lt.LeadPointD;
      offsetBy: lt.LeadPointD; // read-only
      inverted: boolean;
      scaleAtPosition: boolean;
      scaleKeyModifier: lt.Controls.Keys;
      name: string; // read-only
      id: number; // read-only
   }

   class ImageViewerTranslateInteractiveMode extends MedicalViewerInteractiveMode {
      add_pinchWorkCompleted(value: lt.LeadEventHandler): void;
      remove_pinchWorkCompleted(value: lt.LeadEventHandler): void;
      add_pinchWorkStarted(value: lt.LeadEventHandler): void;
      remove_pinchWorkStarted(value: lt.LeadEventHandler): void;
      add_pinchWorkDelta(value: lt.LeadEventHandler): void;
      remove_pinchWorkDelta(value: lt.LeadEventHandler): void;
      get_inverted(): boolean;
      set_inverted(value: boolean): void;
      get_isPinch(): boolean;
      set_isPinch(value: boolean): void;
      get_scaleKeyModifier(): lt.Controls.Keys;
      set_scaleKeyModifier(value: lt.Controls.Keys): void;
      get_name(): string;
      get_id(): number;
      start(imageViewer: lt.Controls.ImageViewer): void;
      stop(imageViewer: lt.Controls.ImageViewer): void;
      constructor();
      inverted: boolean;
      isPinch: boolean;
      scaleKeyModifier: lt.Controls.Keys;
      name: string; // read-only
      id: number; // read-only
      pinchWorkCompleted: lt.LeadEventType; // read-only
      pinchWorkStarted: lt.LeadEventType; // read-only
      pinchWorkDelta: lt.LeadEventType; // read-only
   }

   class MagnifyGlassInteractiveMode extends lt.Controls.ImageViewerMagnifyGlassInteractiveMode {
      get_resizeGlassOnScroll(): boolean;
      set_resizeGlassOnScroll(value: boolean): void;
      refresh(): void;
      dispose(): void;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      add_positionChanged(value: lt.Controls.InteractiveDragEventHandler): void;
      remove_positionChanged(value: lt.Controls.InteractiveDragEventHandler): void;
      get_scale(): number;
      set_scale(value: number): void;
      get_name(): string;
      constructor();
      resizeGlassOnScroll: boolean;
      scale: number;
      name: string; // read-only
      positionChanged: lt.Controls.InteractiveDragEventType; // read-only
   }

   class ProbeToolInteractiveMode extends MedicalViewerInteractiveMode {
      add_probeToolUpdated(value: ProbeToolEventHandler): void;
      remove_probeToolUpdated(value: ProbeToolEventHandler): void;
      get_name(): string;
      get_backgroundColor(): string;
      set_backgroundColor(value: string): void;
      get_textColor(): string;
      set_textColor(value: string): void;
      get_showTextBorder(): boolean;
      set_showTextBorder(value: boolean): void;
      get_showBorder(): boolean;
      set_showBorder(value: boolean): void;
      get_id(): number;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      static getPixelValue(frame: Frame, x: number, y: number): number[];
      static getHuFromData(info: DICOMImageInformation, data: number): number;
      static getHuValue(frame: Frame, x: number, y: number, data: number): string;
      dispose(): void;
      constructor();
      name: string; // read-only
      backgroundColor: string;
      textColor: string;
      showTextBorder: boolean;
      showBorder: boolean;
      id: number; // read-only
      probeToolUpdated: ProbeToolEventType; // read-only
   }

   class TransformItemInteractiveMode extends MedicalViewerInteractiveMode {
      get_id(): number;
      get_name(): string;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      constructor();
      id: number; // read-only
      name: string; // read-only
   }

   enum CellsArrangement {
      grid = 0,
      random = 1,
      userStyle = 2
   }

   class UserStyleLayoutOptions {
      get_viewerClassName(): string;
      set_viewerClassName(value: string): void;
      get_cellClassName(): string;
      set_cellClassName(value: string): void;
      get_cellWrapperClassName(): string;
      set_cellWrapperClassName(value: string): void;
      constructor();
      viewerClassName: string;
      cellClassName: string;
      cellWrapperClassName: string;
   }

   enum OperationType {
      MIP = 0,
      VRT = 1,
      avg = 2
   }

   interface MatchedFrameEventHandler extends lt.LeadEventHandler {
      (sender: any, e: MatchedFrameEventArgs): void;
   }

   class MatchedFrameEventType extends lt.LeadEvent {
      add(value: MatchedFrameEventHandler): MatchedFrameEventHandler;
      remove(value: MatchedFrameEventHandler): void;
   }

   class MatchedFrameEventArgs extends CellEventArgs {
      get_targetFrame(): Frame;
      get_matched(): boolean;
      set_matched(value: boolean): void;
      constructor(frame: Frame, targetFrame: Frame);
      targetFrame: Frame; // read-only
      matched: boolean;
   }

   interface ImageURLChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: ImageURLChangedEventArgs): void;
   }

   class ImageURLChangedEventType extends lt.LeadEvent {
      add(value: ImageURLChangedEventHandler): ImageURLChangedEventHandler;
      remove(value: ImageURLChangedEventHandler): void;
   }

   class ImageURLChangedEventArgs extends CellEventArgs {
      constructor(frame: Frame);
   }

   interface ImageProcessingReadyEventHandler extends lt.LeadEventHandler {
      (sender: any, e: ImageProcessingReadyEventArgs): void;
   }

   class ImageProcessingReadyEventType extends lt.LeadEvent {
      add(value: ImageProcessingReadyEventHandler): ImageProcessingReadyEventHandler;
      remove(value: ImageProcessingReadyEventHandler): void;
   }

   class ImageProcessingReadyEventArgs extends lt.LeadEventArgs {
      get_imageProcessing(): lt.ImageProcessing;
      get_frame(): Frame;
      constructor(frame: Frame, imageProcessing: lt.ImageProcessing);
      imageProcessing: lt.ImageProcessing; // read-only
      frame: Frame; // read-only
   }

   enum CanDo3DStatus {
      ok = 0,
      imageOrientationNotTheSame = -5,
      cellNotValid = -4,
      allFramesNotReady = -3,
      imagePositionNotReady = -2,
      notEnoughFrames = -1
   }

   interface FrameAttachedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: FrameAttachedEventArgs): void;
   }

   class FrameAttachedEventType extends lt.LeadEvent {
      add(value: FrameAttachedEventHandler): FrameAttachedEventHandler;
      remove(value: FrameAttachedEventHandler): void;
   }

   class FrameAttachedEventArgs extends lt.LeadEventArgs {
      get_subCell(): SubCell;
      get_frame(): Frame;
      constructor(subCell: SubCell, frame: Frame);
      subCell: SubCell; // read-only
      frame: Frame; // read-only
   }

   interface ScrollChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: ScrollChangedEventArgs): void;
   }

   class ScrollChangedEventType extends lt.LeadEvent {
      add(value: ScrollChangedEventHandler): ScrollChangedEventHandler;
      remove(value: ScrollChangedEventHandler): void;
   }

   class ScrollChangedEventArgs extends lt.LeadEventArgs {
      get_scrollOffset(): number;
      get_previousScrollOffset(): number;
      constructor(previousScrollOffset: number, scrollOffset: number);
      scrollOffset: number; // read-only
      previousScrollOffset: number; // read-only
   }

   enum OverlayTextType {
      windowLevel = 0,
      instanceNumber = 1,
      userData = 2,
      imageQuality = 3,
      frameNumber = 4,
      leftOrientation = 5,
      rightOrientation = 6,
      topOrientation = 7,
      bottomOrientation = 8,
      mprType = 9,
      retakeImage = 10,
      laterality = 11,
      fieldOfView = 12,
      volumeBrightnessContrast = 13
   }

   enum Alignment {
      topLeft = 0,
      topRight = 1,
      bottomLeft = 2,
      bottomRight = 3,
      centerTop = 4,
      centerLeft = 5,
      centerRight = 6,
      centerBottom = 7,
      none = -1
   }

   class CobbAngle {
      add_cobbAngleChanged(value: lt.LeadEventHandler): void;
      remove_cobbAngleChanged(value: lt.LeadEventHandler): void;
      dispose(): void;
      get_line1(): lt.Annotations.Engine.AnnPolylineObject;
      set_line1(value: lt.Annotations.Engine.AnnPolylineObject): void;
      get_line2(): lt.Annotations.Engine.AnnPolylineObject;
      set_line2(value: lt.Annotations.Engine.AnnPolylineObject): void;
      get_angle(): number;
      get_backgroundColor(): string;
      set_backgroundColor(value: string): void;
      get_borderColor(): string;
      set_borderColor(value: string): void;
      draw(context: CanvasRenderingContext2D): void;
      constructor(automation: lt.Annotations.Automation.AnnAutomation, line1: lt.Annotations.Engine.AnnPolylineObject, line2: lt.Annotations.Engine.AnnPolylineObject);
      line1: lt.Annotations.Engine.AnnPolylineObject;
      line2: lt.Annotations.Engine.AnnPolylineObject;
      angle: number; // read-only
      backgroundColor: string;
      borderColor: string;
      cobbAngleChanged: lt.LeadEventType; // read-only
   }

   class ProgressLoading {
      reset(): void;
      get_visible(): boolean;
      set_visible(value: boolean): void;
      draw(context: CanvasRenderingContext2D, displayRect: lt.LeadRectD): void;
      setColor(r: number, g: number, b: number): void;
      set_totalFrames(value: number): void;
      get_totalFrames(): number;
      set_progressPercent(value: number): void;
      get_progressPercent(): number;
      set_progress(value: number): void;
      get_progress(): number;
      constructor(cell: Cell);
      visible: boolean;
      totalFrames: number;
      progressPercent: number;
      progress: number;
   }

   class LineProfileObject {
      get_histogramMarker(): number;
      set_histogramMarker(value: number): void;
      end(): void;
      refresh(): void;
      beginUpdate(): void;
      endUpdate(): void;
      get_logicalStartPoint(): lt.LeadPointD;
      set_logicalStartPoint(value: lt.LeadPointD): void;
      get_logicalEndPoint(): lt.LeadPointD;
      set_logicalEndPoint(value: lt.LeadPointD): void;
      get_physicalStartPoint(): lt.LeadPointD;
      set_physicalStartPoint(value: lt.LeadPointD): void;
      get_physicalEndPoint(): lt.LeadPointD;
      set_physicalEndPoint(value: lt.LeadPointD): void;
      attachFrame(frame: Frame): void;
      add_histogramGenerated(value: HistogramGeneratedEventHandler): void;
      remove_histogramGenerated(value: HistogramGeneratedEventHandler): void;
      draw(context: CanvasRenderingContext2D): void;
      get_histogramColorType(): ColorType;
      set_histogramColorType(value: ColorType): void;
      constructor();
      histogramMarker: number;
      logicalStartPoint: lt.LeadPointD;
      logicalEndPoint: lt.LeadPointD;
      physicalStartPoint: lt.LeadPointD;
      physicalEndPoint: lt.LeadPointD;
      histogramColorType: ColorType;
      histogramGenerated: HistogramGeneratedEventType; // read-only
   }

   interface SpyGlassPositionChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: SpyGlassPositionChangedEventArgs): void;
   }

   class SpyGlassPositionChangedEventType extends lt.LeadEvent {
      add(value: SpyGlassPositionChangedEventHandler): SpyGlassPositionChangedEventHandler;
      remove(value: SpyGlassPositionChangedEventHandler): void;
   }

   class SpyGlassPositionChangedEventArgs extends SpyGlassEventArgs {
      get_chunkList(): ChunkData[];
      get_displayRect(): lt.LeadRectD;
      constructor(inputCanvas: HTMLCanvasElement, outputCanvas: HTMLCanvasElement, displayRect: lt.LeadRectD, subCell: MRTISubCell, chunkList: ChunkData[]);
      chunkList: ChunkData[]; // read-only
      displayRect: lt.LeadRectD; // read-only
   }

   interface SpyGlassEventHandler extends lt.LeadEventHandler {
      (sender: any, e: SpyGlassEventArgs): void;
   }

   class SpyGlassEventType extends lt.LeadEvent {
      add(value: SpyGlassEventHandler): SpyGlassEventHandler;
      remove(value: SpyGlassEventHandler): void;
   }

   class SpyGlassEventArgs extends lt.LeadEventArgs {
      get_subCell(): MRTISubCell;
      get_inputCanvas(): HTMLCanvasElement;
      set_inputCanvas(value: HTMLCanvasElement): void;
      get_outputCanvas(): HTMLCanvasElement;
      set_outputCanvas(value: HTMLCanvasElement): void;
      get_userData(): any;
      set_userData(value: any): void;
      constructor(inputCanvas: HTMLCanvasElement, outputCanvas: HTMLCanvasElement, subCell: MRTISubCell);
      subCell: MRTISubCell; // read-only
      inputCanvas: HTMLCanvasElement;
      outputCanvas: HTMLCanvasElement;
      userData: any;
   }

   interface ProbeToolEventHandler extends lt.LeadEventHandler {
      (sender: any, e: ProbeToolEventArgs): void;
   }

   class ProbeToolEventType extends lt.LeadEvent {
      add(value: ProbeToolEventHandler): ProbeToolEventHandler;
      remove(value: ProbeToolEventHandler): void;
   }

   class ProbeToolEventArgs extends lt.LeadEventArgs {
      get_position(): lt.LeadPointD;
      get_pixelValue(): string;
      set_pixelValue(value: string): void;
      get_target(): Frame;
      constructor(position: lt.LeadPointD, target: Frame);
      position: lt.LeadPointD; // read-only
      pixelValue: string;
      target: Frame; // read-only
   }

   enum ColorType {
      auto = 0,
      RGB = 1,
      gray = 2
   }

   enum VolumeType {
      VRT = 0,
      SSD = 1,
      MIP = 2,
      MPR = 3,
      minIP = 4
   }

   enum Interactive3DAction {
      offset = 0,
      scale = 1,
      windowLevel = 2,
      rotate3D = 3
   }

   class MPRVolumeProperties {
      get_enableCrossLines(): boolean;
      set_enableCrossLines(value: boolean): void;
      get_axialPosition(): number;
      set_axialPosition(value: number): void;
      get_sagittalPosition(): number;
      set_sagittalPosition(value: number): void;
      get_coronalPosition(): number;
      set_coronalPosition(value: number): void;
      constructor(parent: Cell3D);
      enableCrossLines: boolean;
      axialPosition: number;
      sagittalPosition: number;
      coronalPosition: number;
   }

   class VolumeProperties {
      get_enableClippingFrame(): boolean;
      set_enableClippingFrame(value: boolean): void;
      get_lowResQuality(): number;
      set_lowResQuality(value: number): void;
      constructor(parent: Cell3D);
      enableClippingFrame: boolean;
      lowResQuality: number;
   }

   enum ProjectionMethod {
      orthogonal = 0,
      perspective = 1
   }

   enum OrientationFace {
      right = 0,
      left = 1,
      posterior = 2,
      anterior = 3,
      superior = 4,
      inferior = 5,
      reset = -1
   }

   interface PrepareWebServiceCallEventHandler extends lt.LeadEventHandler {
      (sender: any, e: PrepareWebServiceCallEventArgs): void;
   }

   class PrepareWebServiceCallEventType extends lt.LeadEvent {
      add(value: PrepareWebServiceCallEventHandler): PrepareWebServiceCallEventHandler;
      remove(value: PrepareWebServiceCallEventHandler): void;
   }

   class PrepareWebServiceCallEventArgs extends lt.LeadEventArgs {
      get_sourceClass(): string;
      set_sourceClass(value: string): void;
      get_sourceMethod(): string;
      set_sourceMethod(value: string): void;
      get_serviceCall(): string;
      set_serviceCall(value: string): void;
      get_headersObject(): any;
      set_headersObject(value: any): void;
      get_cancel(): boolean;
      set_cancel(value: boolean): void;
      constructor();
      sourceClass: string;
      sourceMethod: string;
      serviceCall: string;
      headersObject: any;
      cancel: boolean;
   }

   interface PrepareWebServiceCallDelegate {
      (args: PrepareWebServiceCallEventArgs): string;
   }

   class WebServiceCall {
      static add_prepareWebServiceCall(value: PrepareWebServiceCallDelegate): void;
      static remove_prepareWebServiceCall(value: PrepareWebServiceCallDelegate): void;
      static prepareWebServiceCall: PrepareWebServiceCallDelegate; // read-only
   }

   class ChunkData {
      get_canvas(): HTMLCanvasElement;
      set_canvas(value: HTMLCanvasElement): void;
      get_backCanvas(): HTMLCanvasElement;
      set_backCanvas(value: HTMLCanvasElement): void;
      get_resolution(): lt.LeadSizeD;
      set_resolution(value: lt.LeadSizeD): void;
      get_userData(): any;
      set_userData(value: any): void;
      get_filters(): any;
      set_filters(value: any): void;
      get_rect(): lt.LeadRectD;
      set_rect(value: lt.LeadRectD): void;
      dispose(): void;
      equal(chunk: ChunkData): boolean;
      clone(): ChunkData;
      constructor(image: HTMLImageElement, rect: lt.LeadRectD, resolution: lt.LeadSizeD, canvas: HTMLCanvasElement);
      canvas: HTMLCanvasElement;
      backCanvas: HTMLCanvasElement;
      resolution: lt.LeadSizeD;
      userData: any;
      filters: any;
      rect: lt.LeadRectD;
   }

   interface FrameRequestedSrcEventHandler extends lt.LeadEventHandler {
      (sender: any, e: FrameRequestedSrcEventArgs): void;
   }

   class FrameRequestedSrcEventType extends lt.LeadEvent {
      add(value: FrameRequestedSrcEventHandler): FrameRequestedSrcEventHandler;
      remove(value: FrameRequestedSrcEventHandler): void;
   }

   class FrameRequestedSrcEventArgs extends lt.LeadEventArgs {
      get_frame(): Frame;
      get_src(): string;
      set_src(value: string): void;
      constructor(frame: Frame, src: string);
      frame: Frame; // read-only
      src: string;
   }

   class OverlayText {
      add_changed(value: lt.LeadEventHandler): void;
      remove_changed(value: lt.LeadEventHandler): void;
      add_textChanged(value: lt.LeadEventHandler): void;
      remove_textChanged(value: lt.LeadEventHandler): void;
      add_layoutChanged(value: lt.LeadEventHandler): void;
      remove_layoutChanged(value: lt.LeadEventHandler): void;
      get_id(): string;
      get_text(): string;
      set_text(value: string): void;
      get_positionIndex(): number;
      set_positionIndex(value: number): void;
      get_alignment(): Alignment;
      set_alignment(value: Alignment): void;
      get_type(): OverlayTextType;
      set_type(value: OverlayTextType): void;
      get_color(): string;
      set_color(value: string): void;
      get_weight(): number;
      set_weight(value: number): void;
      constructor();
      id: string; // read-only
      text: string;
      positionIndex: number;
      alignment: Alignment;
      type: OverlayTextType;
      color: string;
      weight: number;
      changed: lt.LeadEventType; // read-only
      textChanged: lt.LeadEventType; // read-only
      layoutChanged: lt.LeadEventType; // read-only
   }

   class OverlayTextArea extends TextArea {
      get_overlay(): OverlayText;
      set_overlay(value: OverlayText): void;
      dispose(): void;
      constructor(overlay: OverlayText);
      overlay: OverlayText;
   }

   class CinePlayer {
      add_frameChanged(value: FrameChangedEventHandler): void;
      remove_frameChanged(value: FrameChangedEventHandler): void;
      add_animationStarted(value: AnimationEventHandler): void;
      remove_animationStarted(value: AnimationEventHandler): void;
      add_animationStopped(value: AnimationEventHandler): void;
      remove_animationStopped(value: AnimationEventHandler): void;
      add_frameChanging(value: FrameChangingEventHandler): void;
      remove_frameChanging(value: FrameChangingEventHandler): void;
      get_isPlaying(): boolean;
      get_totalFrames(): number;
      set_totalFrames(value: number): void;
      get_currentFrame(): number;
      set_currentFrame(value: number): void;
      get_FPS(): number;
      set_FPS(value: number): void;
      get_loop(): boolean;
      set_loop(value: boolean): void;
      get_direction(): PlayingDirection;
      set_direction(value: PlayingDirection): void;
      get_maxSkip(): number;
      set_maxSkip(value: number): void;
      dispose(): void;
      play(): void;
      stop(): void;
      constructor();
      isPlaying: boolean; // read-only
      totalFrames: number;
      currentFrame: number;
      FPS: number;
      loop: boolean;
      direction: PlayingDirection;
      maxSkip: number;
      frameChanged: FrameChangedEventType; // read-only
      animationStarted: AnimationEventType; // read-only
      animationStopped: AnimationEventType; // read-only
      frameChanging: FrameChangingEventType; // read-only
   }

   class ImageProcessing {
      static getHistogramPoint(imageData: ImageData, threshold: number): lt.LeadPointD;
      static levelIntensity(imageData: ImageData, low: number, high: number): void;
      static stretchIntensity(imageData: ImageData, threshold: number): void;
      static getHistogram(frame: Frame): number[];
      static updateMinMaxValue(info: DICOMImageInformation): void;
      constructor();
   }

   class AutomationImageViewer extends lt.Controls.ImageViewer {
      endRender(): void;
      get_automationScrollOffset(): lt.LeadPointD;
      get_automationObject(): any;
      set_automationObject(value: any): void;
      automationAttach(container: lt.Annotations.Engine.AnnContainer): void;
      automationDetach(): void;
      add_automationDoubleClick(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      remove_automationDoubleClick(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      get_automationDpiX(): number;
      get_automationDpiY(): number;
      get_automationEnabled(): boolean;
      add_automationEnabledChanged(value: lt.LeadEventHandler): void;
      remove_automationEnabledChanged(value: lt.LeadEventHandler): void;
      get_automationGetContainersCallback(): lt.Annotations.Engine.AnnAutomationControlGetContainersCallback;
      set_automationGetContainersCallback(value: lt.Annotations.Engine.AnnAutomationControlGetContainersCallback): void;
      add_automationGotFocus(value: lt.LeadEventHandler): void;
      remove_automationGotFocus(value: lt.LeadEventHandler): void;
      automationInvalidate(invalidateRect: lt.LeadRectD): void;
      add_automationLostFocus(value: lt.LeadEventHandler): void;
      remove_automationLostFocus(value: lt.LeadEventHandler): void;
      add_automationPointerDown(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      remove_automationPointerDown(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      add_automationPointerMove(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      remove_automationPointerMove(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      add_automationPointerUp(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      remove_automationPointerUp(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      add_automationSizeChanged(value: lt.LeadEventHandler): void;
      remove_automationSizeChanged(value: lt.LeadEventHandler): void;
      get_automationTransform(): lt.LeadMatrix;
      add_automationTransformChanged(value: lt.LeadEventHandler): void;
      remove_automationTransformChanged(value: lt.LeadEventHandler): void;
      get_automationUseDpi(): boolean;
      add_automationUseDpiChanged(value: lt.LeadEventHandler): void;
      remove_automationUseDpiChanged(value: lt.LeadEventHandler): void;
      get_automationXResolution(): number;
      get_automationYResolution(): number;
      get_renderingEngine(): lt.Annotations.Engine.AnnRenderingEngine;
      set_renderingEngine(value: lt.Annotations.Engine.AnnRenderingEngine): void;
      onItemChanged(e: lt.Controls.ImageViewerItemChangedEventArgs): void;  // protected
      onTransformChanged(e: lt.LeadEventArgs): void;
      onAutomationPointerDown(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
      onAutomationPointerMove(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
      onAutomationPointerUp(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
      onAutomationDoubleClick(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
      get_automationDataProvider(): lt.Annotations.Engine.AnnDataProvider;
      set_automationDataProvider(value: lt.Annotations.Engine.AnnDataProvider): void;
      get_automationAntiAlias(): boolean;
      set_automationAntiAlias(value: boolean): void;
      get_automationContainerIndex(): number;
      set_automationContainerIndex(value: number): void;
      get_automationRotateAngle(): number;
      get_automationScaleFactor(): number;
      get_isAutomationEventsHooked(): boolean;
      set_isAutomationEventsHooked(value: boolean): void;
      constructor(createOptions: lt.Controls.ImageViewerCreateOptions, divID: string);
      automationScrollOffset: lt.LeadPointD; // read-only
      automationObject: any;
      automationDpiX: number; // read-only
      automationDpiY: number; // read-only
      automationEnabled: boolean; // read-only
      automationGetContainersCallback: lt.Annotations.Engine.AnnAutomationControlGetContainersCallback;
      automationTransform: lt.LeadMatrix; // read-only
      automationUseDpi: boolean; // read-only
      automationXResolution: number; // read-only
      automationYResolution: number; // read-only
      renderingEngine: lt.Annotations.Engine.AnnRenderingEngine;
      automationDataProvider: lt.Annotations.Engine.AnnDataProvider;
      automationAntiAlias: boolean;
      automationContainerIndex: number;
      automationRotateAngle: number; // read-only
      automationScaleFactor: number; // read-only
      isAutomationEventsHooked: boolean;
      automationDoubleClick: lt.Annotations.Engine.AnnPointerEventType; // read-only
      automationEnabledChanged: lt.LeadEventType; // read-only
      automationGotFocus: lt.LeadEventType; // read-only
      automationLostFocus: lt.LeadEventType; // read-only
      automationPointerDown: lt.Annotations.Engine.AnnPointerEventType; // read-only
      automationPointerMove: lt.Annotations.Engine.AnnPointerEventType; // read-only
      automationPointerUp: lt.Annotations.Engine.AnnPointerEventType; // read-only
      automationSizeChanged: lt.LeadEventType; // read-only
      automationTransformChanged: lt.LeadEventType; // read-only
      automationUseDpiChanged: lt.LeadEventType; // read-only
   }

   class Drawable {
      get_userData(): any;
      set_userData(value: any): void;
      beginUpdate(): void;
      endUpdate(): void;
      canUpdate(): boolean;
      refresh(): void;
      draw(item: lt.Controls.ImageViewerItem, context: CanvasRenderingContext2D, rect: lt.LeadRectD): void;
      get_visible(): boolean;
      set_visible(value: boolean): void;
      dispose(): void;
      drawStarted(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      drawDelta(x: number, y: number, args: DrawableEventArgs): void;
      drawCompleted(x: number, y: number, args: DrawableEventArgs): void;
      drawDoubleTap(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      hitTest(item: lt.Controls.ImageViewerItem, x: number, y: number): boolean;
      handleDragStarted(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      handleDragDelta(x: number, y: number, args: DrawableEventArgs): void;
      handleDragCompleted(x: number, y: number, args: DrawableEventArgs): void;
      handleDoubleTap(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      handleMove(item: lt.Controls.ImageViewerItem, x: number, y: number, args: DrawableEventArgs): void;
      constructor();
      userData: any;
      visible: boolean;
   }

   interface KeyboardEventHandler extends lt.LeadEventHandler {
      (sender: any, e: KeyboardEventArgs): void;
   }

   class KeyboardEventType extends lt.LeadEvent {
      add(value: KeyboardEventHandler): KeyboardEventHandler;
      remove(value: KeyboardEventHandler): void;
   }

   class KeyboardEventArgs extends lt.LeadEventArgs {
      get_key(): string;
      get_code(): number;
      get_cancel(): boolean;
      set_cancel(value: boolean): void;
      constructor(key: string, code: number);
      key: string; // read-only
      code: number; // read-only
      cancel: boolean;
   }

   class AutomationInteractiveMode extends MedicalViewerInteractiveMode {
      get_id(): number;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      get_name(): string;
      constructor();
      id: number; // read-only
      name: string; // read-only
   }

   class Cell extends LayoutManagerItem {
      get_windowLevel(): WindowLevelInteractiveMode;
      set_windowLevel(value: WindowLevelInteractiveMode): void;
      get_drawCrossHairLines(): boolean;
      set_drawCrossHairLines(value: boolean): void;
      set_borderThickness(value: number): void;
      get_borderThickness(): number;
      get_arrangement(): FrameArrangement;
      set_arrangement(value: FrameArrangement): void;
      get_showFrameBorder(): boolean;
      set_showFrameBorder(value: boolean): void;
      get_currentOffset(): number;
      set_currentOffset(value: number): void;
      updateScrollFillColor(r: number, g: number, b: number, a: number): void;
      updateScrollStokeColor(r: number, g: number, b: number, a: number): void;
      get_framesMappingIndex(): number[];
      set_framesMappingIndex(value: number[]): void;
      get_frames(): lt.LeadCollection;
      get_overlays(): lt.LeadCollection;
      invalidate(rect: lt.LeadRectD): void;
      dispose(): void;
      supportWindowLevel(frameIndex: number): boolean;
      onSizeChanged(): void;
      get_visibility(): boolean;
      set_visibility(value: boolean): void;
      get_activeDrawable(): Drawable;
      set_activeDrawable(value: Drawable): void;
      get_scrollType(): ScrollType;
      set_scrollType(value: ScrollType): void;
      get_cinePlayer(): CinePlayer;
      get_lineProfile(): LineProfileObject;
      set_lineProfile(value: LineProfileObject): void;
      get_mprType(): CellMPRType;
      set_mprType(value: CellMPRType): void;
      get_derivatives(): lt.LeadCollection;
      beginUpdate(): void;
      endUpdate(): void;
      get_selectedItems(): lt.LeadCollection;
      set_selectedItems(value: lt.LeadCollection): void;
      get_selectedItem(): SubCell;
      set_selectedItem(value: SubCell): void;
      get_automation(): lt.Annotations.Automation.AnnAutomation;
      get_selectedBorderColor(): string;
      set_selectedBorderColor(value: string): void;
      get_unselectedBorderColor(): string;
      set_unselectedBorderColor(value: string): void;
      get_selectedSubCellBorderColor(): string;
      set_selectedSubCellBorderColor(value: string): void;
      get_highlightedSubCellBorderColor(): string;
      set_highlightedSubCellBorderColor(value: string): void;
      get_useBackCanvas(): boolean;
      set_useBackCanvas(value: boolean): void;
      get_overlayTextVisible(): boolean;
      set_overlayTextVisible(value: boolean): void;
      suspendCalculation(): void;
      resumeCalcuation(): void;
      setCommand(commandID: number, command: ActionCommand): void;
      getCommandInteractiveMode(commandID: number): any;
      getCommand(commandID: number): any;
      runCommand(commandID: number): void;
      get_seriesNumber(): number;
      set_seriesNumber(value: number): void;
      get_patientName(): string;
      set_patientName(value: string): void;
      get_seriesInstanceUID(): string;
      set_seriesInstanceUID(value: string): void;
      get_frameOfReferenceUID(): string;
      set_frameOfReferenceUID(value: string): void;
      get_linked(): boolean;
      set_linked(value: boolean): void;
      withinVisibleRange(index: number): boolean;
      updateSubCellCount(newCount: number): void;
      get_imageViewer(): AutomationImageViewer;
      set_imageViewer(value: AutomationImageViewer): void;
      get_gridLayout(): CellGridLayout;
      get_progress(): ProgressLoading;
      set_progress(value: ProgressLoading): void;
      add_outOfBounds(value: lt.LeadEventHandler): void;
      remove_outOfBounds(value: lt.LeadEventHandler): void;
      add_currentOffsetChanged(value: lt.LeadEventHandler): void;
      remove_currentOffsetChanged(value: lt.LeadEventHandler): void;
      add_cellClicked(value: lt.Controls.InteractiveEventHandler): void;
      remove_cellClicked(value: lt.Controls.InteractiveEventHandler): void;
      add_mouseDown(value: lt.Controls.InteractiveEventHandler): void;
      remove_mouseDown(value: lt.Controls.InteractiveEventHandler): void;
      add_mouseMove(value: lt.Controls.InteractiveEventHandler): void;
      remove_mouseMove(value: lt.Controls.InteractiveEventHandler): void;
      add_firstFrameReady(value: CellEventHandler): void;
      remove_firstFrameReady(value: CellEventHandler): void;
      add_imageURLChanged(value: ImageURLChangedEventHandler): void;
      remove_imageURLChanged(value: ImageURLChangedEventHandler): void;
      add_postRender(value: lt.Controls.ImageViewerRenderEventHandler): void;
      remove_postRender(value: lt.Controls.ImageViewerRenderEventHandler): void;
      add_scrollChanged(value: ScrollChangedEventHandler): void;
      remove_scrollChanged(value: ScrollChangedEventHandler): void;
      add_progressCompleted(value: lt.LeadEventHandler): void;
      remove_progressCompleted(value: lt.LeadEventHandler): void;
      add_sizeChanged(value: lt.LeadEventHandler): void;
      remove_sizeChanged(value: lt.LeadEventHandler): void;
      add_imageProcessingReady(value: ImageProcessingReadyEventHandler): void;
      remove_imageProcessingReady(value: ImageProcessingReadyEventHandler): void;
      add_imageDownloaded(value: CellEventHandler): void;
      remove_imageDownloaded(value: CellEventHandler): void;
      add_frameRequestedSrc(value: FrameRequestedSrcEventHandler): void;
      remove_frameRequestedSrc(value: FrameRequestedSrcEventHandler): void;
      get_flipped(): boolean;
      set_flipped(value: boolean): void;
      get_reversed(): boolean;
      set_reversed(value: boolean): void;
      get_rotateAngle(): number;
      set_rotateAngle(value: number): void;
      get_inverted(): boolean;
      set_inverted(value: boolean): void;
      get_autoLoadFromJSON(): boolean;
      set_autoLoadFromJSON(value: boolean): void;
      get_scale(): number;
      set_scale(value: number): void;
      get_scaleMode(): MedicalViewerSizeMode;
      zoom(ScaleMode: MedicalViewerSizeMode, scaleFactor: number): void;
      reset(): void;
      get_verticalAlignment(): VerticalAlignmentType;
      set_verticalAlignment(value: VerticalAlignmentType): void;
      get_horizontalAlignment(): HorizontalAlignmentType;
      set_horizontalAlignment(value: HorizontalAlignmentType): void;
      get_canExplode(): boolean;
      get_exploded(): boolean;
      set_exploded(value: boolean): void;
      matchFramesScale(referenceCell: Cell, all: boolean): void;
      prepareDrawingCanvas(frame: Frame, chunk: ChunkData): ChunkData;  // protected
      get_name(): string;
      get_create3D(): boolean;
      set_create3D(value: boolean): void;
      add_data3DGenerated(value: lt.LeadEventHandler): void;
      remove_data3DGenerated(value: lt.LeadEventHandler): void;
      get_signed3D(): boolean;
      set_signed3D(value: boolean): void;
      get_studyInstanceUID(): string;
      set_studyInstanceUID(value: string): void;
      get_fullDownload(): boolean;
      set_fullDownload(value: boolean): void;
      get_marginFramesCount(): number;
      set_marginFramesCount(value: number): void;
      get_sortingOperationsSequence(): SortingOperation[];
      set_sortingOperationsSequence(value: SortingOperation[]): void;
      constructor(viewer: MedicalViewer, divID: string, rows: number, columns: number);
      flipped: boolean;
      reversed: boolean;
      rotateAngle: number;
      inverted: boolean;
      autoLoadFromJSON: boolean;
      scale: number;
      scaleMode: MedicalViewerSizeMode; // read-only
      verticalAlignment: VerticalAlignmentType;
      horizontalAlignment: HorizontalAlignmentType;
      canExplode: boolean; // read-only
      exploded: boolean;
      name: string; // read-only
      create3D: boolean;
      signed3D: boolean;
      studyInstanceUID: string;
      fullDownload: boolean;
      marginFramesCount: number;
      sortingOperationsSequence: SortingOperation[];
      scrollType: ScrollType;
      cinePlayer: CinePlayer;
      lineProfile: LineProfileObject;
      mprType: CellMPRType;
      derivatives: lt.LeadCollection; // read-only
      selectedItems: lt.LeadCollection;
      selectedItem: SubCell;
      automation: lt.Annotations.Automation.AnnAutomation; // read-only
      selectedBorderColor: string;
      unselectedBorderColor: string;
      selectedSubCellBorderColor: string;
      highlightedSubCellBorderColor: string;
      useBackCanvas: boolean;
      overlayTextVisible: boolean;
      seriesNumber: number;
      patientName: string;
      seriesInstanceUID: string;
      frameOfReferenceUID: string;
      linked: boolean;
      imageViewer: AutomationImageViewer;
      gridLayout: CellGridLayout; // read-only
      progress: ProgressLoading;
      windowLevel: WindowLevelInteractiveMode;
      drawCrossHairLines: boolean;
      borderThickness: number;
      arrangement: FrameArrangement;
      showFrameBorder: boolean;
      currentOffset: number;
      framesMappingIndex: number[];
      frames: lt.LeadCollection; // read-only
      overlays: lt.LeadCollection; // read-only
      visibility: boolean;
      activeDrawable: Drawable;
      outOfBounds: lt.LeadEventType; // read-only
      currentOffsetChanged: lt.LeadEventType; // read-only
      cellClicked: lt.Controls.InteractiveEventType; // read-only
      mouseDown: lt.Controls.InteractiveEventType; // read-only
      mouseMove: lt.Controls.InteractiveEventType; // read-only
      firstFrameReady: CellEventType; // read-only
      imageURLChanged: ImageURLChangedEventType; // read-only
      postRender: lt.Controls.ImageViewerRenderEventType; // read-only
      scrollChanged: ScrollChangedEventType; // read-only
      progressCompleted: lt.LeadEventType; // read-only
      sizeChanged: lt.LeadEventType; // read-only
      imageProcessingReady: ImageProcessingReadyEventType; // read-only
      imageDownloaded: CellEventType; // read-only
      frameRequestedSrc: FrameRequestedSrcEventType; // read-only
      data3DGenerated: lt.LeadEventType; // read-only
   }

   class EmptyCell extends LayoutManagerItem {
      get_name(): string;
      get_backgroundColor(): string;
      set_backgroundColor(value: string): void;
      constructor(id: string);
      name: string; // read-only
      backgroundColor: string;
   }

   enum ExplodeType {
      none = 0,
      auto = 1,
      cell = 2,
      viewer = 3
   }

   interface CellExplodedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: CellExplodedEventArgs): void;
   }

   class CellExplodedEventType extends lt.LeadEvent {
      add(value: CellExplodedEventHandler): CellExplodedEventHandler;
      remove(value: CellExplodedEventHandler): void;
   }

   class CellExplodedEventArgs extends lt.LeadEventArgs {
      get_cell(): LayoutManagerItem;
      constructor(cell: LayoutManagerItem);
      cell: LayoutManagerItem; // read-only
   }

   interface LayoutChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: LayoutChangedEventArgs): void;
   }

   class LayoutChangedEventType extends lt.LeadEvent {
      add(value: LayoutChangedEventHandler): LayoutChangedEventHandler;
      remove(value: LayoutChangedEventHandler): void;
   }

   class LayoutChangedEventArgs extends lt.LeadEventArgs {
      get_item(): LayoutManagerItem;
      constructor(item: LayoutManagerItem);
      item: LayoutManagerItem; // read-only
   }

   class LayoutManagerItem {
      onSizeChanged(): void;
      get_overlayTexts(): { [key: string]: OverlayTextArea };
      get_canExplode(): boolean;
      get_exploded(): boolean;
      set_exploded(value: boolean): void;
      get_position(): number;
      set_position(value: number): void;
      get_rowPosition(): number;
      set_rowPosition(value: number): void;
      get_columnPosition(): number;
      set_columnPosition(value: number): void;
      get_overlayTextVisible(): boolean;
      set_overlayTextVisible(value: boolean): void;
      get_visibility(): boolean;
      set_visibility(value: boolean): void;
      get_highlighted(): boolean;
      set_highlighted(value: boolean): void;
      get_userData(): any;
      set_userData(value: any): void;
      get_div(): HTMLDivElement;
      get_divID(): string;
      set_divID(value: string): void;
      get_layoutSize(): lt.LeadRectD;
      set_layoutSize(value: lt.LeadRectD): void;
      get_displayRectangle(): lt.LeadRectD;
      set_displayRectangle(value: lt.LeadRectD): void;
      get_bounds(): lt.LeadRectD;
      set_bounds(value: lt.LeadRectD): void;
      get_selected(): boolean;
      set_selected(value: boolean): void;
      get_name(): string;
      get_drawables(): { [key: string]: Drawable };
      get_annRenderingEngine(): lt.Annotations.Rendering.AnnHtml5RenderingEngine;
      get_automationManager(): lt.Annotations.Automation.AnnAutomationManager;
      get_isDisposed(): boolean;
      dispose(): void;
      get_viewer(): MedicalViewer;
      set_viewer(value: MedicalViewer): void;
      get_labels(): lt.LeadCollection;
      add_layoutChanged(value: LayoutChangedEventHandler): void;
      remove_layoutChanged(value: LayoutChangedEventHandler): void;
      add_selectedChanged(value: SelectionChangedEventHandler): void;
      remove_selectedChanged(value: SelectionChangedEventHandler): void;
      add_boundsChanged(value: lt.LeadEventHandler): void;
      remove_boundsChanged(value: lt.LeadEventHandler): void;
      add_disposing(value: lt.LeadEventHandler): void;
      remove_disposing(value: lt.LeadEventHandler): void;
      add_handleMouseDown(value: MouseEventHandler): void;
      remove_handleMouseDown(value: MouseEventHandler): void;
      add_handleMouseMove(value: MouseEventHandler): void;
      remove_handleMouseMove(value: MouseEventHandler): void;
      add_handleMouseUp(value: MouseEventHandler): void;
      remove_handleMouseUp(value: MouseEventHandler): void;
      add_handleMouseDoubleClick(value: MouseEventHandler): void;
      remove_handleMouseDoubleClick(value: MouseEventHandler): void;
      add_highlightedChanged(value: lt.LeadEventHandler): void;
      remove_highlightedChanged(value: lt.LeadEventHandler): void;
      onSelectionChanged(): void;  // protected
      onMouseUp(sender: any, e: Event): void;  // protected
      onMouseDoubleClick(sender: any, e: Event): void;  // protected
      onMouseMove(sender: any, e: Event): void;  // protected
      onMouseDown(sender: any, e: Event): void;  // protected
      beginUpdate(): void;
      endUpdate(): void;
      get_actions(): ActionCommands;
      get_userControls(): lt.LeadCollection;
      constructor(divID: string);
      overlayTexts: { [key: string]: OverlayTextArea }; // read-only
      canExplode: boolean; // read-only
      exploded: boolean;
      position: number;
      rowPosition: number;
      columnPosition: number;
      overlayTextVisible: boolean;
      visibility: boolean;
      highlighted: boolean;
      userData: any;
      div: HTMLDivElement; // read-only
      divID: string;
      layoutSize: lt.LeadRectD;
      displayRectangle: lt.LeadRectD;
      bounds: lt.LeadRectD;
      selected: boolean;
      name: string; // read-only
      drawables: { [key: string]: Drawable }; // read-only
      annRenderingEngine: lt.Annotations.Rendering.AnnHtml5RenderingEngine; // read-only
      automationManager: lt.Annotations.Automation.AnnAutomationManager; // read-only
      isDisposed: boolean; // read-only
      viewer: MedicalViewer;
      labels: lt.LeadCollection; // read-only
      actions: ActionCommands; // read-only
      userControls: lt.LeadCollection; // read-only
      layoutChanged: LayoutChangedEventType; // read-only
      selectedChanged: SelectionChangedEventType; // read-only
      boundsChanged: lt.LeadEventType; // read-only
      disposing: lt.LeadEventType; // read-only
      handleMouseDown: MouseEventType; // read-only
      handleMouseMove: MouseEventType; // read-only
      handleMouseUp: MouseEventType; // read-only
      handleMouseDoubleClick: MouseEventType; // read-only
      highlightedChanged: lt.LeadEventType; // read-only
   }

   class WindowLevelInformation {
      get_minValue(): number;
      set_minValue(value: number): void;
      get_maxValue(): number;
      set_maxValue(value: number): void;
      get_windowWidth(): number;
      set_windowWidth(value: number): void;
      get_windowCenter(): number;
      set_windowCenter(value: number): void;
      get_signed(): boolean;
      set_signed(value: boolean): void;
      get_photometricInterpretation(): string;
      set_photometricInterpretation(value: string): void;
      get_autoScaleIntercept(): number;
      set_autoScaleIntercept(value: number): void;
      get_autoScaleSlope(): number;
      set_autoScaleSlope(value: number): void;
      constructor();
      minValue: number;
      maxValue: number;
      windowWidth: number;
      windowCenter: number;
      signed: boolean;
      photometricInterpretation: string;
      autoScaleIntercept: number;
      autoScaleSlope: number;
   }

   class DICOMImageInformation extends WindowLevelInformation {
      get_image(): HTMLImageElement;
      set_image(value: HTMLImageElement): void;
      get_canvas(): HTMLCanvasElement;
      set_canvas(value: HTMLCanvasElement): void;
      get_width(): number;
      set_width(value: number): void;
      get_height(): number;
      set_height(value: number): void;
      get_bitsPerPixel(): number;
      set_bitsPerPixel(value: number): void;
      get_luT32(): number[];
      set_luT32(value: number[]): void;
      get_data32(): number[];
      set_data32(value: number[]): void;
      get_lowBit(): number;
      set_lowBit(value: number): void;
      get_highBit(): number;
      set_highBit(value: number): void;
      get_lutDescriptor(): number[];
      set_lutDescriptor(value: number[]): void;
      get_firstStoredPixelValueMapped(): number;
      set_firstStoredPixelValueMapped(value: number): void;
      clone(): DICOMImageInformation;
      constructor();
      image: HTMLImageElement;
      canvas: HTMLCanvasElement;
      width: number;
      height: number;
      bitsPerPixel: number;
      luT32: number[];
      data32: number[];
      lowBit: number;
      highBit: number;
      lutDescriptor: number[];
      firstStoredPixelValueMapped: number;
   }

   class DICOMImageInformationRenderer {
      add_updateImageData(value: lt.LeadEventHandler): void;
      remove_updateImageData(value: lt.LeadEventHandler): void;
      add_changed(value: lt.LeadEventHandler): void;
      remove_changed(value: lt.LeadEventHandler): void;
      get_paletteType(): WindowLevelPaletteType;
      set_paletteType(value: WindowLevelPaletteType): void;
      get_minimumWindowLevelWidth(): number;
      get_maximumWindowLevelWidth(): number;
      get_minimumWindowLevelCenter(): number;
      get_maximumWindowLevelCenter(): number;
      get_originalWindowLevelWidth(): number;
      get_originalWindowLevelCenter(): number;
      get_windowLevelWidth(): number;
      get_windowLevelCenter(): number;
      get_inverted(): boolean;
      set_inverted(value: boolean): void;
      get_information(): DICOMImageInformation;
      set_information(value: DICOMImageInformation): void;
      onUpdateImageData(e: lt.LeadEventArgs): void;
      render(outputCanvas: HTMLCanvasElement, inputCanvas: HTMLCanvasElement): void;
      onChanged(e: lt.LeadEventArgs): void;  // protected
      dispose(): void;
      updateWindowLevelLUT(width: number, center: number): void;
      renderUsingCanvas(canvas: HTMLCanvasElement, isNewImageData: boolean): void;
      constructor(information: DICOMImageInformation);
      paletteType: WindowLevelPaletteType;
      minimumWindowLevelWidth: number; // read-only
      maximumWindowLevelWidth: number; // read-only
      minimumWindowLevelCenter: number; // read-only
      maximumWindowLevelCenter: number; // read-only
      originalWindowLevelWidth: number; // read-only
      originalWindowLevelCenter: number; // read-only
      windowLevelWidth: number; // read-only
      windowLevelCenter: number; // read-only
      inverted: boolean;
      information: DICOMImageInformation;
      updateImageData: lt.LeadEventType; // read-only
      changed: lt.LeadEventType; // read-only
   }

   enum RenderingType {
      none = 0,
      client = 1,
      server = 2
   }

   class MRTISubCell extends SubCell {
      get_foregroundSize(): number;
      set_foregroundSize(value: number): void;
      getForeground(): HTMLCanvasElement;
      get_chunkList(): ChunkData[];
      add_sizeChanged(value: lt.LeadEventHandler): void;
      remove_sizeChanged(value: lt.LeadEventHandler): void;
      onSizeChanged(): void;
      static getFloatImageRect(imageViewer: lt.Controls.ImageViewer, item: lt.Controls.ImageViewerItem): lt.LeadRectD;
      get_tileResolution(): lt.LeadSizeD;
      constructor(cell: Cell);
      foregroundSize: number;
      chunkList: ChunkData[]; // read-only
      tileResolution: lt.LeadSizeD;
      sizeChanged: lt.LeadEventType; // read-only
      fullScreenCanvas: HTMLCanvasElement;
      mrtiBackCanvas: HTMLCanvasElement;
   }

   class SubCell extends CellItem {
      get_overlayTexts(): lt.LeadCollection;
      get_overlays(): { [key: string]: OverlayTextArea };
      get_backColor(): string;
      set_backColor(value: string): void;
      get_fieldOfView(): lt.LeadPointD;
      get_selected(): boolean;
      set_selected(value: boolean): void;
      get_divID(): string;
      set_divID(value: string): void;
      get_parentCell(): Cell;
      add_frameAttached(value: FrameAttachedEventHandler): void;
      remove_frameAttached(value: FrameAttachedEventHandler): void;
      invalidate(): void;
      get_attachedFrame(): Frame;
      set_attachedFrame(value: Frame): void;
      get_annotationCanvas(): HTMLCanvasElement;
      set_annotationCanvas(value: HTMLCanvasElement): void;
      onSizeChanged(): void;
      dispose(): void;
      get_overlayTextVisible(): boolean;
      set_overlayTextVisible(value: boolean): void;
      constructor(cell: Cell);
      overlayTexts: lt.LeadCollection; // read-only
      overlays: { [key: string]: OverlayTextArea }; // read-only
      backColor: string;
      fieldOfView: lt.LeadPointD; // read-only
      selected: boolean;
      divID: string;
      parentCell: Cell; // read-only
      attachedFrame: Frame;
      annotationCanvas: HTMLCanvasElement;
      overlayTextVisible: boolean;
      frameAttached: FrameAttachedEventType; // read-only
   }

   enum MouseAction {
      mouseLeave = 0,
      mouseMove = 1,
      clicked = 2,
      mouseUp = 3,
      keyDown = 4,
      doubleClick = 5,
      mouseTouchEvent = 6,
      touchUp = 7,
      mouseDown = 8
   }

   interface MouseEventHandler extends lt.LeadEventHandler {
      (sender: any, e: MouseEventArgs): void;
   }

   class MouseEventType extends lt.LeadEvent {
      add(value: MouseEventHandler): MouseEventHandler;
      remove(value: MouseEventHandler): void;
   }

   class MouseEventArgs extends lt.LeadEventArgs {
      get_client(): lt.LeadPointD;
      get_change(): lt.LeadPointD;
      get_e(): Event;
      set_e(value: Event): void;
      get_x(): number;
      get_y(): number;
      get_button(): lt.Controls.MouseButtons;
      get_action(): MouseAction;
      get_isCTRL(): boolean;
      get_cancel(): boolean;
      set_cancel(value: boolean): void;
      constructor(button: lt.Controls.MouseButtons, x: number, y: number, action: MouseAction, change: lt.LeadPointD, e: Event);
      client: lt.LeadPointD; // read-only
      change: lt.LeadPointD; // read-only
      e: Event;
      x: number; // read-only
      y: number; // read-only
      button: lt.Controls.MouseButtons; // read-only
      action: MouseAction; // read-only
      isCTRL: boolean; // read-only
      cancel: boolean;
   }

   class MenuItem {
      constructor(text: string, icon: HTMLImageElement, userData: any);
      text: string;
      icon: HTMLImageElement;
      userData: any;
   }

   interface MenuItemSelectedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: MenuItemSelectedEventArgs): void;
   }

   class MenuItemSelectedEventType extends lt.LeadEvent {
      add(value: MenuItemSelectedEventHandler): MenuItemSelectedEventHandler;
      remove(value: MenuItemSelectedEventHandler): void;
   }

   class MenuItemSelectedEventArgs extends lt.LeadEventArgs {
      get_item(): MenuItem;
      constructor(item: MenuItem);
      item: MenuItem; // read-only
   }

   class Menu {
      get_items(): lt.LeadCollection;
      set_items(value: lt.LeadCollection): void;
      add_menuItemSelected(value: MenuItemSelectedEventHandler): void;
      remove_menuItemSelected(value: MenuItemSelectedEventHandler): void;
      add_menuItemHover(value: MenuItemSelectedEventHandler): void;
      remove_menuItemHover(value: MenuItemSelectedEventHandler): void;
      add_menuItemLeave(value: MenuItemSelectedEventHandler): void;
      remove_menuItemLeave(value: MenuItemSelectedEventHandler): void;
      dispose(): void;
      get_id(): string;
      show(cell: LayoutManagerItem, x: number, y: number, boundaries: lt.LeadRectD): void;
      constructor(title: string);
      items: lt.LeadCollection;
      id: string; // read-only
      menuItemSelected: MenuItemSelectedEventType; // read-only
      menuItemHover: MenuItemSelectedEventType; // read-only
      menuItemLeave: MenuItemSelectedEventType; // read-only
      title: string;
   }

   class MedicalViewerInteractiveMode extends lt.Controls.ImageViewerInteractiveMode {
      get_change(): lt.LeadPointD;
      get_origin(): lt.LeadPointD;
      get_id(): number;
      get_name(): string;
      add_workDelta(value: lt.Controls.InteractiveDragDeltaEventHandler): void;
      remove_workDelta(value: lt.Controls.InteractiveDragDeltaEventHandler): void;
      start(imageViewer: lt.Controls.ImageViewer): void;
      stop(imageViewer: lt.Controls.ImageViewer): void;
      onDragDelta(e: lt.Controls.InteractiveDragDeltaEventArgs): void;  // protected
      constructor();
      change: lt.LeadPointD; // read-only
      origin: lt.LeadPointD; // read-only
      id: number; // read-only
      name: string; // read-only
      workDelta: lt.Controls.InteractiveDragDeltaEventType; // read-only
   }

   class GridLayout {
      get_splittersColor(): string;
      set_splittersColor(value: string): void;
      refresh(): void;
      dispose(): void;
      beginUpdate(): void;
      endUpdate(): void;
      mergeItems(items: LayoutManagerItem[]): void;
      mergeSelected(): void;
      get_enabled(): boolean;
      set_enabled(value: boolean): void;
      get_rows(): number;
      set_rows(value: number): void;
      get_columns(): number;
      set_columns(value: number): void;
      get_splitterSize(): number;
      set_splitterSize(value: number): void;
      get_horizontalSplitters(): lt.LeadCollection;
      get_verticalSplitters(): lt.LeadCollection;
      get_splittersMovable(): boolean;
      set_splittersMovable(value: boolean): void;
      get_canMerge(): boolean;
      constructor(divParent: HTMLDivElement, items: lt.LeadCollection, viewer: MedicalViewer, rows: number, columns: number);
      splittersColor: string;
      enabled: boolean;
      rows: number;
      columns: number;
      splitterSize: number;
      horizontalSplitters: lt.LeadCollection; // read-only
      verticalSplitters: lt.LeadCollection; // read-only
      splittersMovable: boolean;
      canMerge: boolean; // read-only
   }

   class LayoutManager {
      add_layoutChanged(value: lt.LeadEventHandler): void;
      remove_layoutChanged(value: lt.LeadEventHandler): void;
      get_mode(): CellsArrangement;
      set_mode(value: CellsArrangement): void;
      onSizeChanged(): void;
      beginUpdate(): void;
      canUpdate(): boolean;
      endUpdate(): void;
      get_viewer(): MedicalViewer;
      dispose(): void;
      get_customLayout(): lt.LeadRectD[];
      set_customLayout(value: lt.LeadRectD[]): void;
      refresh(): void;
      get_cells(): lt.LeadCollection;
      get_items(): lt.LeadCollection;
      get_emptyCells(): lt.LeadCollection;
      get_highlightedItems(): lt.LeadCollection;
      get_selectedItems(): lt.LeadCollection;
      get_selectedItem(): LayoutManagerItem;
      set_selectedItem(value: LayoutManagerItem): void;
      get_div(): HTMLDivElement;
      constructor(divParent: HTMLDivElement, viewer: MedicalViewer);
      mode: CellsArrangement;
      viewer: MedicalViewer; // read-only
      customLayout: lt.LeadRectD[];
      cells: lt.LeadCollection; // read-only
      items: lt.LeadCollection; // read-only
      emptyCells: lt.LeadCollection; // read-only
      highlightedItems: lt.LeadCollection; // read-only
      selectedItems: lt.LeadCollection; // read-only
      selectedItem: LayoutManagerItem;
      div: HTMLDivElement; // read-only
      layoutChanged: lt.LeadEventType; // read-only
   }

   interface ChunkLoadedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: ChunkLoadedEventArgs): void;
   }

   class ChunkLoadedEventType extends lt.LeadEvent {
      add(value: ChunkLoadedEventHandler): ChunkLoadedEventHandler;
      remove(value: ChunkLoadedEventHandler): void;
   }

   class ChunkLoadedEventArgs extends lt.LeadEventArgs {
      get_chunk(): ChunkData;
      constructor(chunk: ChunkData);
      chunk: ChunkData; // read-only
   }

   class MRTIImage {
      get_frameIndex(): number;
      set_frameIndex(value: number): void;
      get_imageUri(): string;
      set_imageUri(value: string): void;
      get_imageName(): string;
      set_imageName(value: string): void;
      get_mimeType(): string;
      set_mimeType(value: string): void;
      get_fullSize(): lt.LeadSizeD;
      set_fullSize(value: lt.LeadSizeD): void;
      get_fullDpi(): lt.LeadSizeD;
      set_fullDpi(value: lt.LeadSizeD): void;
      get_resolutions(): lt.LeadSizeD[];
      set_resolutions(value: lt.LeadSizeD[]): void;
      get_tileSize(): lt.LeadSizeD;
      set_tileSize(value: lt.LeadSizeD): void;
      get_supportWindowLevel(): boolean;
      set_supportWindowLevel(value: boolean): void;
      constructor();
      frameIndex: number;
      imageUri: string;
      imageName: string;
      mimeType: string;
      fullSize: lt.LeadSizeD;
      fullDpi: lt.LeadSizeD;
      resolutions: lt.LeadSizeD[];
      tileSize: lt.LeadSizeD;
      supportWindowLevel: boolean;
   }

   enum ProjectionOrientationType {
      none = 0,
      faceToFace = 1,
      faceToBack = 2
   }

   class PanoramicAction extends InteractiveAction {
      createInteractiveMode(): lt.Controls.ImageViewerInteractiveMode;  // protected
      onActionStarted(): void;  // protected
      add_panoramicUpdated(value: PanoramicChangedEventHandler): void;
      remove_panoramicUpdated(value: PanoramicChangedEventHandler): void;
      add_panoramicGenerated(value: PanoramicChangedEventHandler): void;
      remove_panoramicGenerated(value: PanoramicChangedEventHandler): void;
      constructor(id: number, cell: Cell);
      panoramicUpdated: PanoramicChangedEventType; // read-only
      panoramicGenerated: PanoramicChangedEventType; // read-only
   }

   class LeadLine {
      constructor(x1: number, y1: number, x2: number, y2: number);
      point1: lt.LeadPointD;
      point2: lt.LeadPointD;
   }

   class ReferenceLine {
      static rotate(line: LeadLine, angle: number, width: number, height: number): LeadLine;
      static flip(line: LeadLine, width: number, height: number): LeadLine;
      static reverse(line: LeadLine, width: number, height: number): LeadLine;
      static draw(context: CanvasRenderingContext2D, displayRect: lt.LeadRectD, imageRect: lt.LeadRectD, line: LeadLine, lineNumber: string): boolean;
      static find(orientation1: number[], imageposition1: number[], voxelspacing1: lt.LeadPointD, width1: number, height1: number, orientation2: number[], imageposition2: number[], voxelspacing2: lt.LeadPointD, width2: number, height2: number): LeadLine;
      constructor();
   }

   enum Requested3DDataType {
      create3DObject = 0,
      render = 1,
      creationProgress = 2,
      keepServerObjectAlive = 3,
      delete3DObject = 4,
      update3DSettings = 5,
      get3DInfo = 6,
      renderPanoramic = 7,
      none = -1
   }

   interface Request3DDataEventHandler extends lt.LeadEventHandler {
      (sender: any, e: Request3DDataEventArgs): void;
   }

   class Request3DDataEventType extends lt.LeadEvent {
      add(value: Request3DDataEventHandler): Request3DDataEventHandler;
      remove(value: Request3DDataEventHandler): void;
   }

   class Request3DDataEventArgs extends lt.LeadEventArgs {
      get_JSON(): string;
      get_frame(): Frame;
      get_type(): Requested3DDataType;
      get_requestType(): string;
      constructor(Json: string, frame: Frame, type: Requested3DDataType, requestType: string);
      JSON: string; // read-only
      frame: Frame; // read-only
      type: Requested3DDataType; // read-only
      requestType: string; // read-only
   }

   enum SortType {
      none = 0,
      byAxis = 1,
      byAcquisitionTime = 2
   }

   enum SortOrder {
      ascending = 0,
      descending = 2
   }

   class SortingOperation {
      get_sortByCategory(): SortType;
      set_sortByCategory(value: SortType): void;
      get_selectorAttribute(): number;
      set_selectorAttribute(value: number): void;
      get_order(): SortOrder;
      set_order(value: SortOrder): void;
      clone(): SortingOperation;
      constructor();
      sortByCategory: SortType;
      selectorAttribute: number;
      order: SortOrder;
   }

   class CellItem extends lt.Controls.ImageViewerItem {
      get_bounds(): lt.LeadRectD;
      set_bounds(value: lt.LeadRectD): void;
      onRender(context: CanvasRenderingContext2D): void;  // protected
      onSizeChanged(): void;
      beginUpdate(): void;
      endUpdate(): void;
      constructor();
      bounds: lt.LeadRectD;
   }

   class Tools {
      static convertToBase64(arrayBuffer: number[]): string;
      static resetCanvas(canvas: HTMLCanvasElement): void;
      static logicalToPhysicalValue(item: lt.Controls.ImageViewerItem, value: number): number;
      static logicalToPhysicalArray(item: lt.Controls.ImageViewerItem, points: lt.LeadPointD[]): lt.LeadPointD[];
      static logicalToPhysical(item: lt.Controls.ImageViewerItem, point: lt.LeadPointD): lt.LeadPointD;
      static physicalToLogical(item: lt.Controls.ImageViewerItem, point: lt.LeadPointD): lt.LeadPointD;
      constructor();
      static pointerdown: string;
      static pointerup: string;
      static pointercancel: string;
      static pointermove: string;
   }

   class MedicalViewer extends lt.Controls.InteractiveService {
      add_linkedChanged(value: LinkedChangedEventHandler): void;
      remove_linkedChanged(value: LinkedChangedEventHandler): void;
      add_beforeCellExploded(value: CellExplodedEventHandler): void;
      remove_beforeCellExploded(value: CellExplodedEventHandler): void;
      add_afterCellExploded(value: CellExplodedEventHandler): void;
      remove_afterCellExploded(value: CellExplodedEventHandler): void;
      add_selectionChanged(value: SelectionChangedEventHandler): void;
      remove_selectionChanged(value: SelectionChangedEventHandler): void;
      add_loadInstance(value: LoadInstanceEventHandler): void;
      remove_loadInstance(value: LoadInstanceEventHandler): void;
      add_loadMetadata(value: LoadInstanceEventHandler): void;
      remove_loadMetadata(value: LoadInstanceEventHandler): void;
      invalidate(): void;
      onSizeChanged(): void;
      unload(): void;
      load(metadata: any): void;
      disposeViewer(): void;
      get_matchedCells(): { [key: string]: Cell[] };
      get_div(): HTMLDivElement;
      get_emptyCellColor(): string;
      set_emptyCellColor(value: string): void;
      get_emptyDivs(): lt.LeadCollection;
      get_showReferenceLine(): boolean;
      set_showReferenceLine(value: boolean): void;
      get_showFirstAndLastReferenceLine(): boolean;
      set_showFirstAndLastReferenceLine(value: boolean): void;
      get_synchronizeDicomTag(): number;
      set_synchronizeDicomTag(value: number): void;
      get_synchronizationCriteria(): StackSynchronizationCriteria;
      set_synchronizationCriteria(value: StackSynchronizationCriteria): void;
      get_enableSynchronization(): boolean;
      set_enableSynchronization(value: boolean): void;
      get_explodeType(): ExplodeType;
      set_explodeType(value: ExplodeType): void;
      get_exploded(): boolean;
      set_exploded(value: boolean): void;
      get_explodedCell(): LayoutManagerItem;
      set_explodedCell(value: LayoutManagerItem): void;
      get_divId(): string;
      get_backgroundColor(): string;
      set_backgroundColor(value: string): void;
      get_userStyleLayoutOptions(): UserStyleLayoutOptions;
      set_userStyleLayoutOptions(value: UserStyleLayoutOptions): void;
      set_cellsArrangement(value: CellsArrangement): void;
      get_cellsArrangement(): CellsArrangement;
      get_customLayout(): lt.LeadRectD[];
      set_customLayout(value: lt.LeadRectD[]): void;
      get_gridLayout(): GridLayout;
      get_multipleSelection(): boolean;
      set_multipleSelection(value: boolean): void;
      get_showLinkedButton(): boolean;
      set_showLinkedButton(value: boolean): void;
      get_enableLazyLoad(): boolean;
      set_enableLazyLoad(value: boolean): void;
      get_marginFramesCount(): number;
      set_marginFramesCount(value: number): void;
      get_autoLoadFromJSON(): boolean;
      set_autoLoadFromJSON(value: boolean): void;
      synchronizeStudies(key: string, studies: string[], fidutialPoints: LeadPoint3D[][]): void;
      removeKey(key: string): void;
      constructor(parent: HTMLDivElement, rows: number, columns: number);
      matchedCells: { [key: string]: Cell[] }; // read-only
      div: HTMLDivElement; // read-only
      emptyCellColor: string;
      emptyDivs: lt.LeadCollection; // read-only
      showReferenceLine: boolean;
      showFirstAndLastReferenceLine: boolean;
      synchronizeDicomTag: number;
      synchronizationCriteria: StackSynchronizationCriteria;
      enableSynchronization: boolean;
      explodeType: ExplodeType;
      exploded: boolean;
      explodedCell: LayoutManagerItem;
      divId: string; // read-only
      backgroundColor: string;
      userStyleLayoutOptions: UserStyleLayoutOptions;
      cellsArrangement: CellsArrangement;
      customLayout: lt.LeadRectD[];
      gridLayout: GridLayout; // read-only
      multipleSelection: boolean;
      showLinkedButton: boolean;
      enableLazyLoad: boolean;
      marginFramesCount: number;
      autoLoadFromJSON: boolean;
      linkedChanged: LinkedChangedEventType; // read-only
      beforeCellExploded: CellExplodedEventType; // read-only
      afterCellExploded: CellExplodedEventType; // read-only
      selectionChanged: SelectionChangedEventType; // read-only
      loadInstance: LoadInstanceEventType; // read-only
      loadMetadata: LoadInstanceEventType; // read-only
      layout: LayoutManager;
   }

   interface SelectionChangedEventHandler extends lt.LeadEventHandler {
      (sender: any, e: SelectionChangedEventArgs): void;
   }

   class SelectionChangedEventType extends lt.LeadEvent {
      add(value: SelectionChangedEventHandler): SelectionChangedEventHandler;
      remove(value: SelectionChangedEventHandler): void;
   }

   class SelectionChangedEventArgs extends lt.LeadEventArgs {
      get_item(): LayoutManagerItem;
      constructor(item: LayoutManagerItem);
      item: LayoutManagerItem; // read-only
   }

   class WindowLevelData {
      get_interactiveMode(): WindowLevelInteractiveMode;
      get_renderer(): DICOMImageInformationRenderer;
      set_renderer(value: DICOMImageInformationRenderer): void;
      get_image(): HTMLImageElement;
      set_image(value: HTMLImageElement): void;
      get_canvas(): HTMLCanvasElement;
      set_canvas(value: HTMLCanvasElement): void;
      get_dragDeltaSensitivity(): number;
      set_dragDeltaSensitivity(value: number): void;
      get_windowLevelSensitivity(): number;
      get_enableWindowLevelSensitivity(): boolean;
      set_enableWindowLevelSensitivity(value: boolean): void;
      get_resizedCanvas(): HTMLCanvasElement;
      get_resizedRenderer(): DICOMImageInformationRenderer;
      get_imageData(): ImageData;
      set_imageData(value: ImageData): void;
      get_resizedImageData(): ImageData;
      set_resizedImageData(value: ImageData): void;
      get_resizeFactor(): number;
      set_resizeFactor(value: number): void;
      constructor();
      interactiveMode: WindowLevelInteractiveMode;
      renderer: DICOMImageInformationRenderer;
      image: HTMLImageElement;
      canvas: HTMLCanvasElement;
      dragDeltaSensitivity: number;
      windowLevelSensitivity: number; // read-only
      enableWindowLevelSensitivity: boolean;
      resizedCanvas: HTMLCanvasElement; // read-only
      resizedRenderer: DICOMImageInformationRenderer; // read-only
      imageData: ImageData;
      resizedImageData: ImageData;
      resizeFactor: number;
   }

   class WindowLevelInteractiveMode extends MedicalViewerInteractiveMode {
      get_id(): number;
      get_data(): WindowLevelData;
      set_data(value: WindowLevelData): void;
      get_name(): string;
      reset(): void;
      start(viewer: lt.Controls.ImageViewer): void;
      stop(viewer: lt.Controls.ImageViewer): void;
      apply(frame: Frame, change: lt.LeadPointD): void;
      get_serverSideRendering(): boolean;
      set_serverSideRendering(value: boolean): void;
      add_render(value: lt.LeadEventHandler): void;
      remove_render(value: lt.LeadEventHandler): void;
      add_renderCompleted(value: lt.LeadEventHandler): void;
      remove_renderCompleted(value: lt.LeadEventHandler): void;
      dispose(): void;
      constructor();
      id: number; // read-only
      data: WindowLevelData;
      name: string; // read-only
      serverSideRendering: boolean;
      render: lt.LeadEventType; // read-only
      renderCompleted: lt.LeadEventType; // read-only
   }
}
declare module lt.Html {

   class FileReader {
      readAsArrayBuffer(blob: any): void;
      constructor();
      result: number[];
   }

   class ProgressEvent extends lt.LeadEventArgs {
      constructor();
      target: any;
   }

   class XMLHttpRequest {
      open(type: string, address: string, async: boolean): void;
      setRequestHeader(header: string, value: string): void;
      send(body: any): void;
      constructor();
      readyState: number;
      status: number;
      responseText: string;
   }
}
