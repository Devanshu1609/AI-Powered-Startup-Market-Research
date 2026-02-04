import { useState, useMemo } from 'react';
import { ArrowLeft, FileText, BarChart3, Users, AlertTriangle, Grid3x3, Lightbulb, Copy, Check } from 'lucide-react';
import { ValidationResult } from '../types/validation';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ResultsPageProps {
  data: ValidationResult;
  onBack: () => void;
  error?: string | null;
}

type Section = 'idea' | 'market' | 'competition' | 'risk' | 'swot' | 'recommendations' | 'advice';

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function ResultsPage({ data, onBack, error }: ResultsPageProps) {
  const [activeSection, setActiveSection] = useState<Section>('idea');
  const [copied, setCopied] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { id: 'idea', label: 'Idea Analysis', icon: <Lightbulb className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
      { id: 'market', label: 'Market Analysis', icon: <BarChart3 className="w-5 h-5" />, color: 'from-emerald-500 to-emerald-600' },
      { id: 'competition', label: 'Competition', icon: <Users className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' },
      { id: 'risk', label: 'Risk Assessment', icon: <AlertTriangle className="w-5 h-5" />, color: 'from-orange-500 to-orange-600' },
      { id: 'swot', label: 'SWOT Analysis', icon: <Grid3x3 className="w-5 h-5" />, color: 'from-pink-500 to-pink-600' },
      { id: 'recommendations', label: 'Recommendations', icon: <FileText className="w-5 h-5" />, color: 'from-cyan-500 to-cyan-600' },
    ],
    []
  );

  const getContent = () => {
    switch (activeSection) {
      case 'idea':
        return { title: 'Idea Analysis', content: data.idea_analysis, section: 'default' as const };
      case 'market':
        return { title: 'Market Analysis', content: data.market_analysis, section: 'market' as const };
      case 'competition':
        return { title: 'Competition Analysis', content: data.competition_analysis, section: 'competition' as const };
      case 'risk':
        return { title: 'Risk Assessment', content: data.risk_assessment, section: 'risk' as const };
      case 'swot':
        return { title: 'SWOT Analysis', content: data.swot_analysis, section: 'default' as const };
      case 'recommendations':
        return { title: 'Advisor Recommendations', content: `**Recommendation:** ${data.advisor_recommendations}\n\n${data.advice}`, section: 'default' as const };
      default:
        return { title: 'Idea Analysis', content: data.idea_analysis, section: 'default' as const };
    }
  };

  const currentContent = getContent();
  const activeNav = navItems.find((item) => item.id === activeSection);

  const handleCopyIdea = () => {
    navigator.clipboard.writeText(data.startup_idea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-xl">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Startup Validation Report
              </h1>
              <p className="text-sm text-gray-600 mt-1">Comprehensive analysis and insights</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-72 bg-white border-r border-gray-200 overflow-y-auto sticky top-20 lg:h-screen lg:top-0">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Startup Idea</h2>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{data.startup_idea}</p>
                <button
                  onClick={handleCopyIdea}
                  className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Idea</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Sections</h2>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {activeSection === item.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </button>
              ))}
            </nav>

            {error && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">{error}</p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
            <div className="mb-12">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${activeNav?.color} text-white text-xs font-semibold mb-4`}>
                {activeNav?.icon}
                <span>{activeNav?.label}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{currentContent.title}</h1>

              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>

            <div className="prose-custom max-w-none">
              <article className="text-gray-700">
                <MarkdownRenderer content={currentContent.content} section={currentContent.section} />
              </article>
            </div>

            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      activeSection === item.id
                        ? `border-gray-900 bg-gray-50`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-2xl mb-2 ${activeSection === item.id ? 'opacity-100' : 'opacity-50'}`}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
