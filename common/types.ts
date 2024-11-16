export interface Settings {
  window: {
    width: number;
    height: number;
  };
  customSettings: CustomSettings;
  recentFolders: string[];
}

export interface CustomSettings {
  translationEngine: 'google' | 'deepl' | 'aws' | 'googleIoBroker' | 'libreIoBroker' | 'deeplIoBroker' | 'awsIoBroker';
  googleTranslateApiKey: string;
  awsTranslateApiKey: string;
  deepLTranslateApiKey: string;
  iobrokerTranslateApiKey: string;
  spacesIndentation: '4' | '2'| 'tab' | 'detect' | undefined;
  sortOnSave: 'sort' | 'no sort' | undefined;
  translationFrom: string;
  translationTo: string[];
  translationMode: 'all' | 'this';
  translationOverwrite: boolean;
}

export interface LoadedPath {
  type: 'file' | 'folder';
  name: string;
}

export interface LoadedGroup extends LoadedPath {
  type: 'file';
  items: ParsedFile[];
}

export interface LoadedFolder extends LoadedPath {
  type: 'folder';
  items: LoadedPath[];
}

export interface ParsedFile {
  fileName: string;
  prefix: string;
  language: string;
  extension: string;
  filePath: string;
  data: any;
}

export interface ContextMenuOptions {
  enableCut: boolean;
  enableCopy: boolean;
  enablePaste: boolean;
  x: number;
  y: number;
  isFromTree: boolean;
  isNode: boolean;
  itemId?: string;
}

export interface FormattedFolderPath {
  fullPath: string;
  folder: string;
  path: string;
}
