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
      msgApi.warning('Please fill in all required fields.');
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <Empty
          image={<span style={{ fontSize: 64 }}>🛒</span>}
          description={
            <div>
              <Title level={4} style={{ marginBottom: 8 }}>Your cart is empty</Title>
              <Paragraph type="secondary">Add some teas before checking out.</Paragraph>
              <Link href="/products">
                <Button type="primary" shape="round" icon={<ShoppingOutlined />} size="large">
                  Browse Teas
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
            { title: <Link href="/"><HomeOutlined /> Home</Link> },
            { title: <Link href="/products">Products</Link> },
            { title: 'Checkout' },
          ]}
          style={{ marginBottom: 24 }}
        />
        <Title level={2} style={{ color: '#2D5016', marginBottom: 32 }}>
          Checkout
        </Title>
      </AnimatedSection>

      <Row gutter={[40, 32]}>
        {/* Left: Form */}
        <Col xs={24} lg={14}>
          <AnimatedSection delay={0.1}>
            <Form form={form} layout="vertical" requiredMark="optional" size="large">
              {/* Shipping info */}
              <Card
                title={<Text strong style={{ fontSize: 16 }}>📦 Shipping Information</Text>}
                style={{ borderRadius: 12, marginBottom: 24 }}
              >
                <Form.Item
                  name="country"
                  label="Country / Region"
                  rules={[{ required: true, message: 'Please select a country' }]}
                >
                  <Select
                    placeholder="Select country"
                    showSearch
                    optionFilterProp="label"
                    options={shippingCountries}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="John" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="Doe" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Required' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input placeholder="john@example.com" />
                </Form.Item>

                <Form.Item label="Contact Number" required>
                  <Space.Compact block>
                    <Form.Item
                      name="phoneCode"
                      noStyle
                      rules={[{ required: true, message: 'Code required' }]}
                    >
                      <Select
                        style={{ width: 140 }}
                        placeholder="Code"
                        showSearch
                        optionFilterProp="label"
                        options={uniquePhoneCodes}
                      />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      noStyle
                      rules={[{ required: true, message: 'Phone number required' }]}
                    >
                      <Input style={{ width: 'calc(100% - 140px)' }} placeholder="Phone number" />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input placeholder="Street address" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="City" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="state" label="State / Province">
                      <Input placeholder="State / Province" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="postalCode"
                  label="Postal Code"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input placeholder="Postal code" style={{ maxWidth: 200 }} />
                </Form.Item>
              </Card>

              {/* Payment method */}
              <Card
                title={<Text strong style={{ fontSize: 16 }}>💳 Payment Method</Text>}
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
                        <CreditCardOutlined /> Credit / Debit Card
                      </span>
                    </Radio>
                    <Radio value="alipay" style={{ padding: '12px 0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        💰 Alipay
                      </span>
                    </Radio>
                    <Radio value="wechat" style={{ padding: '12px 0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        💬 WeChat Pay
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
                      label="Card Number"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        prefix={<CreditCardOutlined style={{ color: '#bbb' }} />}
                      />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="expiry"
                          label="Expiry"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <Input placeholder="MM / YY" maxLength={7} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="cvc"
                          label="CVC"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <Input placeholder="123" maxLength={4} prefix={<LockOutlined style={{ color: '#bbb' }} />} />
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
                    This is a demo checkout. No real payment will be processed.
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
              title={<Text strong style={{ fontSize: 16 }}>🧾 Order Summary</Text>}
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
                          {item.product.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Qty: {item.quantity} × ${item.product.price.toFixed(2)}
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
                <Text type="secondary">Subtotal ({totalItems} items)</Text>
                <Text>${totalPrice.toFixed(2)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Shipping</Text>
                <Text>{shippingFee === 0 ? <span style={{ color: '#52c41a' }}>Free</span> : `$${shippingFee.toFixed(2)}`}</Text>
              </div>
              {shippingFee > 0 && (
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
                  Free shipping on orders over $50
                </Text>
              )}

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={5} style={{ margin: 0 }}>Total</Title>
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
                {processing ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
              </Button>

              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <LockOutlined style={{ marginRight: 4 }} />
                  Secure checkout — Demo mode
                </Text>
              </div>
            </Card>
          </AnimatedSection>
        </Col>
      </Row>
    </div>
  );
}
