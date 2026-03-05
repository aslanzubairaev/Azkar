import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
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
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f0c27f 0%, #d4a44a 100%)',
            position: 'absolute',
            left: 5,
            top: 7,
          }}
        />
        {/* Вырез полумесяца — тёмный круг поверх */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            position: 'absolute',
            left: 10,
            top: 5,
          }}
        />
        {/* Звезда — ромбик */}
        <div
          style={{
            position: 'absolute',
            right: 6,
            top: 9,
            width: 5,
            height: 5,
            background: '#f0c27f',
            borderRadius: 1,
            transform: 'rotate(45deg)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
