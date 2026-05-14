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
// Library: Leadtools.ContentManager.d.ts
// Version:23.0.0.1
declare module lt.ContentManager {
/** The `ContentManager` handles routing data feeds to the appropriate locations based on their content type. */
  class ContentManager {
    /** The `ContentRegistry` associated with this instance. */
    readonly registry: ContentRegistry;
    
    /** Initializes a new instance of this class.*/
    constructor();
    /**
     * Attempt to load a file from URI.
     *
     * @param uri - The URI to load.
     * @note The file will be routed to the appropriate registry based off the Content-Type for the resource. If no registry exists for the Content-Type of the resource, or if there is no default registry handler, an error will be thrown.
     */
    loadFromUri(uri: string): Promise<void>;
    /**
     * Attempt to load a file from a Blob or File object.
     * @param file - The uploaded resource to load.
     * @note The file will be routed to the appropriate registry based off the Content-Type for the resource. If no registry exists for the Content-Type of the resource, or if there is no default registry handler, an error will be thrown.
     */
    loadFromFile(file: Blob | File): void;
}

/** The `ContentRegistry` handles registering and processing Content-Types. */
 class ContentRegistry {
    /** The `ContentManager` instance that this registry belongs to. */
    readonly manager: ContentManager;
    
    
    /** Initializes a new instance of this class. */
    constructor(manager: ContentManager);
    /**
     * Creates a new registry entry depending on the options.
     * @param options - The `RegisterOptions` to use when creating the registry entry.
     * @note At least one of the following must be provided in the `RegisterOptions` -- the `mimetypes` property, or `default`.  If this is not true, an Error will be thrown.
     *
     * A registry entry will be over-written if there is a Content-Type collision with a previous registered entry.
     */
    register(options: RegisterOptions): void;
    /**
     * Removes a registry entry.
     * @param contentType - The Content-Type that you want to remove from the registry.
     */
    unregister(contentType: string): void;
    /**
        * Removes the default registry entry.
        * @note - The default registry entry can be set by setting the `default` flag to true when calling `ContentRegistry.register`.
        */
    unregisterDefault(): void;
    /**
     * Retrieves the registry data associated with the Content-Type.
     * @param contentType - The Content-Type to check
     * @note - If there is no explicit registry entry for the Content-Type, then the default registry handler will be return.  If a default does not exist, then an Error will be throw.
     */
    getRegistryData(contentType: string): RegistryData;
}

/** Describes the options needed to create a registry entry. */
 interface RegisterOptions {
    /** Collection of mimetypes to be associated with the registry entry. */
    mimetypes: string[];
    /** Whether this registry entry should be the default handler. */
    default?: boolean;
    /** Callback function to be invoked whenever the `ContentManager` routes a file to this registry. */
    onLoadFromUri: (uri: string) => void;
    /** Callback function to be  invoked whenever the `ContentManager` routes a file to this registry. */
    onLoadFromFile: (file: Blob | File) => void;
}

/**
 * Describes the registry data that is associated with a `Content-Type`
 */
 interface RegistryData {
    /** Callback function to be invoked whenever the `ContentManager` routes a file to this registry. */
    onLoadFromUri: (uri: string) => void;
    /** Callback function to be invoked whenever the `ContentManager` routes a file to this registry. */
    onLoadFromFile: (file: Blob | File) => void;
}
} 
