import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import {
  activismUpdateSchema,
  blogPostSchema,
  equipmentAssetSchema,
  experienceSchema,
  lodgingUnitSchema,
  pageSchema,
  workshopIntakeSchema,
  workshopSchema,
} from './types';

const root = path.resolve(process.cwd(), '..', 'cms');

type CollectionConfig = {
  dir: string;
  schema: { parse(value: unknown): unknown };
  extension?: '.mdx' | '.json';
};

export const contentCollections: Record<string, CollectionConfig> = {
  pages: { dir: 'pages', schema: pageSchema },
  blog: { dir: 'blog', schema: blogPostSchema },
  activism: { dir: 'activism', schema: activismUpdateSchema },
  experiences: { dir: 'experiences', schema: experienceSchema },
  workshops: { dir: 'workshops', schema: workshopSchema, extension: '.json' },
  workshopIntake: { dir: path.join('workshops', 'intake'), schema: workshopIntakeSchema, extension: '.json' },
  equipment: { dir: 'equipment', schema: equipmentAssetSchema, extension: '.json' },
  lodging: { dir: 'units', schema: lodgingUnitSchema, extension: '.json' },
};

export function validateCollection(name: keyof typeof contentCollections) {
  const collection = contentCollections[name];
  const directory = path.join(root, collection.dir);
  const extension = collection.extension ?? '.mdx';
  const entries = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(extension) && file !== 'schema.json');

  return entries.map((entry) => {
    const source = fs.readFileSync(path.join(directory, entry), 'utf8');
    if (extension === '.mdx') {
      const parsed = matter(source);
      return collection.schema.parse(parsed.data);
    }

    return collection.schema.parse(JSON.parse(source));
  });
}
