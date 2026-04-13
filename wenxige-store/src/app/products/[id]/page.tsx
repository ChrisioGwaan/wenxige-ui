'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Row,
  Col,
  Typography,
  Button,
  Tag,
  InputNumber,
  Breadcrumb,
  Tabs,
  Divider,
  Card,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { products, teaEmojis } from '@/data/products';
import { useCart } from '@/components/cart/CartContext';

const { Title, Text, Paragraph } = Typography;

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [msgApi, contextHolder] = message.useMessage();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <Title level={3}>Tea not found</Title>
        <Paragraph type="secondary">The tea you&apos;re looking for doesn&apos;t exist.</Paragraph>
        <Link href="/products">
          <Button type="primary" shape="round">Browse All Teas</Button>
        </Link>
      </div>
    );
  }

  const emoji = teaEmojis[product.category] ?? '🍵';
  const inCart = isInCart(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    msgApi.success({ content: `${product.name} added to cart!`, duration: 2 });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
      {contextHolder}

      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> Home</Link> },
            { title: <Link href="/products">Tea Collection</Link> },
            { title: product.name },
          ]}
          style={{ marginBottom: 24 }}
        />
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: 16, paddingLeft: 0 }}
        >
          Back
        </Button>
      </AnimatedSection>

      <Row gutter={[48, 32]}>
        {/* Image gallery */}
        <Col xs={24} md={12}>
          <AnimatedSection delay={0.1}>
            <div
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                background: product.images[selectedImage]?.bgGradient ??
                  'linear-gradient(135deg, rgba(45,80,22,0.08) 0%, rgba(196,163,90,0.08) 100%)',
                height: 420,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                transition: 'background 0.4s ease',
              }}
            >
              <span
                style={{
                  fontSize: 120,
                  transition: 'transform 0.3s ease',
                }}
              >
                {product.images[selectedImage]?.emoji ?? emoji}
              </span>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 12 }}>
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    border: selectedImage === idx ? '2px solid #2D5016' : '2px solid transparent',
                    background: img.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 32,
                    transition: 'all 0.2s ease',
                    opacity: selectedImage === idx ? 1 : 0.6,
                  }}
                >
                  {img.emoji}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </Col>

        {/* Product info */}
        <Col xs={24} md={12}>
          <AnimatedSection delay={0.15}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {product.tags.map((tag) => (
                <Tag key={tag} color="green">{tag}</Tag>
              ))}
              {!product.inStock && <Tag color="default">Out of Stock</Tag>}
            </div>

            <Title level={2} style={{ marginBottom: 0 }}>
              {product.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 18, display: 'block', marginBottom: 16 }}>
              {product.nameZh}
            </Text>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <Text style={{ fontSize: 32, fontWeight: 700, color: '#2D5016' }}>
                ${product.price.toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text delete type="secondary" style={{ fontSize: 18 }}>
                  ${product.originalPrice.toFixed(2)}
                </Text>
              )}
              {product.originalPrice && (
                <Tag color="red">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Tag>
              )}
            </div>

            <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#555' }}>
              {product.description}
            </Paragraph>

            <Divider />

            <Row gutter={[16, 12]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Text type="secondary"><EnvironmentOutlined /> Origin</Text>
                <br />
                <Text strong>{product.origin}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary"><GiftOutlined /> Net Weight</Text>
                <br />
                <Text strong>{product.weight}</Text>
              </Col>
            </Row>

            {product.brewingTip && (
              <div
                style={{
                  background: 'rgba(45,80,22,0.04)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 24,
                  border: '1px solid rgba(45,80,22,0.1)',
                }}
              >
                <Text strong style={{ color: '#2D5016' }}>🍵 Brewing Tip</Text>
                <br />
                <Text type="secondary">{product.brewingTip}</Text>
              </div>
            )}

            {/* Add to cart */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <InputNumber
                min={1}
                max={99}
                value={quantity}
                onChange={(val) => setQuantity(val ?? 1)}
                size="large"
                style={{ width: 100 }}
              />
              <Button
                type="primary"
                size="large"
                shape="round"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{ flex: 1 }}
              >
                {inCart ? 'Add More to Cart' : 'Add to Cart'}
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                <CheckCircleFilled style={{ color: '#52c41a', marginRight: 6 }} />
                Free shipping on orders over $50
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                <SafetyCertificateOutlined style={{ color: '#2D5016', marginRight: 6 }} />
                100% authentic tea guaranteed
              </Text>
            </div>
          </AnimatedSection>
        </Col>
      </Row>

      {/* Tabs section */}
      <AnimatedSection delay={0.25}>
        <Tabs
          defaultActiveKey="details"
          style={{ marginTop: 48 }}
          items={[
            {
              key: 'details',
              label: 'Details',
              children: (
                <Paragraph style={{ fontSize: 15, lineHeight: 2, maxWidth: 800, whiteSpace: 'pre-line' }}>
                  {product.longDescription ?? product.description}
                </Paragraph>
              ),
            },
            {
              key: 'brewing',
              label: 'Brewing Guide',
              children: (
                <div style={{ maxWidth: 600 }}>
                  <Paragraph style={{ fontSize: 15, lineHeight: 2 }}>
                    {product.brewingTip ?? 'Brewing instructions coming soon.'}
                  </Paragraph>
                  <Divider />
                  <Row gutter={[24, 16]}>
                    <Col span={8}>
                      <Text type="secondary">Water Temp</Text>
                      <br />
                      <Text strong>80–95°C</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">Steep Time</Text>
                      <br />
                      <Text strong>1–5 min</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">Leaf Amount</Text>
                      <br />
                      <Text strong>3–5g / 150ml</Text>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </AnimatedSection>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <AnimatedSection delay={0.3}>
          <Divider />
          <Title level={4} style={{ marginBottom: 20 }}>You May Also Like</Title>
          <Row gutter={[20, 20]}>
            {relatedProducts.map((rp) => {
              const rpEmoji = teaEmojis[rp.category] ?? '🍵';
              return (
                <Col xs={12} sm={8} md={6} key={rp.id}>
                  <Link href={`/products/${rp.id}`} style={{ textDecoration: 'none' }}>
                    <Card
                      hoverable
                      styles={{ body: { padding: 12 } }}
                      style={{ borderRadius: 12, overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          height: 120,
                          background: 'linear-gradient(135deg, rgba(45,80,22,0.06) 0%, rgba(196,163,90,0.06) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ fontSize: 42 }}>{rpEmoji}</span>
                      </div>
                      <Text strong style={{ display: 'block', fontSize: 14 }}>{rp.name}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{rp.nameZh}</Text>
                      <br />
                      <Text strong style={{ color: '#2D5016' }}>${rp.price}</Text>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </AnimatedSection>
      )}
    </div>
  );
}
