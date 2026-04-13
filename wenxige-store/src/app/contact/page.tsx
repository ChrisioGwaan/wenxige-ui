'use client';

import { Typography, Form, Input, Button, Row, Col, Card, Space, message } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const contactInfo = [
  {
    icon: <EnvironmentOutlined style={{ fontSize: 20, color: '#2D5016' }} />,
    title: 'Visit Us',
    detail: '123 Tea Garden Road, Jing\'an District, Shanghai, China 200040',
  },
  {
    icon: <PhoneOutlined style={{ fontSize: 20, color: '#2D5016' }} />,
    title: 'Call Us',
    detail: '+86 21 1234 5678',
  },
  {
    icon: <MailOutlined style={{ fontSize: 20, color: '#2D5016' }} />,
    title: 'Email Us',
    detail: 'hello@wenxigetea.com',
  },
  {
    icon: <ClockCircleOutlined style={{ fontSize: 20, color: '#2D5016' }} />,
    title: 'Business Hours',
    detail: 'Mon–Sat: 9:00 AM – 6:00 PM (CST)',
  },
];

export default function ContactPage() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = () => {
    messageApi.success('Thank you! Your message has been sent. We\'ll get back to you soon.');
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      {contextHolder}
      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> Home</Link> },
            { title: 'Contact Us' },
          ]}
          style={{ marginBottom: 24 }}
        />
        <Title level={2} style={{ color: '#2D5016', marginBottom: 8 }}>
          Get in Touch
        </Title>
        <Paragraph style={{ color: '#6B7280', fontSize: 16, marginBottom: 48 }}>
          Have a question about our teas or your order? We&apos;d love to hear from you.
        </Paragraph>
      </AnimatedSection>

      <Row gutter={[48, 48]}>
        <Col xs={24} md={14}>
          <AnimatedSection delay={0.1}>
            <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 32 } }}>
              <Title level={4} style={{ marginBottom: 24 }}>
                Send Us a Message
              </Title>
              <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Your Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input placeholder="John Doe" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                      ]}
                    >
                      <Input placeholder="john@example.com" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: 'Please enter a subject' }]}
                >
                  <Input placeholder="How can we help?" />
                </Form.Item>
                <Form.Item
                  name="message"
                  label="Message"
                  rules={[{ required: true, message: 'Please enter your message' }]}
                >
                  <TextArea rows={5} placeholder="Tell us more about your inquiry..." />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    icon={<SendOutlined />}
                    style={{ paddingInline: 32 }}
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </AnimatedSection>
        </Col>

        <Col xs={24} md={10}>
          <AnimatedSection delay={0.2}>
            <Space orientation="vertical" size={20} style={{ width: '100%' }}>
              {contactInfo.map((item) => (
                <Card
                  key={item.title}
                  style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
                  styles={{ body: { padding: '20px 24px' } }}
                >
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(45,80,22,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: 4 }}>
                        {item.title}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        {item.detail}
                      </Text>
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          </AnimatedSection>
        </Col>
      </Row>
    </div>
  );
}
