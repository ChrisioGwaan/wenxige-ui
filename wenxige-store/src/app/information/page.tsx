'use client';

import { Typography, Row, Col, Card, Divider, Breadcrumb, Space } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  HomeOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';

const { Title, Paragraph, Text } = Typography;

const infoCards = [
  {
    icon: <EnvironmentOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
    title: 'Our Address',
    lines: ['123 Tea Garden Road', 'Jing\'an District', 'Shanghai, China 200040'],
  },
  {
    icon: <PhoneOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
    title: 'Phone',
    lines: ['Main: +86 21 1234 5678', 'Toll-Free: 400-123-4567'],
  },
  {
    icon: <MailOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
    title: 'Email',
    lines: ['General: hello@wenxigetea.com', 'Orders: orders@wenxigetea.com', 'Support: support@wenxigetea.com'],
  },
  {
    icon: <ClockCircleOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
    title: 'Business Hours',
    lines: ['Monday–Friday: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 4:00 PM', 'Sunday: Closed'],
  },
  {
    icon: <GlobalOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
    title: 'Website',
    lines: ['www.wenxigetea.com'],
  },
  {
    icon: <WechatOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
    title: 'Social Media',
    lines: ['WeChat: WenxigeTea', 'Instagram: @wenxigetea', 'Facebook: Wenxige Tea'],
  },
];

export default function InformationPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> Home</Link> },
            { title: 'About Us' },
          ]}
          style={{ marginBottom: 24 }}
        />
        <Title level={2} style={{ color: '#2D5016', marginBottom: 8 }}>
          About Wenxige Tea
        </Title>
        <Paragraph style={{ color: '#6B7280', fontSize: 16, marginBottom: 16, maxWidth: 700 }}>
          Wenxige Tea (问溪阁) — &quot;The Pavilion by the Brook&quot; — is a premium Chinese tea
          purveyor dedicated to sharing the finest teas from across China with the world.
        </Paragraph>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Card
          style={{ borderRadius: 16, marginBottom: 40, border: '1px solid #f0f0f0' }}
          styles={{ body: { padding: '40px 32px' } }}
        >
          <Title level={4} style={{ marginBottom: 16 }}>Our Mission</Title>
          <Paragraph style={{ fontSize: 15, color: '#374151', lineHeight: 1.8 }}>
            We believe that a great cup of tea can transform a moment into an experience.
            Our mission is to connect tea lovers around the world with authentic, premium
            Chinese teas — sourced directly from heritage gardens, handcrafted by artisan
            tea masters, and delivered fresh to your doorstep.
          </Paragraph>
          <Divider />
          <Title level={4} style={{ marginBottom: 16 }}>What Sets Us Apart</Title>
          <Space orientation="vertical" size={8}>
            <Text style={{ fontSize: 15, color: '#374151' }}>
              🍃 Direct partnerships with 15+ tea-producing regions across China
            </Text>
            <Text style={{ fontSize: 15, color: '#374151' }}>
              🏔️ Third-generation tea master curation and quality assurance
            </Text>
            <Text style={{ fontSize: 15, color: '#374151' }}>
              📦 Fresh-sealed packaging within 48 hours of harvest
            </Text>
            <Text style={{ fontSize: 15, color: '#374151' }}>
              🌍 Global shipping with careful packaging and tracking
            </Text>
            <Text style={{ fontSize: 15, color: '#374151' }}>
              📚 Educational resources for tea enthusiasts of all levels
            </Text>
          </Space>
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Contact Information
        </Title>
      </AnimatedSection>

      <Row gutter={[24, 24]}>
        {infoCards.map((card, index) => (
          <Col xs={24} sm={12} md={8} key={card.title}>
            <AnimatedSection delay={0.1 + index * 0.06}>
              <Card
                style={{
                  height: '100%',
                  borderRadius: 12,
                  border: '1px solid #f0f0f0',
                  textAlign: 'center',
                }}
                styles={{ body: { padding: '28px 20px' } }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'rgba(45,80,22,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {card.icon}
                </div>
                <Title level={5} style={{ marginBottom: 12 }}>
                  {card.title}
                </Title>
                {card.lines.map((line) => (
                  <div key={line}>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {line}
                    </Text>
                  </div>
                ))}
              </Card>
            </AnimatedSection>
          </Col>
        ))}
      </Row>
    </div>
  );
}
