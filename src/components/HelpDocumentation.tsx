import React, { useState } from "react";
import {
  HelpCircle,
  Book,
  Video,
  FileText,
  MessageCircle,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  type: "guide" | "video" | "faq" | "regulation";
  description: string;
  readTime?: string;
  content?: string;
}

const helpArticles: HelpArticle[] = [
  {
    id: "1",
    title: "Getting Started with GACE",
    category: "Basics",
    type: "guide",
    description:
      "Learn how to set up your account, link your assets, and configure jurisdictions for comprehensive compliance tracking.",
    readTime: "5 min",
    content:
      "GACE (Global Asset Compliance Engine) is designed to help UK residents manage tax compliance for overseas assets. Start by adding your jurisdictions, then import your asset holdings from brokerage statements or manual entry.",
  },
  {
    id: "2",
    title: "Understanding Double Taxation Agreements (DTAs)",
    category: "Tax Concepts",
    type: "guide",
    description:
      "Comprehensive guide to how DTAs work between the UK and Nigeria, UAE, India, and other countries to prevent double taxation.",
    readTime: "12 min",
    content:
      "Double Taxation Agreements are treaties between countries that prevent the same income or gains from being taxed twice. The UK has comprehensive agreements with Nigeria, UAE, India, and Kenya that allow you to claim foreign tax credits.",
  },
  {
    id: "3",
    title: "Capital Gains Tax for UK Residents with Foreign Assets",
    category: "Tax Concepts",
    type: "guide",
    description:
      "Detailed explanation of how UK CGT applies to worldwide gains, including calculation methods and exemptions.",
    readTime: "10 min",
    content:
      "As a UK resident, you're liable for Capital Gains Tax on your worldwide gains. This includes gains from foreign equities, property, and other assets. The current CGT rates are 10% for basic rate taxpayers and 20% for higher rate taxpayers.",
  },
  {
    id: "4",
    title: "ML Tax Engine: How It Works",
    category: "Features",
    type: "video",
    description:
      "Video walkthrough of the machine learning tax engine and how it analyzes multiple tax regimes to optimize your compliance strategy.",
    readTime: "8 min",
  },
  {
    id: "5",
    title: "Recording Asset Disposals",
    category: "How-To",
    type: "guide",
    description:
      "Step-by-step guide to recording disposal transactions and ensuring accurate cost basis calculations for CGT purposes.",
    readTime: "6 min",
    content:
      "To record a disposal, navigate to Global Asset Scanner, select the asset, and click 'Record Disposal'. Enter the disposal date, proceeds, and any transaction costs. The system will automatically calculate your gain or loss.",
  },
  {
    id: "6",
    title: "Nigerian Tax Obligations for UK Residents",
    category: "Jurisdictions",
    type: "guide",
    description:
      "Understanding your tax obligations in Nigeria as a UK resident, including withholding tax and CGT on Nigerian assets.",
    readTime: "9 min",
    content:
      "Nigeria imposes a 10% CGT on disposal of shares and securities. As a UK resident, you must also report these gains to HMRC, but can claim foreign tax credit for the Nigerian tax paid to avoid double taxation.",
  },
  {
    id: "7",
    title: "UAE Property Holdings and UK Tax",
    category: "Jurisdictions",
    type: "guide",
    description:
      "Special considerations for UK residents holding UAE property, including zero CGT in UAE and UK reporting requirements.",
    readTime: "7 min",
    content:
      "The UAE does not impose Capital Gains Tax on most property transactions. However, as a UK resident, you must still report gains from UAE property sales to HMRC and pay UK CGT on any gains realized.",
  },
  {
    id: "8",
    title: "HMRC Reporting Requirements",
    category: "Compliance",
    type: "regulation",
    description:
      "Official guidance on HMRC reporting requirements for foreign income and gains, including Self Assessment deadlines.",
    readTime: "15 min",
    content:
      "UK residents must report all worldwide income and gains on their Self Assessment tax return. The deadline for online filing is 31 January following the end of the tax year (which runs from 6 April to 5 April).",
  },
  {
    id: "9",
    title: "What happens if I miss a filing deadline?",
    category: "FAQ",
    type: "faq",
    description: "Information about penalties and procedures for late filing.",
    content:
      "HMRC imposes automatic penalties for late filing: £100 if your return is up to 3 months late, with additional penalties for longer delays. Contact HMRC immediately if you think you'll miss a deadline.",
  },
  {
    id: "10",
    title: "How does the ML engine calculate tax scenarios?",
    category: "FAQ",
    type: "faq",
    description: "Understanding the AI-powered tax calculation methodology.",
    content:
      "The ML Tax Engine uses machine learning trained on thousands of cross-border tax scenarios. It analyzes your portfolio, acquisition dates, and current values to simulate different disposal scenarios and calculate optimal tax strategies.",
  },
  {
    id: "11",
    title: "Can I use GACE for other countries besides Nigeria, UAE, India?",
    category: "FAQ",
    type: "faq",
    description: "Information about supported jurisdictions and expansion plans.",
    content:
      "Currently, GACE supports Nigeria, UAE, India, Kenya, and major Western jurisdictions. We're continuously adding support for additional countries. Contact support if you need a specific jurisdiction.",
  },
];

export const HelpDocumentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(
    null
  );

  const categories = [
    "all",
    ...Array.from(new Set(helpArticles.map((a) => a.category))),
  ];

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: HelpArticle["type"]) => {
    switch (type) {
      case "guide":
        return <Book className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "faq":
        return <HelpCircle className="h-5 w-5" />;
      case "regulation":
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: HelpArticle["type"]) => {
    switch (type) {
      case "guide":
        return "text-indigo-400";
      case "video":
        return "text-purple-400";
      case "faq":
        return "text-emerald-400";
      case "regulation":
        return "text-amber-400";
    }
  };

  const getTypeLabel = (type: HelpArticle["type"]) => {
    switch (type) {
      case "guide":
        return "Guide";
      case "video":
        return "Video";
      case "faq":
        return "FAQ";
      case "regulation":
        return "Regulation";
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
            <HelpCircle className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-100">
              Help & Documentation
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Comprehensive guides, tutorials, and resources to help you navigate
              cross-border tax compliance with GACE.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <button className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-indigo-500/50 hover:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <Book className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="font-semibold text-slate-100">User Guide</div>
              <div className="text-xs text-slate-400">Complete documentation</div>
            </div>
          </div>
        </button>

        <button className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-purple-500/50 hover:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <Video className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="font-semibold text-slate-100">Video Tutorials</div>
              <div className="text-xs text-slate-400">Watch & learn</div>
            </div>
          </div>
        </button>

        <button className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-emerald-500/50 hover:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <MessageCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold text-slate-100">Contact Support</div>
              <div className="text-xs text-slate-400">Get help from experts</div>
            </div>
          </div>
        </button>

        <button className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-amber-500/50 hover:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
              <FileText className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="font-semibold text-slate-100">HMRC Resources</div>
              <div className="text-xs text-slate-400">Official guidance</div>
            </div>
          </div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-left transition-all hover:border-indigo-500/50 hover:bg-slate-900"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 ${getTypeColor(
                  article.type
                )}`}
              >
                {getTypeIcon(article.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300">
                      {article.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      <span className="text-slate-400">{article.category}</span>
                      <span className="text-slate-600">•</span>
                      <span className={getTypeColor(article.type)}>
                        {getTypeLabel(article.type)}
                      </span>
                      {article.readTime && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">
                            {article.readTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {article.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-4 font-semibold text-slate-100">
            No articles found
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Popular Topics */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="mb-4 font-semibold text-slate-100">Popular Topics</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "UK Self Assessment Deadlines",
            "Double Taxation Relief",
            "Foreign Tax Credits",
            "CGT Annual Exemption",
            "Nigerian Dividend Withholding Tax",
            "UAE Property Tax Rules",
            "Recording Asset Disposals",
            "ML Tax Engine Confidence Scores",
          ].map((topic) => (
            <button
              key={topic}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2 text-left text-sm text-slate-300 transition-all hover:border-indigo-500/50 hover:text-slate-100"
            >
              <span>{topic}</span>
              <ExternalLink className="h-4 w-4 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* External Resources */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="mb-4 font-semibold text-slate-100">
          External Tax Resources
        </h3>
        <div className="space-y-3">
          {[
            {
              title: "HMRC Self Assessment",
              url: "www.gov.uk/self-assessment-tax-returns",
              description: "Official HMRC guidance on Self Assessment",
            },
            {
              title: "UK-Nigeria Double Taxation Agreement",
              url: "www.gov.uk/government/publications",
              description: "Full text of the UK-Nigeria DTA treaty",
            },
            {
              title: "Capital Gains Tax Rates and Allowances",
              url: "www.gov.uk/capital-gains-tax",
              description: "Current CGT rates and annual exemption amounts",
            },
            {
              title: "Foreign Tax Credit Relief",
              url: "www.gov.uk/tax-foreign-income",
              description: "How to claim relief for foreign tax paid",
            },
          ].map((resource) => (
            <a
              key={resource.title}
              href={`https://${resource.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-slate-800/50 p-3 transition-all hover:border-indigo-500/50"
            >
              <div className="flex-1">
                <div className="font-medium text-slate-100">{resource.title}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {resource.description}
                </div>
                <div className="mt-1 text-xs text-indigo-400">
                  {resource.url}
                </div>
              </div>
              <ExternalLink className="h-5 w-5 flex-shrink-0 text-slate-500" />
            </a>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 ${getTypeColor(
                    selectedArticle.type
                  )}`}
                >
                  {getTypeIcon(selectedArticle.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {selectedArticle.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    <span className="text-slate-400">
                      {selectedArticle.category}
                    </span>
                    {selectedArticle.readTime && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">
                          {selectedArticle.readTime}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="rounded-lg p-2 hover:bg-slate-800"
              >
                <span className="text-slate-400">✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-slate-100">
                  Overview
                </h4>
                <p className="text-sm text-slate-300">
                  {selectedArticle.description}
                </p>
              </div>

              {selectedArticle.content && (
                <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-100">
                    Content
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {selectedArticle.content}
                  </p>
                </div>
              )}

              {selectedArticle.type === "video" && (
                <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-900">
                    <div className="text-center">
                      <Video className="mx-auto h-12 w-12 text-slate-600" />
                      <p className="mt-2 text-sm text-slate-400">
                        Video content would be displayed here
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-medium text-slate-100 hover:border-indigo-500 hover:bg-slate-700">
                  Was this helpful?
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
