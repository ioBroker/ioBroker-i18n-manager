import axios, { AxiosRequestConfig, CancelTokenSource, Method } from 'axios';
import _ from 'lodash/fp';

import {CustomSettings, LoadedGroup, LoadedPath} from '@common/types';
import { TranslatePayload, TranslationError, TreeItem } from '../types';
import { getFormattedPath, getParsedFiles } from './files';
import { getLanguageLabel, getLanguagePath } from './language';

const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';
const IOBROKER_TRANSLATE_URL = 'https://translator.iobroker.in';

export const translate = async (
  text: string,
  source: string,
  target: string,
  path: string[],
  settings: CustomSettings,
  cancelToken: CancelTokenSource,
  isFolderFromIoBroker: boolean,
): Promise<string | TranslationError | undefined | Record<string, string>> => {
  // "Google Translate" doesn't support localized languages
  const targetLanguage = target.split('-')[0];
  const sourceLanguage = source.split('-')[0];

  if (targetLanguage === sourceLanguage) {
    return;
  }

  try {
    if (settings.translationEngine === 'libreIoBroker') {
      if (!isFolderFromIoBroker) {
        return {
          path,
          error: 'Not ioBroker project!',
        };
      }
      const response = await fetchAPI(
        IOBROKER_TRANSLATE_URL,
        'POST',
        {
          text
        }
      );
      response.data.zh = response.data['zh-cn'];
      response.data['zh-CN'] = response.data['zh-cn'];
      return response.data;
    } else if (settings.translationEngine === 'googleIoBroker') {
      if (!isFolderFromIoBroker) {
        return {
          path,
          error: 'Not ioBroker project!',
        };
      }
      const response = await fetchAPI(
        IOBROKER_TRANSLATE_URL,
        'POST',
        {
          text,
          service: 'google',
        }
      );
      response.data.zh = response.data['zh-cn'];
      response.data['zh-CN'] = response.data['zh-cn'];
      return response.data;
    } else if (settings.translationEngine === 'deeplIoBroker') {
      if (!isFolderFromIoBroker) {
        return {
          path,
          error: 'Not ioBroker project!',
        };
      }
      const response = await fetchAPI(
        IOBROKER_TRANSLATE_URL,
        'POST',
        {
          text,
          service: 'deepl',
        }
      );
      response.data.zh = response.data['zh-cn'];
      response.data['zh-CN'] = response.data['zh-cn'];
      return response.data;
    } else if (settings.translationEngine === 'awsIoBroker') {
      if (!isFolderFromIoBroker) {
        return {
          path,
          error: 'Not ioBroker project!',
        };
      }
      const response = await fetchAPI(
        IOBROKER_TRANSLATE_URL,
        'POST',
        {
          text,
          service: 'aws',
        }
      );
      response.data.zh = response.data['zh-cn'];
      response.data['zh-CN'] = response.data['zh-cn'];
      return response.data;
    } else if (settings.translationEngine === 'aws') {
      return {
        path,
        error: 'Not implemented',
      };
    } else if (settings.translationEngine === 'deepl') {
      return {
        path,
        error: 'Not implemented',
      };
    } else {
      // google
      const response = await fetchAPI(
        `${GOOGLE_TRANSLATE_URL}?key=${settings.googleTranslateApiKey}`,
        'POST',
        {
          target: targetLanguage,
          source: sourceLanguage,
          q: text,
          format: 'text',
        },
        {
          cancelToken: cancelToken.token,
        },
      );

      if (response.status === 200) {
        return getGoogleTranslateText(response.data);
      }

      return {
        path,
        error: TRANSLATE_ERRORS.genericGoogleTranslateError(sourceLanguage, targetLanguage),
      };
    }
  } catch (e: any) {
    if (axios.isCancel(e)) {
      throw e;
    }

    const errorMessage = _.getOr(e.message, 'response.data.error.message', e);

    return {
      path,
      error: TRANSLATE_ERRORS.googleTranslateError(errorMessage, sourceLanguage, targetLanguage),
    };
  }
};

const getGoogleTranslateText = (response: any) =>
  _.get('data.translations[0].translatedText', response);

function fetchAPI(url: string, method?: Method, data?: any, config?: AxiosRequestConfig) {
  const requestConfig: AxiosRequestConfig = {
    ...config,
    url,
    method,
    data,
  };

  return axios(requestConfig);
}

export function isIoBroker(folder: LoadedPath[]): boolean {
  if (
      folder.length === 1 &&
      folder[0].type === 'file' &&
      (folder[0] as LoadedGroup).items.length === 11 &&
      (folder[0] as LoadedGroup).items[0].filePath.endsWith('.json')
  ) {
    const parts = (folder[0] as LoadedGroup).items[0].filePath.replace(/\\/g, '/').split('/');
    // remove lang.json
    parts.pop();
    if (parts.length > 6) {
      parts.splice(0, parts.length - 6);
    }
    // try to find in path ioBroker.xx or iobroker.xx
    return !!parts.find(name => name.match(/^io[bB]roker\.[-_0-9a-z]+$/));
  }
  return false;
}

export function getTranslationItems(
  addError: (error: TranslationError) => void,
  folder: LoadedPath[],
  items: TreeItem[],
  payload: TranslatePayload,
) {
  // Collect all items to be translated
  const translationItems: TranslationItem[] = [];

  for (let index = 0; index < items.length; ++index) {
    const item = items[index];
    const parsedFiles = getParsedFiles(folder, item.path);

    const source = parsedFiles.find(it => it.language === payload.sourceLanguage);

    // Get the first filled formatted path
    // This is because some indexes may not have the given path
    let formattedPath: string[] = [];
    for (let i = 0; i < parsedFiles.length; i++) {
      formattedPath = getFormattedPath(folder, item.path, i);
      if (formattedPath.length > 0) {
        break;
      }
    }

    if (!source) {
      addError({
        path: formattedPath,
        error: TRANSLATE_ERRORS.noSourceLanguage(payload.sourceLanguage),
      });
      continue;
    }

    const sourceIndex = parsedFiles.indexOf(source);
    const sourceText = _.get(getLanguagePath(item.path, sourceIndex), folder as any) as string;

    if (!sourceText || sourceText.length === 0) {
      addError({
        path: formattedPath,
        error: TRANSLATE_ERRORS.emptySourceField(payload.sourceLanguage),
      });
      continue;
    }

    for (let parsedFileIndex = 0; parsedFileIndex < parsedFiles.length; parsedFileIndex++) {
      const currentFile = parsedFiles[parsedFileIndex];
      if (!currentFile || !payload.targetLanguages.includes(currentFile.language)) {
        continue;
      }

      if (parsedFileIndex === sourceIndex) {
        continue;
      }

      const text = _.get(getLanguagePath(item.path, parsedFileIndex), folder as any) as string;
      if (text && text.length > 0 && !payload.overwrite) {
        continue;
      }

      if (typeof sourceText === 'object') {
        Object.keys(sourceText).forEach(key => {
          if (payload.overwrite || !currentFile.data[key]) {
            translationItems.push({
              sourceLanguage: source.language,
              targetLanguage: currentFile.language,
              sourceText: sourceText[key],
              formattedPath: [...formattedPath, key],
              index: parsedFileIndex,
              itemId: `${item.id}.${key}`,
            });
          }
        });
      } else {
        translationItems.push({
          sourceLanguage: source.language,
          targetLanguage: currentFile.language,
          sourceText,
          formattedPath,
          index: parsedFileIndex,
          itemId: item.id,
        });
      }
    }
  }

  return translationItems;
}

export const TRANSLATE_ERRORS = {
  noSourceLanguage: (sourceLanguage: string) =>
    // eslint-disable-next-line
    `Couldn't translate because this item doesn't have the source language "${getLanguageLabel(sourceLanguage)}"`,
  emptySourceField: (sourceLanguage: string) =>
    // eslint-disable-next-line
    `Couldn't translate because the field of the source language "${getLanguageLabel(sourceLanguage)}" is empty`,
  genericGoogleTranslateError: (sourceLanguage: string, targetLanguage: string) =>
    // eslint-disable-next-line
    `Google Translate can't translate from "${getLanguageLabel(sourceLanguage)}" to "${getLanguageLabel(targetLanguage)}"`,
  googleTranslateError: (errorMessage: string, sourceLanguage: string, targetLanguage: string) =>
    // eslint-disable-next-line
    `Google Translate error: "${errorMessage}"\n translating from "${getLanguageLabel(sourceLanguage)}" to "${getLanguageLabel(targetLanguage)}"`,
};

export interface TranslationItem {
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  formattedPath: string[];
  index: number;
  itemId: string;
  done?: boolean;
}
