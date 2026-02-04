import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

type SectionType = 'market' | 'competition' | 'risk' | 'default';

interface MarkdownRendererProps {
  content: string;
  section?: SectionType;
}

const sectionColors: Record<SectionType, { header: string; accent: string; bg: string; border: string; icon: string }> = {
  market: {
    header: 'text-blue-900',
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
  },
  competition: {
    header: 'text-emerald-900',
    accent: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
  },
  risk: {
    header: 'text-amber-900',
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
  },
  default: {
    header: 'text-gray-900',
    accent: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: 'text-gray-600',
  },
};

const extractText = (children: any): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (children?.props?.children) {
    return extractText(children.props.children);
  }
  return '';
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, section = 'default' }) => {
  const colors = sectionColors[section];

  const getListItemStyle = (children: any) => {
    const text = extractText(children);

    if (text.includes('Risk') || text.includes('Challenge') || text.includes('Issue')) {
      return 'warning';
    }
    if (text.includes('Opportunity') || text.includes('Advantage') || text.includes('Growth')) {
      return 'success';
    }
    if (text.includes('Threat') || text.includes('Critical') || text.includes('Severe')) {
      return 'error';
    }
    return 'default';
  };

  const components = {
    h1: ({ ...props }: any) => (
      <h1 className={`text-4xl font-bold ${colors.header} mt-8 mb-6`} {...props} />
    ),
    h2: ({ ...props }: any) => (
      <div className={`mt-8 mb-6 flex items-center gap-3`}>
        <div className={`w-1 h-10 rounded-full ${colors.accent}`} />
        <h2 className={`text-3xl font-bold ${colors.header}`} {...props} />
      </div>
    ),
    h3: ({ ...props }: any) => (
      <h3 className={`text-2xl font-semibold ${colors.header} mt-6 mb-4 flex items-center gap-2`}>
        <div className={`w-2 h-2 rounded-full ${colors.accent}`} />
        <span {...props} />
      </h3>
    ),
    h4: ({ ...props }: any) => (
      <h4 className={`text-lg font-semibold ${colors.header} mt-4 mb-3 italic`} {...props} />
    ),
    p: ({ ...props }: any) => (
      <p className={`${colors.accent.replace('text-', 'text-')} text-gray-700 leading-8 mb-4 text-base`} {...props} />
    ),
    ul: ({ ...props }: any) => (
      <ul className="space-y-3 mb-6 ml-2" {...props} />
    ),
    ol: ({ ...props }: any) => (
      <ol className="space-y-3 mb-6 ml-6 list-decimal text-gray-700" {...props} />
    ),
    li: ({ children, ...props }: any) => {
      const style = getListItemStyle(children);
      const iconMap = {
        success: <CheckCircle2 className={`w-5 h-5 text-green-600 flex-shrink-0 mt-0.5`} />,
        warning: <AlertCircle className={`w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5`} />,
        error: <AlertCircle className={`w-5 h-5 text-red-600 flex-shrink-0 mt-0.5`} />,
        default: <ChevronRight className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />,
      };

      const bgMap = {
        success: 'bg-green-50 border border-green-200',
        warning: 'bg-amber-50 border border-amber-200',
        error: 'bg-red-50 border border-red-200',
        default: '',
      };

      return (
        <li className={`text-gray-700 leading-relaxed flex items-start gap-3 ml-0 p-2 rounded ${bgMap[style as keyof typeof bgMap]}`}>
          {iconMap[style as keyof typeof iconMap]}
          <span {...props}>{children}</span>
        </li>
      );
    },
    strong: ({ children, ...props }: any) => {
      const text = extractText(children);
      let badgeClass = 'bg-gray-200 text-gray-900';

      if (text.includes('Critical') || text.includes('High')) badgeClass = 'bg-red-200 text-red-900';
      if (text.includes('Opportunity')) badgeClass = 'bg-green-200 text-green-900';
      if (text.includes('Medium')) badgeClass = 'bg-amber-200 text-amber-900';

      return (
        <strong className={`font-bold px-2 py-1 rounded inline-block mr-1 ${badgeClass}`} {...props}>
          {children}
        </strong>
      );
    },
    em: ({ ...props }: any) => (
      <em className={`italic ${colors.accent} font-semibold`} {...props} />
    ),
    blockquote: ({ ...props }: any) => {
      let quoteClass = `border-l-4 ${colors.border} ${colors.bg} px-6 py-4 my-6 rounded-r-lg text-gray-700 italic`;
      return <blockquote className={quoteClass} {...props} />;
    },
    code: ({ inline, children, ...props }: any) => {
      if (inline) {
        return (
          <code className={`${colors.bg} px-2 py-1 rounded ${colors.accent} font-mono text-sm font-semibold`} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm" {...props}>
          {children}
        </code>
      );
    },
    pre: ({ ...props }: any) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm" {...props} />
    ),
    a: ({ ...props }: any) => (
      <a className={`${colors.accent} hover:opacity-80 underline transition-all font-semibold`} {...props} />
    ),
    table: ({ ...props }: any) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-gray-300">
        <table className="w-full border-collapse" {...props} />
      </div>
    ),
    thead: ({ ...props }: any) => {
      const gradientMap = {
        market: 'from-blue-600 to-blue-700',
        competition: 'from-emerald-600 to-emerald-700',
        risk: 'from-amber-600 to-amber-700',
        default: 'from-gray-600 to-gray-700',
      };
      return (
        <thead className={`bg-gradient-to-r ${gradientMap[section]}`} {...props} />
      );
    },
    th: ({ ...props }: any) => (
      <th className="px-6 py-3 text-left text-white font-semibold text-sm" {...props} />
    ),
    tbody: ({ ...props }: any) => (
      <tbody className="divide-y divide-gray-200" {...props} />
    ),
    tr: ({ ...props }: any) => (
      <tr className="hover:bg-gray-50 transition-colors" {...props} />
    ),
    td: ({ ...props }: any) => (
      <td className="px-6 py-4 text-gray-700 text-sm" {...props} />
    ),
    hr: ({ ...props }: any) => (
      <hr className={`my-8 border-t-2 ${colors.border}`} {...props} />
    ),
  };

  return (
    <div className="prose-custom max-w-none">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
