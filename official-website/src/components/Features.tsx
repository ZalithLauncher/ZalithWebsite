import { motion } from 'framer-motion';
import { Smartphone, Layout, Settings, Cpu, Globe, Users } from 'lucide-react';

const features = [
  {
    icon: <Layout className="w-6 h-6" />,
    title: "现代化 UI 体验",
    description: "采用 Jetpack Compose 与 Material Design 3 构建，提供丝滑、现代且符合直觉的界面设计。"
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "高性能启动核心",
    description: "基于 PojavLauncher 核心深度优化，针对 Android 设备进行性能调优，确保游戏运行流畅稳定。"
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "完善的版本管理",
    description: "支持版本隔离与自定义路径设置，轻松管理多个游戏版本及其对应的模组与存档。"
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "丰富的渲染器支持",
    description: "内置多种渲染器方案并支持插件扩展，完美适配不同硬件性能的移动设备。"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "多语言支持",
    description: "通过 Weblate 平台驱动的全球化翻译，支持多种语言，让全球玩家都能轻松上手。"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "社区驱动更新",
    description: "活跃的社区支持与开源精神，持续的功能迭代、BUG 修复以及实用的使用指南。"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-[var(--bg-alt)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-1)]">为什么选择 Zalith?</h2>
          <p className="text-[var(--text-2)] max-w-2xl mx-auto">
            我们不仅仅是一个启动器，更是您在移动端畅玩 Java 版的最佳伴侣。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--divider)]/20 hover:border-[var(--brand)]/50 transition-all group shadow-sm hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--text-1)]">{feature.title}</h3>
              <p className="text-[var(--text-2)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
