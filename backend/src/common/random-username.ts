import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { v4 } from 'uuid';

export function generateUsername() {
  const shortName: string = uniqueNamesGenerator({
    dictionaries: [colors, adjectives, animals],
    separator: ' ',
    style: 'capital',
    length: 3,
    seed: v4(),
  });

  return shortName;
}
