import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Ukuran standar logo tab browser
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f5a623',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          fontSize: 22,
          fontWeight: 'bold',
          borderRadius: '6px',
        }}
      >
        P
      </div>
    ),
    { ...size }
  );
}