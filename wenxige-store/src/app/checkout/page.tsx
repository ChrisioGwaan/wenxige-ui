'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Form,
  Divider,
  Card,
  Radio,
  Breadcrumb,
  Empty,
  Space,
  message,
} from 'antd';
import {
  HomeOutlined,
  CreditCardOutlined,
  LockOutlined,
  ShoppingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { useCart } from '@/components/cart/CartContext';
import { teaEmojis } from '@/data/products';
import { useTranslation } from '@/i18n';

const { Title, Text, Paragraph } = Typography;

const shippingCountries = [
  { value: 'CN', label: '🇨🇳 China', code: '+86' },
  { value: 'HK', label: '🇭🇰 Hong Kong', code: '+852' },
  { value: 'MO', label: '🇲🇴 Macau', code: '+853' },
  { value: 'TW', label: '🇹🇼 Taiwan', code: '+886' },
  { value: 'JP', label: '🇯🇵 Japan', code: '+81' },
  { value: 'KR', label: '🇰🇷 South Korea', code: '+82' },
  { value: 'SG', label: '🇸🇬 Singapore', code: '+65' },
  { value: 'ID', label: '🇮🇩 Indonesia', code: '+62' },
  { value: 'AU', label: '🇦🇺 Australia', code: '+61' },
  { value: 'NZ', label: '🇳🇿 New Zealand', code: '+64' },
  { value: 'US', label: '🇺🇸 United States', code: '+1' },
  { value: 'GB', label: '🇬🇧 United Kingdom', code: '+44' },
  { value: 'CA', label: '🇨🇦 Canada', code: '+1' },
];

const phoneCodes = shippingCountries.map((c) => ({
  value: c.code,
  label: `${c.label.split(' ')[0]} ${c.code}`,
}));
// Deduplicate codes (US and CA share +1)
const uniquePhoneCodes = phoneCodes.filter(
  (v, i, arr) => arr.findIndex((x) => x.value === v.value) === i,
);

export default function CheckoutPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { items, totalItems, totalPrice, removeItem } = useCart();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [msgApi, contextHolder] = message.useMessage();

  const shippingFee = totalPrice >= 50 ? 0 : 9.99;
  const orderTotal = totalPrice + shippingFee;

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setProcessing(true);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Random success/fail for demo (80% success)
      const success = Math.random() > 0.2;
      if (success) {
        router.push('/checkout/success');
      } else {
        router.push('/checkout/failed');
      }
    } catch {
      msgApi.warning(t.checkout.fieldsRequired);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <Empty
          image={<span style={{ fontSize: 64 }}>🛒</span>}
          description={
            <div>
              <Title level={4} style={{ marginBottom: 8 }}>{t.checkout.emptyCartTitle}</Title>
              <Paragraph type="secondary">{t.checkout.emptyCartDesc}</Paragraph>
              <Link href="/products">
                <Button type="primary" shape="round" icon={<ShoppingOutlined />} size="large">
                  {t.checkout.browseTeas}
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      {contextHolder}

      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> {t.common.home}</Link> },
            { title: <Link href="/products">{t.common.products}</Link> },
            { title: t.checkout.title },
          ]}
          style={{ marginBottom: 24 }}
        />
        <Title level={2} style={{ color: '#2D5016', marginBottom: 32 }}>
          {t.checkout.title}
        </Title>
      </AnimatedSection>

      <Row gutter={[40, 32]}>
        {/* Left: Form */}
        <Col xs={24} lg={14}>
          <AnimatedSection delay={0.1}>
            <Form form={form} layout="vertical" requiredMark="optional" size="large">
              {/* Shipping info */}
              <Card
                title={<Text strong style={{ fontSize: 16 }}>📦 {t.checkout.shippingInfo}</Text>}
                style={{ borderRadius: 12, marginBottom: 24 }}
              >
                <Form.Item
                  name="country"
                  label={t.checkout.countryRegion}
                  rules={[{ required: true, message: t.checkout.selectCountryMsg }]}
                >
                  <Select
                    placeholder={t.checkout.selectCountry}
                    showSearch
                    optionFilterProp="label"
                    options={shippingCountries}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstName"
                      label={t.checkout.firstName}
                      rules={[{ required: true, message: t.checkout.required }]}
                    >
                      <Input placeholder="John" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastName"
                      label={t.checkout.lastName}
                      rules={[{ required: true, message: t.checkout.required }]}
                    >
                      <Input placeholder="Doe" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label={t.checkout.email}
                  rules={[
                    { required: true, message: t.checkout.required },
                    { type: 'email', message: t.checkout.validEmail },
                  ]}
                >
                  <Input placeholder="john@example.com" />
                </Form.Item>

                <Form.Item label={t.checkout.contactNumber} required>
                  <Space.Compact block>
                    <Form.Item
                      name="phoneCode"
                      noStyle
                      rules={[{ required: true, message: t.checkout.codeRequired }]}
                    >
                      <Select
                        style={{ width: 140 }}
                        placeholder={t.checkout.codePlaceholder}
                        showSearch
                        optionFilterProp="label"
                        options={uniquePhoneCodes}
                      />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      noStyle
                      rules={[{ required: true, message: t.checkout.phoneRequired }]}
                    >
                      <Input style={{ width: 'calc(100% - 140px)' }} placeholder={t.checkout.phonePlaceholder} />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>

                <Form.Item
                  name="address"
                  label={t.checkout.address}
                  rules={[{ required: true, message: t.checkout.required }]}
                >
                  <Input placeholder={t.checkout.addressPlaceholder} />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="city"
                      label={t.checkout.city}
                      rules={[{ required: true, message: t.checkout.required }]}
                    >
                      <Input placeholder={t.checkout.cityPlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="state" label={t.checkout.stateProvince}>
                      <Input placeholder={t.checkout.statePlaceholder} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="postalCode"
                  label={t.checkout.postalCode}
                  rules={[{ required: true, message: t.checkout.required }]}
                >
                  <Input placeholder={t.checkout.postalPlaceholder} style={{ maxWidth: 200 }} />
                </Form.Item>
              </Card>

              {/* Payment method */}
              <Card
                title={<Text strong style={{ fontSize: 16 }}>💳 {t.checkout.paymentMethod}</Text>}
                style={{ borderRadius: 12 }}
              >
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Radio value="card" style={{ padding: '12px 0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <CreditCardOutlined /> {t.checkout.creditDebitCard}
                      </span>
                    </Radio>
                    <Radio value="alipay" style={{ padding: '12px 0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        💰 {t.checkout.alipay}
                      </span>
                    </Radio>
                    <Radio value="wechat" style={{ padding: '12px 0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        💬 {t.checkout.wechatPay}
                      </span>
                    </Radio>
                  </div>
                </Radio.Group>

                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    style={{ marginTop: 20, overflow: 'hidden' }}
                  >
                    <Form.Item
                      name="cardNumber"
                      label={t.checkout.cardNumber}
                      rules={[{ required: true, message: t.checkout.required }]}
                    >
                      <Input
                        placeholder={t.checkout.cardNumberPlaceholder}
                        maxLength={19}
                        prefix={<CreditCardOutlined style={{ color: '#bbb' }} />}
                      />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="expiry"
                          label={t.checkout.expiry}
                          rules={[{ required: true, message: t.checkout.required }]}
                        >
                          <Input placeholder={t.checkout.expiryPlaceholder} maxLength={7} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="cvc"
                          label={t.checkout.cvc}
                          rules={[{ required: true, message: t.checkout.required }]}
                        >
                          <Input placeholder={t.checkout.cvcPlaceholder} maxLength={4} prefix={<LockOutlined style={{ color: '#bbb' }} />} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </motion.div>
                )}

                <div
                  style={{
                    marginTop: 16,
                    padding: '10px 14px',
                    background: 'rgba(45,80,22,0.04)',
                    borderRadius: 8,
                    border: '1px solid rgba(45,80,22,0.1)',
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <LockOutlined style={{ marginRight: 6 }} />
                    {t.checkout.demoNotice}
                  </Text>
                </div>
              </Card>
            </Form>
          </AnimatedSection>
        </Col>

        {/* Right: Order summary */}
        <Col xs={24} lg={10}>
          <AnimatedSection delay={0.15}>
            <Card
              title={<Text strong style={{ fontSize: 16 }}>🧾 {t.checkout.orderSummary}</Text>}
              style={{ borderRadius: 12, position: 'sticky', top: 96 }}
            >
              <div style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 16 }}>
                {items.map((item) => {
                  const emoji = teaEmojis[item.product.category] ?? '🍵';
                  return (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        gap: 12,
                        padding: '10px 0',
                        borderBottom: '1px solid #f5f5f5',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          background: 'linear-gradient(135deg, rgba(45,80,22,0.08) 0%, rgba(196,163,90,0.08) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          flexShrink: 0,
                        }}
                      >
                        {emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ display: 'block', fontSize: 13 }} ellipsis>
                          {language === 'en' ? item.product.name : item.product.nameZh}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {t.checkout.qty}: {item.quantity} × ${item.product.price.toFixed(2)}
                        </Text>
                      </div>
                      <Text strong style={{ color: '#2D5016', fontSize: 13, whiteSpace: 'nowrap' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeItem(item.product.id)}
                      />
                    </div>
                  );
                })}
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">{t.checkout.subtotal} ({totalItems} {t.checkout.items})</Text>
                <Text>${totalPrice.toFixed(2)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">{t.checkout.shipping}</Text>
                <Text>{shippingFee === 0 ? <span style={{ color: '#52c41a' }}>{t.checkout.free}</span> : `$${shippingFee.toFixed(2)}`}</Text>
              </div>
              {shippingFee > 0 && (
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
                  {t.checkout.freeShippingNote}
                </Text>
              )}

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={5} style={{ margin: 0 }}>{t.checkout.total}</Title>
                <Title level={4} style={{ margin: 0, color: '#2D5016' }}>
                  ${orderTotal.toFixed(2)}
                </Title>
              </div>

              <Button
                type="primary"
                block
                shape="round"
                size="large"
                loading={processing}
                onClick={handleSubmit}
                style={{ height: 48, fontSize: 16 }}
              >
                {processing ? t.checkout.processing : `${t.checkout.pay} $${orderTotal.toFixed(2)}`}
              </Button>

              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <LockOutlined style={{ marginRight: 4 }} />
                  {t.checkout.secureCheckout}
                </Text>
              </div>
            </Card>
          </AnimatedSection>
        </Col>
      </Row>
    </div>
  );
}
