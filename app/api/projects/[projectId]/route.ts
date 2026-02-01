import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getProject, updateProject } from '@/lib/db/projects';

type UpdateProjectBody = {
  designs: unknown[];
  activeDesignId: string;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const project = await getProject(params.projectId);
  if (!project) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
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

  const maybe = body as Partial<UpdateProjectBody> | null;
  const designs = maybe?.designs;
  const activeDesignId = maybe?.activeDesignId;
  if (!Array.isArray(designs) || typeof activeDesignId !== 'string') {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const project = await updateProject(params.projectId, { designs, activeDesignId });
  if (!project) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}
