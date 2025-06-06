import { motion } from "framer-motion";

export default function ButtonAnimated({ text, justify = "justify-end", onClick }) {
  return (
    <div className={`flex w-full ${justify} items-center`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-10 flex items-center gap-x-2 py-2 bg-white text-dark-bg rounded-md shadow transition-colors sm:px-16 sm:py-3 cursor-pointer font-medium tracking-widest"
        onClick={onClick} // Ajoutez cette ligne
      >
        {text}
      </motion.button>
    </div>
  );
}
