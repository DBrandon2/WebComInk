import { motion } from "framer-motion";

export default function ButtonAnimated({ text }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-12 py-2 bg-white text-dark-bg rounded-lg shadow transition-colors sm:px-16 sm:py-3 cursor-pointer font-medium tracking-widest"
    >
      {text}
    </motion.button>
  );
}
