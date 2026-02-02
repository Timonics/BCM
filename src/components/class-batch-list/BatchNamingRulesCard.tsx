import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Info, Users, BookOpen, School, Copy, Check } from 'lucide-react';

export function BatchNamingRulesCard() {
  const [copiedFormat, setCopiedFormat] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <CardTitle className="text-base text-blue-900">Batch Naming Rules</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-blue-700 mb-3">
          Follow these naming conventions to maintain consistency across all class batches.
        </p>

        {/* Pre-Youth Format */}
        <div className="p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-[#222B45]">Pre-Youth Class</h4>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  Auto-generated
                </Badge>
              </div>
              <div className="flex items-center gap-2 group">
                <code className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 flex-1">
                  PY2026SET34
                </code>
                <button
                  onClick={() => copyToClipboard('PY2026SET34', 'pre-youth')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 rounded"
                  title="Copy format"
                >
                  {copiedFormat === 'pre-youth' ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">Format:</span> PY + Year + SET + Number
                </p>
                <p className="text-xs text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">Example:</span> PY (Prefix) + 2026 (Year) + SET + 34 (Sequential)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Baptismal Format */}
        <div className="p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-[#222B45]">Baptismal Class</h4>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  Manual
                </Badge>
              </div>
              <div className="flex items-center gap-2 group">
                <code className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 flex-1">
                  Baptismal 2026 January Batch
                </code>
                <button
                  onClick={() => copyToClipboard('Baptismal 2026 January Batch', 'baptismal')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 rounded"
                  title="Copy format"
                >
                  {copiedFormat === 'baptismal' ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">Format:</span> Baptismal + Year + Month + Batch
                </p>
                <p className="text-xs text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">Example:</span> Baptismal + 2026 + January + Batch
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ETS Format */}
        <div className="p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <School className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-[#222B45]">ETS Class</h4>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  Manual
                </Badge>
              </div>
              <div className="flex items-center gap-2 group">
                <code className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 flex-1">
                  ETS 2026 August Batch
                </code>
                <button
                  onClick={() => copyToClipboard('ETS 2026 August Batch', 'ets')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 rounded"
                  title="Copy format"
                >
                  {copiedFormat === 'ets' ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">Format:</span> ETS + Year + Month + Batch
                </p>
                <p className="text-xs text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">Example:</span> ETS + 2026 + August + Batch
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="pt-2 border-t border-blue-200">
          <p className="text-xs text-blue-700 font-medium mb-1">💡 Best Practices</p>
          <ul className="space-y-1 text-xs text-blue-600">
            <li className="flex items-start gap-1.5">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Use consistent capitalization</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Always include the year for clarity</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Use full month names (e.g., January, not Jan)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for modals or smaller spaces
export function BatchNamingRulesCompact() {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-semibold text-blue-900">Batch Naming Format</h4>
          <div className="space-y-1.5 text-xs text-blue-700">
            <div className="flex items-start gap-2">
              <Users className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">Pre-Youth:</span>
                <code className="ml-2 bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200">
                  PY2026SET34
                </code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">Baptismal:</span>
                <code className="ml-2 bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200">
                  Baptismal 2026 January Batch
                </code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <School className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">ETS:</span>
                <code className="ml-2 bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200">
                  ETS 2026 August Batch
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
