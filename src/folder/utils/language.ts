import { LoadedPath, ParsedFile } from '@common/types';
import _ from 'lodash/fp';

import { getLocale, getLocaleLabel } from '@common/language';
import { LanguageListItem, TreeMap, TreeItem } from '../types';
import { getParsedFiles } from './files';

export const LANGUAGE_INDEX_SYMBOL = Symbol('languageIndex');

export const getLanguagePath = (path: any[], languageIndex: number): any[] =>
  path.map(it => (it === LANGUAGE_INDEX_SYMBOL ? languageIndex : it));

export const getLanguageLabel = (language: string): string => {
  const localeLabel = getLocaleLabel(language);
  if (!localeLabel) {
    return language;
  }

  return `${localeLabel} - ${language}`;
};

export const createLanguageList = (
  tree: TreeMap,
  folder: LoadedPath[],
  supportedLanguages: string[],
): LanguageListItem[] => {
  const isSupported = isSupportedLanguage(supportedLanguages);

  return _.pipe(
    // get from tree the file items
    _.filter((it: TreeItem) => it.type === 'file'),
    // get the parsed files for each item
    _.flatMap((it: TreeItem) => getParsedFiles(folder, it.path)),
    // get only items with valid language names
    _.filter((it: ParsedFile) => getLocale(it.language) !== undefined),
    _.map(
        (it: ParsedFile) =>
        ({
          language: it.language,
          label: getLanguageLabel(it.language),
          disabled: !isSupported(it.language),
        } as LanguageListItem),
    ),
    // unique languages
    _.uniqBy((it: LanguageListItem) => it.language),
    _.sortBy((it: LanguageListItem) => it.language),
  )(Object.values(tree)) as LanguageListItem[];
};

const isSupportedLanguage = (supportedLanguages: string[]) => (language: string): boolean =>
  !!supportedLanguages?.find(it => language.startsWith(it)) ?? false;
