'use client';

import { Typography, Breadcrumb, Card } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';

const { Title, Paragraph } = Typography;

interface PolicyPageLayoutProps {
  title: string;
  children?: React.ReactNode;
}

export default function PolicyPageLayout({ title, children }: PolicyPageLayoutProps) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
      <AnimatedSection>
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined /> Home
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
              Content for this page is being prepared. Please check back soon.
            </Paragraph>
          </Card>
        )}
      </AnimatedSection>
    </div>
  );
}
