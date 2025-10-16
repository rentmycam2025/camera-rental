// src/components/MarkdownPage.jsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownPage = ({ content }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-6");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => {
      el.classList.add(
        "opacity-0",
        "translate-y-6",
        "transition-all",
        "duration-700",
        "ease-out"
      );
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]);

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      if (!inline && language) {
        return (
          <div className="my-6 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
              <span className="text-sm text-gray-300 font-mono">
                {language}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    String(children).replace(/\n$/, "")
                  );
                }}
                className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-1"
              >
                📋 Copy
              </button>
            </div>
            <SyntaxHighlighter
              style={atomDark}
              language={language}
              PreTag="div"
              className="!m-0 !rounded-none"
              showLineNumbers
              customStyle={{
                background: "rgb(30, 30, 30)",
                fontSize: "0.875rem",
                lineHeight: "1.5",
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md text-sm font-mono border border-gray-200 dark:border-gray-700"
          {...props}
        >
          {children}
        </code>
      );
    },

    h1: ({ node, ...props }) => (
      <h1
        className="text-4xl font-bold text-gray-900 dark:text-white mt-8 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700"
        {...props}
      />
    ),

    h2: ({ node, ...props }) => (
      <h2
        className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4"
        {...props}
      />
    ),

    h3: ({ node, ...props }) => (
      <h3
        className="text-xl font-medium text-gray-700 dark:text-gray-200 mt-6 mb-3"
        {...props}
      />
    ),

    p: ({ node, ...props }) => (
      <p
        className="text-gray-700 dark:text-gray-300 leading-7 mb-4 text-lg"
        {...props}
      />
    ),

    blockquote: ({ node, ...props }) => (
      <blockquote
        className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-6 py-4 my-6 italic text-gray-700 dark:text-gray-300 rounded-r-lg"
        {...props}
      />
    ),

    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <table
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          {...props}
        />
      </div>
    ),

    th: ({ node, ...props }) => (
      <th
        className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
        {...props}
      />
    ),

    td: ({ node, ...props }) => (
      <td
        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
        {...props}
      />
    ),

    ul: ({ node, ...props }) => (
      <ul
        className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300 text-lg"
        {...props}
      />
    ),

    ol: ({ node, ...props }) => (
      <ol
        className="list-decimal list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300 text-lg"
        {...props}
      />
    ),

    li: ({ node, ...props }) => (
      <li className="pl-2 my-2 leading-7" {...props} />
    ),

    a: ({ node, ...props }) => (
      <a
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors font-medium"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),

    img: ({ node, ...props }) => (
      <img
        className="rounded-lg shadow-md max-w-full h-auto my-6 mx-auto border border-gray-200 dark:border-gray-700"
        loading="lazy"
        {...props}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="animate-on-scroll">
          <article
            className="prose prose-lg max-w-none 
            prose-headings:font-semibold
            prose-h1:text-gray-900 prose-h2:text-gray-800 prose-h3:text-gray-700
            dark:prose-invert
            dark:prose-h1:text-white dark:prose-h2:text-gray-100 dark:prose-h3:text-gray-200
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-a:no-underline
            prose-blockquote:not-italic
            prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-transparent
            prose-img:rounded-xl
            prose-table:overflow-hidden
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-hr:border-gray-300 dark:prose-hr:border-gray-600
            transform-gpu"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      {/* Floating scroll indicator */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 transform translate-y-4 animate-fade-in-up"
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .dark ::-webkit-scrollbar-track {
          background: #374151;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #6b7280;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default MarkdownPage;
