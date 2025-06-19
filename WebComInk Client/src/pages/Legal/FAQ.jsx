import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  User,
  Database,
  MessageCircle,
  Bug,
  Shield,
} from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "Qu'est-ce que WebComInk ?",
      answer:
        "WebComInk est un site permettant de lire des scans de mangas en ligne et de suivre leurs parutions, en utilisant l'API MangaDex.",
      icon: HelpCircle,
    },
    {
      question: "Faut-il créer un compte pour lire les mangas ?",
      answer:
        "Non, la lecture est accessible sans compte. Créer un compte permet de suivre vos lectures, gérer votre bibliothèque, commenter et personnaliser votre profil.",
      icon: User,
    },
    {
      question: "Comment fonctionne l'intégration avec MangaDex ?",
      answer:
        "WebComInk utilise l'API MangaDex pour récupérer les contenus. Nous respectons leur politique de propriété intellectuelle et ne stockons pas les scans.",
      icon: Database,
    },
    {
      question: "Puis-je poster des commentaires ?",
      answer:
        "Oui, vous pouvez poster des commentaires sur les chapitres. Merci de respecter les règles de courtoisie et la législation en vigueur.",
      icon: MessageCircle,
    },
    {
      question: "Comment signaler un bug ou un problème ?",
      answer:
        "Pour signaler un bug, merci de nous contacter par mail à contact.webcomink@gmail.com.",
      icon: Bug,
    },
    {
      question: "Qu'en est-il de la protection de mes données personnelles ?",
      answer:
        "Nous traitons vos données conformément à notre Politique de confidentialité, disponible sur le site.",
      icon: Shield,
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.5,
          ease: [0.04, 0.62, 0.23, 0.98],
        },
        opacity: {
          duration: 0.4,
          delay: 0.15,
          ease: "easeOut",
        },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        opacity: {
          duration: 0.2,
          ease: "easeIn",
        },
        height: {
          duration: 0.4,
          delay: 0.1,
          ease: [0.04, 0.62, 0.23, 0.98],
        },
      },
    },
  };

  function AccordionItem({
    question,
    answer,
    icon: Icon,
    isOpen,
    onToggle,
    id,
  }) {
    return (
      <motion.article variants={itemVariants} className="group">
        <div className="border border-gray-700/50 rounded-xl overflow-hidden bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-sm hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-accent)]/10">
          <motion.button
            onClick={onToggle}
            className="flex items-center justify-between w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:ring-inset transition-all duration-200 cursor-pointer"
            aria-expanded={isOpen}
            aria-controls={`faq-${id}`}
            id={`faq-button-${id}`}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
            whileTap={{ scale: 0.995 }}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <span className="text-lg font-montserrat text-white group-hover:text-[var(--color-accent)] transition-colors duration-300">
                {question}
              </span>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-shrink-0 ml-4"
            >
              <ChevronDown className="w-5 h-5 text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300" />
            </motion.div>
          </motion.button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={`faq-${id}`}
                role="region"
                aria-labelledby={`faq-button-${id}`}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2">
                  <div className="pl-14">
                    <div className="text-gray-300 text-base leading-relaxed font-poppins">
                      {answer}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-dark-bg)] text-white px-6 py-12 max-w-4xl mx-auto font-poppins">
      {/* Header avec animation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)]/10 mb-6"
        >
          <HelpCircle className="w-8 h-8 text-[var(--color-accent)]" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-montserrat text-[var(--color-accent)] mb-4">
          Foire Aux Questions
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Trouvez rapidement les réponses à vos questions les plus fréquentes
        </motion.p>
      </motion.div>

      {/* FAQ Items */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {faqs.map(({ question, answer, icon }, index) => (
          <AccordionItem
            key={index}
            id={index}
            question={question}
            answer={answer}
            icon={icon}
            isOpen={openIndex === index}
            onToggle={() => toggle(index)}
          />
        ))}
      </motion.section>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
          <h3 className="text-xl font-montserrat text-white mb-3">
            Vous ne trouvez pas votre réponse ?
          </h3>
          <p className="text-gray-400 mb-6">
            N'hésitez pas à nous contacter pour toute question supplémentaire
          </p>
          <motion.a
            href="mailto:contact.webcomink@gmail.com"
            className="inline-flex items-center px-6 py-3 bg-[var(--color-accent)] text-white font-medium rounded-lg hover:bg-[var(--color-accent)]/90 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Nous contacter
          </motion.a>
        </div>
      </motion.div>
    </main>
  );
}
