import React from "react";
import ReactMarkdown from "react-markdown";
import {
  ChevronRight,
  AlertCircle,
  Lightbulb,
  Shield,
  Rocket,
  Award,
  Flame,
  BarChart3,
  Target,
  Users,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import remarkGfm from "remark-gfm";

type SectionType = "market" | "competition" | "risk" | "default";

interface MarkdownRendererProps {
  content: string;
  section?: SectionType;
}

const sectionColors: Record<
  SectionType,
  { header: string; accent: string; bg: string; border: string; icon: string }
> = {
  market: {
    header: "text-blue-900",
    accent: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
  },
  competition: {
    header: "text-emerald-900",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
  },
  risk: {
    header: "text-amber-900",
    accent: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
  },
  default: {
    header: "text-gray-900",
    accent: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    icon: "text-gray-600",
  },
};

const extractText = (children: any): string => {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children?.props?.children) return extractText(children.props.children);
  return "";
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  section = "default",
}) => {
  const colors = sectionColors[section];

  const getListItemStyle = (children: any) => {
    const text = extractText(children).toLowerCase();
    if (text.includes("risk") || text.includes("challenge")) return "warning";
    if (text.includes("opportunity") || text.includes("growth")) return "success";
    if (text.includes("critical") || text.includes("threat")) return "error";
    return "default";
  };

  const getIcon = (children: any) => {
    const text = extractText(children).toLowerCase();
    if (text.includes("feature")) return <Rocket className="w-5 h-5" />;
    if (text.includes("strength") || text.includes("advantage"))
      return <Award className="w-5 h-5" />;
    if (text.includes("weakness")) return <AlertCircle className="w-5 h-5" />;
    if (text.includes("opportunity")) return <Lightbulb className="w-5 h-5" />;
    if (text.includes("threat") || text.includes("challenge"))
      return <Flame className="w-5 h-5" />;
    if (text.includes("market")) return <BarChart3 className="w-5 h-5" />;
    if (text.includes("target")) return <Target className="w-5 h-5" />;
    if (text.includes("competitor")) return <Users className="w-5 h-5" />;
    if (text.includes("benefit")) return <TrendingUp className="w-5 h-5" />;
    return <ChevronRight className="w-5 h-5" />;
  };

  const components = {
    h1: (props: any) => (
      <h1 className={`text-4xl font-bold ${colors.header} mt-10 mb-6`} {...props} />
    ),

    h2: ({ children }: any) => (
      <div className="flex items-center gap-4 mt-12 mb-6">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Briefcase className={`${colors.icon} w-6 h-6`} />
        </div>
        <h2 className={`text-3xl font-bold ${colors.header}`}>{children}</h2>
      </div>
    ),

    p: (props: any) => (
      <p className="text-gray-700 leading-8 mb-4 text-base" {...props} />
    ),

    ul: (props: any) => <ul className="space-y-4 my-6" {...props} />,
    ol: (props: any) => <ol className="space-y-4 my-6" {...props} />,

    li: ({ children }: any) => {
      const style = getListItemStyle(children);
      const icon = getIcon(children);

      const bgMap = {
        success: "bg-green-50 border-green-200",
        warning: "bg-amber-50 border-amber-200",
        error: "bg-red-50 border-red-200",
        default: "bg-white border-gray-200",
      };

      const iconColorMap = {
        success: "text-green-600",
        warning: "text-amber-600",
        error: "text-red-600",
        default: colors.icon,
      };

      return (
        <li
          className={`${bgMap[style]} border rounded-xl p-4 shadow-sm flex gap-4 items-start hover:shadow-md transition`}
        >
          <div className={`${iconColorMap[style]} mt-1`}>{icon}</div>
          <div className="text-gray-800 leading-relaxed">{children}</div>
        </li>
      );
    },

    strong: ({ children }: any) => {
      const text = extractText(children).toLowerCase();
      let badge = "bg-gray-100 text-gray-800";

      if (text.includes("high") || text.includes("critical"))
        badge = "bg-red-100 text-red-700";
      else if (text.includes("medium"))
        badge = "bg-amber-100 text-amber-700";
      else if (text.includes("low"))
        badge = "bg-green-100 text-green-700";
      else if (text.includes("opportunity"))
        badge = "bg-emerald-100 text-emerald-700";

      return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge}`}>
          {children}
        </span>
      );
    },

    blockquote: ({ children }: any) => {
      const text = extractText(children).toLowerCase();

      let style = "bg-blue-50 border-blue-200 text-blue-900";
      let Icon = Lightbulb;

      if (text.includes("risk") || text.includes("warning")) {
        style = "bg-amber-50 border-amber-200 text-amber-900";
        Icon = AlertCircle;
      }
      if (text.includes("critical") || text.includes("danger")) {
        style = "bg-red-50 border-red-200 text-red-900";
        Icon = Shield;
      }

      return (
        <div className={`border-l-4 p-5 rounded-xl my-6 flex gap-4 ${style}`}>
          <Icon className="w-6 h-6 mt-1" />
          <div className="italic leading-relaxed">{children}</div>
        </div>
      );
    },

    table: (props: any) => (
      <div className="my-10 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm" {...props} />
      </div>
    ),

    th: (props: any) => (
      <th
        className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${
          section === "market"
            ? "from-blue-600 to-blue-700"
            : section === "competition"
            ? "from-emerald-600 to-emerald-700"
            : section === "risk"
            ? "from-amber-600 to-amber-700"
            : "from-gray-700 to-gray-800"
        }`}
        {...props}
      />
    ),

    td: (props: any) => (
      <td className="px-6 py-4 text-gray-700 font-medium border-t" {...props} />
    ),

    hr: () => <hr className={`my-10 border-t-2 ${colors.border}`} />,
  };

  return (
    <div className="max-w-none">
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={components}
>
  {content}
</ReactMarkdown>
    </div>
  );
};
