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
import { useTranslation } from '@/i18n';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function ContactPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const contactInfo = [
    {
      icon: <EnvironmentOutlined style={{ fontSize: 20, color: '#2D5016' }} />,
      title: t.contactPage.visitUs,
      detail: t.contactPage.visitUsDetail,
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 20, color: '#2D5016' }} />,
      title: t.contactPage.callUs,
      detail: t.contactPage.callUsDetail,
    },
    {
      icon: <MailOutlined style={{ fontSize: 20, color: '#2D5016' }} />,
      title: t.contactPage.emailUs,
      detail: t.contactPage.emailUsDetail,
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 20, color: '#2D5016' }} />,
      title: t.contactPage.businessHours,
      detail: t.contactPage.hoursDetail,
    },
  ];

  const onFinish = () => {
    messageApi.success(t.contactPage.successMessage);
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      {contextHolder}
      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> {t.nav.home}</Link> },
            { title: t.nav.contact },
          ]}
          style={{ marginBottom: 24 }}
        />
        <Title level={2} style={{ color: '#2D5016', marginBottom: 8 }}>
          {t.contactPage.title}
        </Title>
        <Paragraph style={{ color: '#6B7280', fontSize: 16, marginBottom: 48 }}>
          {t.contactPage.description}
        </Paragraph>
      </AnimatedSection>

      <Row gutter={[48, 48]}>
        <Col xs={24} md={14}>
          <AnimatedSection delay={0.1}>
            <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 32 } }}>
              <Title level={4} style={{ marginBottom: 24 }}>
                {t.contactPage.sendUsMessage}
              </Title>
              <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label={t.contactPage.yourName}
                      rules={[{ required: true, message: t.contactPage.nameRequired }]}
                    >
                      <Input placeholder={t.contactPage.namePlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label={t.contactPage.emailAddress}
                      rules={[
                        { required: true, message: t.contactPage.emailRequired },
                        { type: 'email', message: t.contactPage.emailInvalid },
                      ]}
                    >
                      <Input placeholder={t.contactPage.emailPlaceholder} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="subject"
                  label={t.contactPage.subject}
                  rules={[{ required: true, message: t.contactPage.subjectRequired }]}
                >
                  <Input placeholder={t.contactPage.subjectPlaceholder} />
                </Form.Item>
                <Form.Item
                  name="message"
                  label={t.contactPage.message}
                  rules={[{ required: true, message: t.contactPage.messageRequired }]}
                >
                  <TextArea rows={5} placeholder={t.contactPage.messagePlaceholder} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    icon={<SendOutlined />}
                    style={{ paddingInline: 32 }}
                  >
                    {t.contactPage.sendMessage}
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
