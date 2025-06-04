import { motion } from 'framer-motion';

export default function ButtonAnimated() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
    >
      Clique moi
    </motion.button>
  );
}
