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

const { Title, Paragraph, Text } = Typography;

export default function TrackOrderPage() {
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
            { title: <Link href="/"><HomeOutlined /> Home</Link> },
            { title: 'Track Order' },
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
            Track Your Order
          </Title>
          <Paragraph style={{ color: '#6B7280', fontSize: 16 }}>
            Enter your order details below to check the current status of your shipment.
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
                label="Order Number"
                rules={[{ required: true, message: 'Please enter your order number' }]}
              >
                <Input
                  placeholder="e.g. WXT-20260401-001"
                  prefix={<ShoppingOutlined style={{ color: '#9CA3AF' }} />}
                />
              </Form.Item>
              <Form.Item
                name="contact"
                label="Email or Phone Number"
                rules={[
                  { required: true, message: 'Please enter your email or phone number' },
                ]}
              >
                <Input placeholder="john@example.com or +1 234 567 8900" />
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
                  Track My Order
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
              title="Order Tracking — Demo"
              subTitle="This is a placeholder. Once the backend is connected, real tracking information will appear here."
            />
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              <Steps
                current={1}
                size="small"
                items={[
                  { title: 'Confirmed', icon: <CheckCircleOutlined /> },
                  { title: 'Shipped', icon: <CarOutlined /> },
                  { title: 'Delivered', icon: <InboxOutlined /> },
                ]}
                style={{ marginBottom: 32 }}
              />
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Order Number</Text>
                  <Text strong>{form.getFieldValue('orderNumber') || 'WXT-DEMO'}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Status</Text>
                  <Text strong style={{ color: '#2D5016' }}>In Transit</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Estimated Delivery</Text>
                  <Text strong>3–5 business days</Text>
                </div>
              </Space>
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Button shape="round" onClick={onReset}>
                Track Another Order
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
            Having trouble tracking your order?{' '}
            <Link href="/contact" style={{ color: '#2D5016', fontWeight: 500 }}>
              Contact our support team
            </Link>
          </Paragraph>
        </div>
      </AnimatedSection>
    </div>
  );
}
