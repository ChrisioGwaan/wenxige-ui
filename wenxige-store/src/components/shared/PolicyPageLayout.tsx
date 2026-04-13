'use client';

import { Typography, Breadcrumb, Card } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';
import { useTranslation } from '@/i18n';

const { Title, Paragraph } = Typography;

type PolicyKey = 'termsOfUse' | 'privacyPolicy' | 'refundPolicy' | 'shippingPolicy' | 'termsAndConditions';

interface PolicyPageLayoutProps {
  titleKey: PolicyKey;
  children?: React.ReactNode;
}

export default function PolicyPageLayout({ titleKey, children }: PolicyPageLayoutProps) {
  const { t } = useTranslation();
  const title = t.policy[titleKey] as string;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
      <AnimatedSection>
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined /> {t.common.home}
                </Link>
              ),
            },
            { title },
          ]}
          style={{ marginBottom: 24 }}
        />
        <Title level={2} style={{ marginBottom: 40, color: '#2D5016' }}>
          {title}
        </Title>
        {children || (
          <Card
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              borderRadius: 12,
              border: '1px dashed #d9d9d9',
            }}
          >
            <Paragraph type="secondary" style={{ fontSize: 16, margin: 0 }}>
              {t.policy.contentPending}
            </Paragraph>
          </Card>
        )}
      </AnimatedSection>
    </div>
  );
}
