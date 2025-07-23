import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

const DATA_DIR = path.join(process.cwd(), 'data');

function getAllMarkdownFiles() {
    return glob.sync('**/*.md', { cwd: DATA_DIR, nodir: true });
}

function getAllDirsAndFiles(prefix: string) {
    return glob.sync(`${prefix}*`, { cwd: DATA_DIR, mark: true });
}

export async function GET(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
    const { searchParams } = new URL(req.url);
    const params = await context.params;
    const slug = params?.slug || [];

    if (slug[0] === 'note') {
        const relPath = searchParams.get('path');
        if (!relPath) return new NextResponse('Missing path', { status: 400 });
        const filePath = path.join(DATA_DIR, relPath);
        if (!fs.existsSync(filePath)) return new NextResponse('File not found', { status: 404 });
        const content = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json({ content });
    }

    const q = searchParams.get('q') || '';

    if (!fs.existsSync(DATA_DIR)) {
        return NextResponse.json([
            {
                type: 'feedback',
                message: 'Das /data Verzeichnis existiert nicht. Soll es erstellt werden?'
            }
        ]);
    }

    // Path suggestion mode: looks like a path
    if (/[/\\]/.test(q) || q.endsWith('.md')) {
        const suggestions = getAllDirsAndFiles(q).map(p => ({
            type: p.endsWith('/') ? 'path-suggestion' : 'file-match',
            path: p.replace(/\\/g, '/')
        }));
        if (suggestions.length === 0) {
            return NextResponse.json([
                {
                    type: 'feedback',
                    message: 'Keine passenden Dateien oder Ordner gefunden.'
                }
            ]);
        }
        return NextResponse.json(suggestions);
    }

    // Fulltext search mode
    const mdFiles = getAllMarkdownFiles();
    if (mdFiles.length === 0) {
        return NextResponse.json([
            {
                type: 'feedback',
                message: 'Es sind keine Markdown-Dateien im /data Verzeichnis vorhanden.'
            }
        ]);
    }
    const results: { type: string; path: string; line: string; lineNumber: number }[] = [];
    mdFiles.forEach(file => {
        const filePath = path.join(DATA_DIR, file);
        const lines = fs.readFileSync(filePath, 'utf8').split('\n');
        lines.forEach((line, idx) => {
            if (line.toLowerCase().includes(q.toLowerCase())) {
                results.push({
                    type: 'file-match',
                    path: file.replace(/\\/g, '/'),
                    line: line.trim(),
                    lineNumber: idx + 1
                });
            }
        });
    });
    if (results.length === 0) {
        return NextResponse.json([
            {
                type: 'feedback',
                message: 'Keine Treffer gefunden.'
            }
        ]);
    }
    return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
    const { path: relPath, content } = await req.json();
    if (!relPath) return new NextResponse('Missing path', { status: 400 });
    const filePath = path.join(DATA_DIR, relPath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content || '', 'utf8');
    return NextResponse.json({ success: true });
}
