'use client';

import { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useTranslation } from '@/i18n';

const { Title, Text } = Typography;

const STORE_LAT = 23.133865;
const STORE_LNG = 113.240239;
const DEFAULT_ZOOM = 15;

export default function StoreMap() {
  const { t } = useTranslation();
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<Record<string, unknown>>;
    TileLayer: React.ComponentType<Record<string, unknown>>;
    Marker: React.ComponentType<Record<string, unknown>>;
    Popup: React.ComponentType<Record<string, unknown>>;
  } | null>(null);

  useEffect(() => {
    // Leaflet must be imported client-side only (no SSR)
    import('leaflet').then((L) => {
      // Fix default marker icon paths (Leaflet + bundlers issue)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });

    import('react-leaflet').then((mod) => {
      setMapComponents({
        MapContainer: mod.MapContainer as unknown as React.ComponentType<Record<string, unknown>>,
        TileLayer: mod.TileLayer as unknown as React.ComponentType<Record<string, unknown>>,
        Marker: mod.Marker as unknown as React.ComponentType<Record<string, unknown>>,
        Popup: mod.Popup as unknown as React.ComponentType<Record<string, unknown>>,
      });
    });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(45,80,22,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <EnvironmentOutlined style={{ fontSize: 24, color: '#2D5016' }} />
        </div>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {t.information.ourLocation ?? 'Our Location'}
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {t.information.locationSubtitle ?? 'Guangzhou, Guangdong, China'}
          </Text>
        </div>
      </div>

      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #f0f0f0',
          height: 400,
          background: '#f5f5f5',
          position: 'relative',
        }}
      >
        {!MapComponents ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}
          >
            <EnvironmentOutlined style={{ fontSize: 32, marginRight: 8 }} />
            Loading map…
          </div>
        ) : (
          <>
            <link
              rel="stylesheet"
              href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
              integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
              crossOrigin=""
            />
            <MapComponents.MapContainer
              center={[STORE_LAT, STORE_LNG]}
              zoom={DEFAULT_ZOOM}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <MapComponents.TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapComponents.Marker position={[STORE_LAT, STORE_LNG]}>
                <MapComponents.Popup>
                  <strong>问溪阁 Wenxige Tea</strong>
                  <br />
                  {t.information.locationSubtitle ?? 'Guangzhou, Guangdong, China'}
                </MapComponents.Popup>
              </MapComponents.Marker>
            </MapComponents.MapContainer>
          </>
        )}
      </div>
    </div>
  );
}
