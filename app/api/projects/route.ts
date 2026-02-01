import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createProject } from '@/lib/db/projects';

type CreateProjectBody = {
  designs: unknown[];
  activeDesignId: string;
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const maybe = body as Partial<CreateProjectBody> | null;
  const designs = maybe?.designs;
  const activeDesignId = maybe?.activeDesignId;
  if (!Array.isArray(designs) || typeof activeDesignId !== 'string') {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const project = await createProject({ designs, activeDesignId });
  return NextResponse.json({ success: true, project });
}
