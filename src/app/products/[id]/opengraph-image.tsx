import { ImageResponse } from 'next/og';
import { getProduct } from '@/lib/products';

export const runtime = 'nodejs';

export const alt = 'Aster Medicines Product';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FE5C02',
          }}
        >
          Aster Medicines
        </div>
      ),
      {
        ...size,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          backgroundColor: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left Side: Image Container */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            backgroundColor: '#f9fafb',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            borderRight: '1px solid #e5e7eb',
          }}
        >
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].startsWith('http') ? product.images[0] : `https://astermedicines.com${product.images[0]}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                backgroundColor: '#FE5C02',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '120px',
                fontWeight: 'bold',
              }}
            >
              {product.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Right Side: Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '60px',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#FE5C02',
                backgroundColor: '#FE5C0215',
                padding: '4px 12px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {product.category}
            </span>
          </div>

          <h1
            style={{
              fontSize: '64px',
              fontWeight: '800',
              color: '#111827',
              lineHeight: '1.2',
              margin: '0 0 20px 0',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: '24px',
              color: '#4b5563',
              lineHeight: '1.5',
              margin: '0 0 40px 0',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                }}
              >
                Estimate Price
              </span>
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#FE5C02',
                }}
              >
                ₹{product.price}
              </span>
            </div>

            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src="https://astermedicines.com/uploads/logo.webp"
                alt="Aster Medicines Logo"
                style={{
                  height: '60px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
