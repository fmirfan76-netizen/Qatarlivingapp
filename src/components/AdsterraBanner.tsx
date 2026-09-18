import React, { useState } from 'react';

interface AdsterraBannerProps {
  adKey?: string;
  width?: number;
  height?: number;
  className?: string;
  label?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  adKey = '43df2ac0cbaf2d78b90c39f9e38fd913', // User's 320x50 Adsterra key
  width = 320,
  height = 50,
  className = '',
  label = 'Sponsored Announcement'
}) => {
  const [hasError, setHasError] = useState(false);

  // Sandboxed HTML document ensuring Adsterra executes its document write and invoke.js safely
  const iframeContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${adKey}',
      'format' : 'iframe',
      'height' : ${height},
      'width' : ${width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js" onerror="parent.postMessage('adsterra-failed-${adKey}', '*')"></script>
</body>
</html>`;

  return (
    <div
      className={`my-3 p-2 bg-stone-50/90 rounded-xl border border-stone-200/80 text-center overflow-hidden transition-all ${className}`}
    >
      <div className="flex items-center justify-between px-1 mb-1.5 text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
        <span>{label}</span>
        <span className="text-[9px] text-stone-300">Partner Ad</span>
      </div>

      {!hasError ? (
        <div className="flex items-center justify-center min-h-[50px] overflow-hidden bg-white/50 rounded-lg">
          <iframe
            title="Adsterra Ad"
            srcDoc={iframeContent}
            width={width}
            height={height}
            style={{
              border: 'none',
              overflow: 'hidden',
              maxWidth: '100%',
              display: 'block',
              margin: '0 auto'
            }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onError={() => setHasError(true)}
          />
        </div>
      ) : (
        <div className="p-3 bg-stone-100 rounded-lg text-left flex items-center justify-between">
          <p className="text-[11.5px] text-stone-600 font-medium">
            Direct sponsor advertising available on Qatar Living Jobs
          </p>
          <a
            href="https://wa.me/97400000000"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-[#8e1e3c] hover:underline"
          >
            Contact
          </a>
        </div>
      )}
    </div>
  );
};
