'use client';

import { Typography, Button, Space } from 'antd';
import { ShoppingOutlined, ReadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

const { Title, Paragraph } = Typography;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #FDFBF7 0%, #f0ebe0 30%, #e8e0d0 60%, #FDFBF7 100%)',
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,80,22,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,163,90,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        style={{
          textAlign: 'center',
          maxWidth: 720,
          padding: '60px 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div variants={fadeUp}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 20px',
              borderRadius: 20,
              background: 'rgba(45,80,22,0.08)',
              color: '#2D5016',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 24,
              letterSpacing: 1,
            }}
          >
            {t.hero.badge}
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Title
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#1A1A1A',
              lineHeight: 1.15,
              marginBottom: 0,
              letterSpacing: -1.5,
            }}
          >
            {t.hero.titleLine1}
            <br />
            <span style={{ color: '#2D5016' }}>{t.hero.titleLine2}</span>
          </Title>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Paragraph
            style={{
              fontSize: 18,
              color: '#6B7280',
              maxWidth: 520,
              margin: '24px auto 40px',
              lineHeight: 1.7,
            }}
          >
            {t.hero.subtitle}
          </Paragraph>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Space size={16} wrap style={{ justifyContent: 'center' }}>
            <Link href="/products">
              <Button
                type="primary"
                size="large"
                shape="round"
                icon={<ShoppingOutlined />}
                style={{ height: 52, paddingInline: 32, fontSize: 16, fontWeight: 600 }}
              >
                {t.hero.exploreCollection}
              </Button>
            </Link>
            <Link href="/information">
              <Button
                size="large"
                shape="round"
                icon={<ReadOutlined />}
                style={{ height: 52, paddingInline: 32, fontSize: 16 }}
              >
                {t.hero.ourStory}
              </Button>
            </Link>
          </Space>
        </motion.div>

        <motion.div variants={fadeUp} style={{ marginTop: 60 }}>
          <Space size={48} wrap style={{ justifyContent: 'center' }}>
            {[
              { value: '50+', label: t.hero.teaVarieties },
              { value: '10K+', label: t.hero.happyCustomers },
              { value: '15+', label: t.hero.teaRegions },
              { value: '100%', label: t.hero.authentic },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div
                  style={{ fontSize: 28, fontWeight: 700, color: '#2D5016', lineHeight: 1.2 }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </Space>
        </motion.div>
      </motion.div>
    </section>
  );
}
