import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Полумесяц — основной круг */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f0c27f 0%, #d4a44a 100%)',
            position: 'absolute',
            left: 28,
            top: 40,
          }}
        />
        {/* Вырез полумесяца — тёмный круг поверх */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            position: 'absolute',
            left: 56,
            top: 30,
          }}
        />
        {/* Звезда — ромбик */}
        <div
          style={{
            position: 'absolute',
            right: 34,
            top: 50,
            width: 28,
            height: 28,
            background: 'linear-gradient(135deg, #f0c27f 0%, #d4a44a 100%)',
            borderRadius: 4,
            transform: 'rotate(45deg)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
