import { ObjectId } from 'mongodb';
import { getMongoDb } from './mongo';

export type ProjectDoc = {
  _id: ObjectId;
  createdAt: string;
  updatedAt: string;
  activeDesignId: string;
  designs: unknown[];
};

export type ProjectPayload = {
  id: string;
  createdAt: string;
  updatedAt: string;
  activeDesignId: string;
  designs: unknown[];
};

function nowIso() {
  return new Date().toISOString();
}

export async function createProject(input: { designs: unknown[]; activeDesignId: string }) {
  const db = await getMongoDb();
  const ts = nowIso();
  const doc: Omit<ProjectDoc, '_id'> = {
    createdAt: ts,
    updatedAt: ts,
    activeDesignId: input.activeDesignId,
    designs: input.designs,
  };
  const res = await db.collection<ProjectDoc>('projects').insertOne(doc as ProjectDoc);
  const id = res.insertedId;
  return {
    id: id.toHexString(),
    ...doc,
  } satisfies ProjectPayload;
}

export async function getProject(projectId: string): Promise<ProjectPayload | null> {
  if (!ObjectId.isValid(projectId)) return null;
  const db = await getMongoDb();
  const _id = new ObjectId(projectId);
  const doc = await db.collection<ProjectDoc>('projects').findOne({ _id });
  if (!doc) return null;
  return {
    id: doc._id.toHexString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    activeDesignId: doc.activeDesignId,
    designs: doc.designs,
  };
}

export async function updateProject(projectId: string, update: { designs: unknown[]; activeDesignId: string }) {
  if (!ObjectId.isValid(projectId)) return null;
  const db = await getMongoDb();
  const _id = new ObjectId(projectId);
  const ts = nowIso();
  await db.collection<ProjectDoc>('projects').updateOne(
    { _id },
    {
      $set: {
        updatedAt: ts,
        designs: update.designs,
        activeDesignId: update.activeDesignId,
      },
    }
  );
  return getProject(projectId);
}
