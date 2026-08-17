import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';
import { siteConfig } from '../config';

export default function Header() {
  const { title, subtitle, description } = siteConfig.header;

  return (
    <header className="pt-20 pb-10 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="p-4 bg-stone-200/40 rounded-full text-stone-600">
           <Leaf className="w-6 h-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900">
          {title} <span className="text-stone-300 font-light mx-3">|</span> <span className="font-japanese font-medium text-stone-700">{subtitle}</span>
        </h1>
        <p className="text-stone-500 max-w-md mx-auto text-lg leading-relaxed">
          {description}
        </p>
      </motion.div>
    </header>
  );
}
