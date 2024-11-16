import { getSavedSettings } from '../../Settings';

export const fileExtensions = ['.json', '.arb'];

export const parse = (content: string): Promise<any> => {
  try {
    return JSON.parse(content);
  } catch (e) {
    return Promise.resolve(undefined);
  }
};

export const serialize = async (data: object, format?: { indent: 2 | 4 | '\t' | undefined, crlf: '\r' | '\n' | '\r\n' | undefined }): Promise<string | undefined> => {
  try {
    const settings = getSavedSettings();
    let spacesIndent: number | '\t';
    if (settings.customSettings.spacesIndentation === 'detect' || !settings.customSettings.spacesIndentation) {
      spacesIndent = format?.indent || 2;
    } else if (settings.customSettings.spacesIndentation === '2') {
      spacesIndent = 2;
    } else if (settings.customSettings.spacesIndentation === '4') {
      spacesIndent = 4;
    } else if (settings.customSettings.spacesIndentation === 'tab') {
      spacesIndent = '\t';
    } else {
      spacesIndent = 2;
    }

    let text = JSON.stringify(data, null, spacesIndent);
    if (format?.crlf) {
      if (format.crlf === '\r') {
        text = text.replace(/\n/g, '\r');
      } else if (format.crlf === '\r\n') {
        text = text.replace(/\n/g, '\r\n');
      }
      console.log(`Use settings: tab=${spacesIndent === '\t' ? 'tab' : spacesIndent}, crlf=${format?.crlf === '\r\n' ? 'crlf' : (format?.crlf === '\n' ? 'cr' : 'lf')}`)
    } else {
      console.log(`Use settings: tab=${spacesIndent === '\t' ? 'tab' : spacesIndent}`)
    }
    return text;
  } catch (e) {
    return undefined;
  }
};
