/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.                 */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
///<reference path="../dts/Leadtools.d.ts"/>
///<reference path="../dts/Leadtools.Controls.d.ts"/>
///<reference path="../dts/Leadtools.Document.d.ts"/>
///<reference path="../dts/Leadtools.Document.Viewer.d.ts"/>
///<reference path="../dts/Leadtools.Controls.d.ts"/>
///<reference path="../dts/Leadtools.Annotations.Engine.d.ts"/>
///<reference path="../dts/Leadtools.Annotations.Rendering.JavaScript.d.ts"/>

import { App } from "./App";
import './index.scss';
// Fetch polyfill
import 'whatwg-fetch';


const getConfigFile = async () => {
   return await fetch('./config.json')
      .then(async (response) => {
         if (!response.ok)
            throw new Error('File not found');

         if (response.status != 200)
            throw new Error(`Failed to get demo configuration with HTTP code: ${response.status}`);

         return await response.json().then((value) => {
            return value;
         });
      })
      .catch((err) => {
         alert(`There was an error retrieving demo configuration: ${err}`);
      })
}

let app: App = null;
window.onload = async () => {
   const config = await getConfigFile();
   if (!config) {
      return;
   }

   const {
      serviceHost,
      servicePath,
      serviceApiPath,
      setEvalLicense
   } = config;

   lt.Document.DocumentFactory.serviceHost = serviceHost;
   lt.Document.DocumentFactory.servicePath = servicePath;
   lt.Document.DocumentFactory.serviceApiPath = serviceApiPath;

   if (!setEvalLicense)
      app = new App({...config});
   else {
      lt.RasterSupport.setLicenseUri('https://demo.leadtools.com/licenses/js/LEADTOOLSEVAL.txt', 'EVAL', () => {
         app = new App({...config});
      });
   }
}

window.onunload = () => {
   if (app)
      app.dispose();
}