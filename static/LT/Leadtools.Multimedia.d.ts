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
// Library: Leadtools.Multimedia.d.ts
// Version:23.0.0.1
declare module lt.Multimedia {
/**
 * Options to use when converting an uploaded video resource.
 */
  class ConvertVideoOptions implements ServiceOptions {
    /**
     * The chunk size to use when uploading the document.  Default value is **64 * 1024**.
     */
    chunkSize: number;
    preFetch?: (options: RequestInit) => void;
    constructor();
}

  class MultimediaFactory {
    
    /**
     * Retrieves a URL for a video source in a format that is web-compatible.
     * @param videoSrc - Returns a URL object to the web-compatible video source.
     * @note This process may require a conversion -- which will cause the video player to wait until the resource is fully available.  To ensure that the video is fully converted before setting in the player, please refer to {@link getPlayableUrlAsync}
     */
    static getPlayableUrl(videoSrc: string): URL;
    /**
     * Retrieves a URL for a video source in a format that is web-compatible.
     * @param videoSrc - A promise that will resolve to a URL object containing the web-compatible video source.
     * @param options - Options to use when interfacing with the service.
     * @note This process may require a conversion.  Waiting for this method to resolve will ensure by the time the video is set into the player that it is ready to play.
     */
    static getPlayableUrlAsync(videoSrc: string, options?: ServiceOptions): Promise<URL>;
    /**
     * Converts an uploaded video resource to a web-compatible URL.
     * @param video - The file or blob object to be uploaded.
     * @param options - The options to use when converting the resource.
     * @note This will return a URL to the playable resource -- it will end up being of the format `http://service/api/Multimedia/GetVideo?url=cacheRegion`.  The cache url can be retrieved from the query parameters.
     */
    static convertVideo(video: File | Blob, options?: ConvertVideoOptions): Promise<URL>;
    /**
     * Deletes any cached resources associated with a video source.
     * @param videoSrc - The source URL to delete.
     * @param options - Options to use when interfacing with the service.
     * @note The source URL refers to the originally requested resource.  For calls made to `getPlayableUrl`/`getPlayableUrlAsync`, this will be the URL originally supplied to the method.  For `convertVideo`, the cache URL will need to be provided.
     */
    static deleteCachedVideo(videoSrc: string, options?: ServiceOptions): Promise<boolean>;
    
    
    
}

  interface ServiceOptions {
    preFetch?: (options: RequestInit) => void;
}

  class VideoViewer {
    /** The CSS class that will be applied to the `viewerContainer` element. */
    static containerClass: string;
    /** The CSS class that will be applied to the `video` element. */
    static videoClass: string;
    
    
    
    
    /** The element associated with the viewer. */
    get viewerElement(): HTMLElement | null;
    /** The element where the viewer is created into. */
    get rootElement(): HTMLElement | null;
    /** The current video element that is loaded into the viewer. */
    get video(): HTMLVideoElement | null;
    /**
     * Initializes a new instance of this class.
     * @param options - The `VideoViewerCreateOptions` to use.
     */
    constructor(options: VideoViewerCreateOptions);
    /**
     * Creates a new video element based off the source uri.
     * @param uri - The video source to use
     * @note - If a video element already exists in the viewer, it will be removed.
     */
    setVideo(uri: string): void;
    /**
     * Clears the current video element from the viewer.
     */
    clear(): void;
    /**
     * Disposes of all resources that the `VideoViewer` instance is using.
     */
    dispose(): void;
    
    
}

/**
 * Options that are used to create a new instance of the `VideoViewer`
 */
  interface VideoViewerCreateOptions {
    /**
     * The element that the viewer should be created into.
     */
    root: HTMLElement;
}
} 
