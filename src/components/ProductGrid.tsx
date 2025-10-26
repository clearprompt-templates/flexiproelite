import { motion } from 'framer-motion';
import { Product, Theme } from '../types/config';

interface ProductGridProps {
  products: Product[];
  theme: Theme;
}

export function ProductGrid({ products, theme }: ProductGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            Our Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our suite of powerful tools designed to transform your business
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              <div className="p-6">
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: theme.primaryColor }}
                >
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-4 min-h-[80px]">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: theme.secondaryColor }}
                  >
                    {product.price}
                  </span>

                  <a
                    href={product.ctaLink}
                    className="px-6 py-2 rounded-lg font-semibold text-white transition-all"
                    style={{
                      backgroundColor: theme.primaryColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.secondaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor;
                    }}
                  >
                    {product.ctaText}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
