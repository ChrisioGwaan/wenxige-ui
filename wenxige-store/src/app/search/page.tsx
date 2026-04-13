'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Row,
  Col,
  Typography,
  Input,
  Card,
  Tag,
  Button,
  Empty,
  Breadcrumb,
  Spin,
} from 'antd';
import { SearchOutlined, ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { products, teaEmojis, type Product } from '@/data/products';
import { useCart } from '@/components/cart/CartContext';
import { useTranslation } from '@/i18n';

const { Title, Text, Paragraph } = Typography;

function ProductCard({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const { t, language } = useTranslation();
  const emoji = teaEmojis[product.category] ?? '🍵';
  const inCart = isInCart(product.id);

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <Card
        hoverable
        styles={{ body: { padding: 0 } }}
        style={{ borderRadius: 12, overflow: 'hidden', height: '100%' }}
      >
        <div
          style={{
            height: 200,
            background: 'linear-gradient(135deg, rgba(45,80,22,0.08) 0%, rgba(196,163,90,0.08) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: 64 }}>{emoji}</span>
          {!product.inStock && (
            <Tag color="default" style={{ position: 'absolute', top: 12, right: 12 }}>{t.searchPage.outOfStock}</Tag>
          )}
          {product.originalPrice && (
            <Tag color="red" style={{ position: 'absolute', top: 12, left: 12 }}>
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </Tag>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <Text strong style={{ fontSize: 16, display: 'block' }}>{language === 'en' ? product.name : product.nameZh}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{language === 'en' ? product.nameZh : product.name}</Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text strong style={{ fontSize: 18, color: '#2D5016' }}>${product.price}</Text>
              {product.originalPrice && (
                <Text delete type="secondary" style={{ fontSize: 12, display: 'block' }}>
                  ${product.originalPrice}
                </Text>
              )}
            </div>
          </div>
          <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 13, marginBottom: 8 }}>
            {product.description}
          </Paragraph>
          <Button
            type={inCart ? 'default' : 'primary'}
            block
            shape="round"
            icon={<ShoppingCartOutlined />}
            disabled={!product.inStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
          >
            {inCart ? t.searchPage.inCart : t.searchPage.addToCart}
          </Button>
        </div>
      </Card>
    </Link>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px 24px' }}><Spin size="large" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const { t, language } = useTranslation();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameZh.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.origin.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> {t.common.home}</Link> },
            { title: t.common.search },
          ]}
          style={{ marginBottom: 24 }}
        />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            🔍 {t.searchPage.title}
          </Title>
          <Paragraph type="secondary" style={{ maxWidth: 500, margin: '0 auto 24px' }}>
            {t.searchPage.description}
          </Paragraph>
          <Input
            size="large"
            placeholder={t.searchPage.searchPlaceholder}
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            allowClear
            style={{ maxWidth: 560, borderRadius: 999 }}
            autoFocus
          />
        </div>
      </AnimatedSection>

      {query.trim() && (
        <AnimatedSection delay={0.15}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
            {results.length} {results.length !== 1 ? t.searchPage.results : t.searchPage.result} {t.searchPage.for} &quot;{query.trim()}&quot;
          </Text>
        </AnimatedSection>
      )}

      {query.trim() && results.length === 0 ? (
        <AnimatedSection delay={0.2}>
          <Empty
            description={
              <span>
                {t.searchPage.noResults} &quot;{query.trim()}&quot;.{' '}
                <Link href="/products">{t.searchPage.browseAllTeas}</Link>
              </span>
            }
          />
        </AnimatedSection>
      ) : (
        <Row gutter={[20, 20]}>
          {results.map((product, idx) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <AnimatedSection delay={0.1 + idx * 0.05}>
                <ProductCard product={product} />
              </AnimatedSection>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
