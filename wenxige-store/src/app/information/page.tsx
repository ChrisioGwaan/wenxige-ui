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
import { useTranslation } from '@/i18n';

const { Title, Paragraph, Text } = Typography;

export default function InformationPage() {
  const { t } = useTranslation();

  const infoCards = [
    {
      icon: <EnvironmentOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
      title: t.information.cards.ourAddress,
      lines: t.information.addressLines,
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
      title: t.information.cards.phone,
      lines: t.information.phoneLines,
    },
    {
      icon: <MailOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
      title: t.information.cards.email,
      lines: t.information.emailLines,
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
      title: t.information.cards.businessHours,
      lines: t.information.hoursLines,
    },
    {
      icon: <GlobalOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
      title: t.information.cards.website,
      lines: t.information.websiteLines,
    },
    {
      icon: <WechatOutlined style={{ fontSize: 28, color: '#2D5016' }} />,
      title: t.information.cards.socialMedia,
      lines: t.information.socialLines,
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> {t.nav.home}</Link> },
            { title: t.nav.about },
          ]}
          style={{ marginBottom: 24 }}
        />
        <Title level={2} style={{ color: '#2D5016', marginBottom: 8 }}>
          {t.information.title}
        </Title>
        <Paragraph style={{ color: '#6B7280', fontSize: 16, marginBottom: 16, maxWidth: 700 }}>
          {t.information.description}
        </Paragraph>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Card
          style={{ borderRadius: 16, marginBottom: 40, border: '1px solid #f0f0f0' }}
          styles={{ body: { padding: '40px 32px' } }}
        >
          <Title level={4} style={{ marginBottom: 16 }}>{t.information.ourMission}</Title>
          <Paragraph style={{ fontSize: 15, color: '#374151', lineHeight: 1.8 }}>
            {t.information.missionText}
          </Paragraph>
          <Divider />
          <Title level={4} style={{ marginBottom: 16 }}>{t.information.whatSetsUsApart}</Title>
          <Space orientation="vertical" size={8}>
            {t.information.apart.map((item: string) => (
              <Text key={item} style={{ fontSize: 15, color: '#374151' }}>
                {item}
              </Text>
            ))}
          </Space>
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <Title level={3} style={{ marginBottom: 24 }}>
          {t.information.contactInformation}
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
                {card.lines.map((line: string) => (
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
