'use client';

import { useState } from 'react';
import {
  Typography,
  Form,
  Input,
  Button,
  Card,
  Steps,
  Result,
  Breadcrumb,
  Space,
} from 'antd';
import {
  SearchOutlined,
  HomeOutlined,
  ShoppingOutlined,
  CarOutlined,
  CheckCircleOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { useTranslation } from '@/i18n';

const { Title, Paragraph, Text } = Typography;

export default function TrackOrderPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [tracked, setTracked] = useState(false);

  const onFinish = () => {
    setTracked(true);
  };

  const onReset = () => {
    setTracked(false);
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px 80px' }}>
      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> {t.nav.home}</Link> },
            { title: t.nav.trackOrder },
          ]}
          style={{ marginBottom: 24 }}
        />
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(45,80,22,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CarOutlined style={{ fontSize: 32, color: '#2D5016' }} />
          </div>
          <Title level={2} style={{ color: '#2D5016', marginBottom: 8 }}>
            {t.trackOrder.title}
          </Title>
          <Paragraph style={{ color: '#6B7280', fontSize: 16 }}>
            {t.trackOrder.description}
          </Paragraph>
        </div>
      </AnimatedSection>

      {!tracked ? (
        <AnimatedSection delay={0.1}>
          <Card
            style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}
            styles={{ body: { padding: 32 } }}
          >
            <Form form={form} layout="vertical" onFinish={onFinish} size="large">
              <Form.Item
                name="orderNumber"
                label={t.trackOrder.orderNumberLabel}
                rules={[{ required: true, message: t.trackOrder.orderRequired }]}
              >
                <Input
                  placeholder={t.trackOrder.orderNumberPlaceholder}
                  prefix={<ShoppingOutlined style={{ color: '#9CA3AF' }} />}
                />
              </Form.Item>
              <Form.Item
                name="contact"
                label={t.trackOrder.emailOrPhone}
                rules={[
                  { required: true, message: t.trackOrder.contactRequired },
                ]}
              >
                <Input placeholder={t.trackOrder.contactPlaceholder} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  shape="round"
                  icon={<SearchOutlined />}
                  block
                  style={{ height: 48, fontSize: 16 }}
                >
                  {t.trackOrder.trackMyOrder}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </AnimatedSection>
      ) : (
        <AnimatedSection>
          <Card
            style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}
            styles={{ body: { padding: 32 } }}
          >
            <Result
              icon={<InboxOutlined style={{ color: '#C4A35A' }} />}
              title={t.trackOrder.demoTitle}
              subTitle={t.trackOrder.demoSubtitle}
            />
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              <Steps
                current={1}
                size="small"
                items={[
                  { title: t.trackOrder.confirmed, icon: <CheckCircleOutlined /> },
                  { title: t.trackOrder.shipped, icon: <CarOutlined /> },
                  { title: t.trackOrder.delivered, icon: <InboxOutlined /> },
                ]}
                style={{ marginBottom: 32 }}
              />
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">{t.trackOrder.orderNumber}</Text>
                  <Text strong>{form.getFieldValue('orderNumber') || 'WXT-DEMO'}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">{t.trackOrder.status}</Text>
                  <Text strong style={{ color: '#2D5016' }}>{t.trackOrder.inTransit}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">{t.trackOrder.estimatedDelivery}</Text>
                  <Text strong>{t.trackOrder.businessDays}</Text>
                </div>
              </Space>
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Button shape="round" onClick={onReset}>
                {t.trackOrder.trackAnother}
              </Button>
            </div>
          </Card>
        </AnimatedSection>
      )}

      <AnimatedSection delay={0.2}>
        <div
          style={{
            textAlign: 'center',
            marginTop: 40,
            padding: 24,
            borderRadius: 12,
            background: 'rgba(45,80,22,0.04)',
          }}
        >
          <Paragraph type="secondary" style={{ margin: 0 }}>
            {t.trackOrder.helpText}{' '}
            <Link href="/contact" style={{ color: '#2D5016', fontWeight: 500 }}>
              {t.trackOrder.contactSupport}
            </Link>
          </Paragraph>
        </div>
      </AnimatedSection>
    </div>
  );
}
