"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface EventAccordionProps {
  timeShort: string;
  eventTitle: string;
  venue: string;
  tagline: string;
  content?: string | null;
  accent: string;
  index: number;
}

export function EventAccordion({
  timeShort,
  eventTitle,
  venue,
  tagline,
  content,
  accent,
  index,
}: EventAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="w-full rounded-[28px] border-2 px-6 py-5 mb-6 backdrop-blur-sm bg-[#0C1225]/80 overflow-hidden transition-all"
      style={{ borderColor: accent }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
    >
      <div
        onClick={() => content && setIsOpen(!isOpen)}
        className={content ? "cursor-pointer" : ""}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 md:flex-grow">
            <span
              className="font-semibold text-xl tracking-wide"
              style={{ color: accent }}
            >
              {timeShort}
            </span>
            <h3 className="font-semibold text-[22px] text-white">
              {eventTitle}
            </h3>
          </div>
          <div className="flex items-center md:flex-shrink-0">
            <span className="font-normal text-[12px] uppercase tracking-wider text-white/70 mr-4">
              {venue}
            </span>
            {content && (
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <p className="text-white/80 text-[16px] mt-3">{tagline}</p>

      {content && isOpen && (
        <div className="border-t border-white/10 mt-4 pt-4">
          <div className="prose prose-invert prose-sm max-w-none custom-scrollbar max-h-[60vh] overflow-y-auto pr-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                table: ({ ...props }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full border-collapse" {...props} />
                  </div>
                ),
                thead: ({ ...props }) => (
                  <thead className="border-b border-[#34F5FF]/50" {...props} />
                ),
                th: ({ ...props }) => (
                  <th
                    className="text-left py-3 px-4 text-[#B6FFE6] font-medium text-sm"
                    {...props}
                  />
                ),
                td: ({ ...props }) => (
                  <td
                    className="py-2 px-4 border-t border-[#34F5FF]/20 text-white/80"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-[#55B5FF] font-semibold text-lg mt-6 mb-3"
                    {...props}
                  />
                ),
                h4: ({ ...props }) => (
                  <h4
                    className="text-white font-medium text-base mt-4 mb-2"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="text-white/80" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-[#55B5FF] pl-4 py-1 my-4 bg-white/5 rounded-r"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </motion.div>
  );
}
