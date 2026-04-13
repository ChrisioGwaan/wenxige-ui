'use client';

import { Row, Col, Typography, Card } from 'antd';
import {
  SafetyCertificateOutlined,
  CoffeeOutlined,
  ThunderboltOutlined,
  StarOutlined,
  GlobalOutlined,
  BookOutlined,
} from '@ant-design/icons';
import AnimatedSection from '@/components/shared/AnimatedSection';

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Premium Quality',
    description: 'Every tea is sourced from heritage gardens and undergoes rigorous quality testing.',
  },
  {
    icon: <CoffeeOutlined />,
    title: 'Wide Selection',
    description: 'From delicate white teas to robust pu-erhs, explore 50+ curated varieties.',
  },
  {
    icon: <ThunderboltOutlined />,
    title: 'Fresh Harvest',
    description: 'Direct from garden to your cup — sealed at peak freshness for optimal flavor.',
  },
  {
    icon: <StarOutlined />,
    title: 'Expert Curated',
    description: 'Our tea masters personally select each offering for exceptional taste and aroma.',
  },
  {
    icon: <GlobalOutlined />,
    title: 'Worldwide Shipping',
    description: 'Carefully packed and shipped globally with tracking from doorstep to doorstep.',
  },
  {
    icon: <BookOutlined />,
    title: 'Tea Education',
    description: 'Learn the art of brewing with guides, tasting notes, and preparation tips.',
  },
];

export default function FeaturesSection() {
  return (
    <section style={{ padding: '100px 48px', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div
              style={{
                color: '#C4A35A',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Why Choose Us
            </div>
            <Title level={2} style={{ marginBottom: 16, color: '#1A1A1A' }}>
              The Wenxige Difference
            </Title>
            <Paragraph
              style={{
                fontSize: 16,
                color: '#6B7280',
                maxWidth: 560,
                margin: '0 auto',
              }}
            >
              We are committed to bringing you an authentic tea experience rooted in centuries
              of Chinese tradition and craftsmanship.
            </Paragraph>
          </div>
        </AnimatedSection>

        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={feature.title}>
              <AnimatedSection delay={index * 0.08}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    textAlign: 'center',
                    padding: '16px 8px',
                    transition: 'all 0.3s ease',
                  }}
                  styles={{ body: { padding: '32px 24px' } }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #2D5016 0%, #4a7c2e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: 24,
                      color: '#fff',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>
                    {feature.title}
                  </Title>
                  <Paragraph
                    style={{ color: '#6B7280', margin: 0, fontSize: 14, lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Paragraph>
                </Card>
              </AnimatedSection>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
