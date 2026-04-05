import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AI Humanizer - Polish & Refine AI-Generated Text';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 背景装饰圆 */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
        }} />

        {/* 标签 */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '100px',
          padding: '8px 24px',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '20px',
          marginBottom: '24px',
          display: 'flex',
        }}>
          ✦ Free AI Writing Tool
        </div>

        {/* 主标题 */}
        <div style={{
          fontSize: '88px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '16px',
          display: 'flex',
        }}>
          AI Humanizer
        </div>

        {/* 副标题 */}
        <div style={{
          fontSize: '36px',
          color: 'rgba(221, 214, 254, 0.9)',
          marginBottom: '48px',
          display: 'flex',
        }}>
          Polish &amp; Refine AI-Generated Text
        </div>

        {/* 特性标签 */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Standard', 'Academic', 'Creative'].map((label) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '100px',
              padding: '10px 28px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '24px',
              display: 'flex',
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* 域名 */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '22px',
          display: 'flex',
        }}>
          aihumanizer.life
        </div>
      </div>
    ),
    { ...size }
  );
}
