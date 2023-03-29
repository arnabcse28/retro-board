import {
  Template,
  ColumnSettings,
  TemplateDefinition,
  TranslationFunction,
} from './types';
import { getTemplateColumnByType } from './columns';

export function getAllTemplates(t: TranslationFunction): TemplateDefinition[] {
  return [
    {
      type: 'default',
      name: t('Template.default')!,
    },
    {
      type: 'well-not-well-ideas',
      name: t('Template.wellNotWellIdeas')!,
    },
    {
      type: 'well-not-well',
      name: t('Template.wellNotWell')!,
    },
    {
      type: 'mad-sad-glad',
      name: t('Template.madSadGlad')!,
    },
    {
      type: 'start-stop-continue',
      name: t('Template.startStopContinue')!,
    },
    { type: 'four-l', name: t('Template.fourLs')! },
    { type: 'sailboat', name: t('Template.sailboat')! },
  ];
}

export function getTemplate(
  template: Template,
  translations: TranslationFunction
): ColumnSettings[] {
  const dic = getTemplateColumnByType(translations);
  switch (template) {
    case 'default':
      return [dic('well'), dic('notWell'), dic('ideas')];
    case 'well-not-well-ideas':
      return [dic('well'), dic('notWell'), dic('ideas')];
    case 'well-not-well':
      return [dic('well'), dic('notWell')];
    case 'start-stop-continue':
      return [dic('start'), dic('stop'), dic('continue')];
    case 'mad-sad-glad':
      return [dic('mad'), dic('sad'), dic('glad')];
    case 'four-l':
      return [dic('liked'), dic('learned'), dic('lacked'), dic('longedFor')];
    case 'sailboat':
      return [
        dic('anchor'),
        dic('cargo'),
        dic('island'),
        dic('wind'),
        dic('rock'),
      ];
    default:
      return [dic('well'), dic('notWell'), dic('ideas')];
  }
}
